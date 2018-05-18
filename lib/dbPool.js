const idbp = require('./idb-pconnector');

/**
 * Uses the Connection class implemented in idb-pconnector.
 */
class DBPoolConnection {
  /**
   * Constructor to instantiate a new instance of a DBPoolConnection class given the `poolIndex` and `config`
   * @param poolIndex An identifier for debug purposes
   * @param config Object includes `database`
   */
  constructor(poolIndex, config = {
    database: {
      url: '*LOCAL'
    }
  }) {
    let me = this,
      {
        database
      } = config;

    // Defaults are initialized if `config` does not have all properties defined at instantiation.
    me.database = database || {
      url: '*LOCAL'
    };
    me.poolIndex = poolIndex;
    me.available = true;
    me.SQL_PARAM_INPUT = idbp.SQL_PARAM_INPUT;
    me.SQL_HANDLE_STMT = idbp.SQL_HANDLE_STMT;
    me.newConnection();
    me.newStatement();
  }

  /**
   * Instantiates a new Connection instance
   */
  newConnection() {
    let me = this,
      {
        url,
        username = '',
        password = ''
      } = me.database,
      isLocal = url === '*LOCAL';

    me.conn = new idbp.Connection();
    if (isLocal) {
      me.conn.connect(url);
    } else {
      // Username and Password are assumed blank if not specified with non-local URL.
      me.conn.connect(url, username, password);
    }
  }

  /**
   * Instantiates a new Statement instance for the Connection
   * @returns The new statement for the connection
   */
  async newStatement() {
    let me = this;

    if (me.stmt) {
      try {
        await me.stmt.close();
      } catch (error) {
        return 'Statement failed to close. New Statement could not be created.';
      }
    }

    me.stmt = me.conn.getStatement();

    return me.stmt;
  }

  getStatement() {
    return this.stmt;
  }

  /**
   * Closes the connection
   */
  async close() {
    let me = this;

    try {
      await me.conn.disconn();
      await me.conn.close();
    } catch (error) {
      return error;
    }

    return true;
  }

  /**
   * Creates a new statement
   * @param retire If true, retires the connection so it can be removed from the pool
   * @returns True if retiring, or the detached connection
   */
  async detach(retire = false) {
    let me = this;

    try {
      if (retire) {
        await me.close();
      } else {
        await me.newStatement();
        me.setAvailable(true);
      }
    } catch (error) {
      return `Connection failed to ${retire ? 'retire' : 'detach'}. Connection will be retired until the process exits.`;
    }

    return retire ? true : me;
  }

  isAvailable() {
    return this.available;
  }

  setAvailable(availability) {
    this.available = availability;
  }
}

/**
 * Manages a list of DBPoolConnection instances.
 * Once a connection is added to the list, it cannot be removed.
 */
class DBPool {
  /**
   * Constructor to instantiate a new instance of a DBPool class given the `database` and `config`
   * @param database Object includes the `url`, `username`, and `password`. `username` and `password` assumed blank if not specified with non-local URL.
   * @param config Object includes the `incrementSize` and `debug`. Setting debug = true will display message logs.
   */
  constructor(database = {
    url: '*LOCAL'
  }, config = {
    incrementSize: 8,
    debug: false
  }) {
    let me = this,
      {
        incrementSize,
        debug
      } = config,
      i;

    me.connections = [];

    // Defaults are initialized if `config` does not have all properties defined at instantiation.
    me.database = database || {
      url: '*LOCAL'
    };
    me.incrementSize = incrementSize || 8;
    me.debug = debug || false;

    for (i = 0; i < me.incrementSize; i++) {
      me.createConnection(i);
    }
  }

  /**
   * Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
   * Assumes the database of the pool when establishing the connection.
   * @param index An identifier for debug purposes
   */
  createConnection(index) {
    let me = this,
      connections = me.connections;

    // Indices can only be > 0 if integer-based
    if (typeof index === 'undefined' || (Number.isInteger(index) && index < 0)) {
      index = connections.length;
    }

    me.log(`Creating Connection ${index}...`);
    me.connections.push(new DBPoolConnection(index, {
      database: me.database,
      debug: me.debug
    }));
    me.log(`Connection ${index} created`);
  }

  /**
   * Frees all connections in the pool (Sets "Available" back to true for all)
   * closes any stmts and gets a new stmt.
   */
  async detachAll() {
    let me = this,
      connections = me.connections,
      connection = {};

    for (connection of connections) {
      try {
        await me.detach(connection);
      } catch (error) {
        return `Error detaching all connections.\n${error}`;
      }
    }

    return true;
  }

  /**
   * Retires (Removes) all connections from being used again
   */
  async retireAll() {
    let me = this,
      connections = me.connections;
    await me.detachAll();

    while (connections.length){
      connections.pop();
    }

  }


  /**
   * Frees a connection (Returns the connection "Available" back to true)
   * closes any stmts and gets a new stmt.
   * @param connection
   */
  async detach(connection) {
    let me = this,
      index = connection.poolIndex;

    me.log(`Detaching Connection ${index}...`);
    try {
      await connection.detach();
    } catch (error) {
      return error;
    }
    me.log(`Connection ${index} detached`);
  }

  /**
   * Retires a connection from being used and removes it from the pool
   * @param connection
   */
  async retire(connection) {
    let me = this,
      connections = me.connections,
      index = connection.poolIndex;

    me.log(`Retiring Connection ${index}...`);
    try {
      await connection.detach(true);

      // Remove the connection from the pool
      connections.splice(connections.indexOf(connection), 1);
    } catch (error) {
      return error;
    }
    me.log(`Connection ${index} retired`);
  }

  /**
   * Finds and returns the first available Connection.
   */
  attach() {
    let me = this,
      validConnection = false,
      connections = me.connections,
      connectionsLength = connections.length,
      incrementSize = me.incrementSize,
      connection,
      i,
      j;

    me.log(`Finding available Connection...`);
    while (!validConnection) {
      for (i = 0; i < connectionsLength; i++) {
        connection = connections[i];

        if (connection.isAvailable()) {
          me.log(`Connection ${connection.poolIndex} found`);
          connection.setAvailable(false);

          return connection;
        }
      }

      me.log(`Maximum available connections reached.`);
      j = connectionsLength;

      for (i = 0; i < incrementSize; i++) {
        me.createConnection(j + i);
      }

      connectionsLength += incrementSize;

      me.log(`Increased connections by ${incrementSize} to ${connectionsLength} (total).`);
    }
  }
  /**
   *
   * @param {*} message
   */
  log(message = '') {
    if (this.debug) {
      console.log(message);
    }
  }

  /**
   * Shorthand to exec a statement , just provide the sql to run.
   * @param {string} sql - the sql statment to execute.
   * @return {array} - if the SQL returns a result set it is returned as an array of objects.
   *  else if no result set is available null is returned. caller should check if null is returned.
   */
  async runSql(sql = '') {
    let me = this,
      connection = me.attach(),
      statement = connection.getStatement(),
      resultSet = [];
    try {
      me.log(`Executing SQL...\nSQL Statement: ${sql}`);
      resultSet = await statement.exec(sql);
      me.log(`Executed SQL`);
    } catch (err) {
      me.log(`SQL Error: ${err}`);
      await me.retire(connection);
    }
    try {
      await me.detach(connection);
    } catch (error) {
      await me.retire(connection);
      console.log(`Connection Error: ${error}`);
    }
    if (!resultSet.length){
      me.log('SQL did not return a result set.');
      return null;
    }
    me.log(`Fetched Result Set`);
    return resultSet;
  }

  /**
   * Shortcut to prepare ,bind, and execute. Just provide the sql and the params as an array.
   * @param {string} sql - the sql to prepare , include parameter markers (?, ?, ...)
   * @param {array} [params] - an optional array of values to bind. order of the values in the array must match the
   * order of the desired parameter marker in the sql string.
   * @return {array} - if the Prepared SQL returns result set it is returned as an array of objects.
   * else null will be returned indicating that there ws no result set.
   */
  async prepareExecute(sql = '', params = []) {
    let me = this,
      connection = me.attach(),
      statement = connection.getStatement(),
      resultSet = [],
      outParams = [];
    try {
      me.log(`Preparing Statement...`);
      await statement.prepare(sql);
      if (params.length > 0){
        me.log(`Binding Parameters...`);
        await statement.bindParam(me.formatParams(params));
      }
      outParams = await statement.execute();
    } catch (err) {
      me.log(` SQL Error: ${err}`);
      me.retire(connection);
    }
    try {
      me.log(`Fetching Result Set...`);
      resultSet = await statement.fetchAll();
      me.log(`Fetched Result Set`);
    } catch (err){
      //tried to get the results no were results were available.
      //this is normal behavior for some queries for example "INSERT" or "UPDATE"
      me.log('SQL did not return a result set.');
    }
    try {
      await connection.detach();
    } catch (err){
      me.log(`Connection Err:\n ${err}`);
      await me.retire(connection);
    }
    if (!resultSet.length){
      return null;
    }
    return resultSet;
  }

  /**
   *Internal helper function to format params and set Param Indicator & Bind Type
   * @param {array} params - an array of values to bind. type of values should be (string , number , or null)
   */
  formatParams(params) {
    let boundParams = [],
      me = this;
    for ( let parameter of params  ){
      if (typeof parameter === 'string'){
        boundParams.push([parameter, idbp.SQL_PARAM_INPUT_OUTPUT, idbp.SQL_BIND_CHAR]);
      } else if (typeof parameter === 'number') {
        boundParams.push( [parameter, idbp.SQL_PARAM_INPUT_OUTPUT, idbp.SQL_BIND_NUMERIC] );
      } else if (typeof parameter === null) {
        boundParams.push([parameter, idbp.SQL_PARAM_INPUT_OUTPUT, idbp.SQL_BIND_NULL_DATA]);
      } else {
        me.log(`Parameter that caused error was ${JSON.stringify(parameter)}`);
        throw TypeError('Parameters to bind should be string , number , or null');
      }
    }
    me.log(`Size of BoundParams: ${boundParams.length} \n ${JSON.stringify(boundParams)}`);
    return boundParams;
  }
}
exports.DBPool = DBPool;
exports.DBPoolConnection = DBPoolConnection;

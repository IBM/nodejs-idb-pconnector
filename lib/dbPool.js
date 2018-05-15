const idbp = require('./idb-pconnector');

/**
 * Uses the Connection class implemented in idb-pconnector.
 */
class DBConnection {
  /**
   * Constructor to instantiate a new instance of a DBConnection class given the `poolIndex` and `config`
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
 * Manages a list of DBConnection instances.
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
   * Instantiates a new instance of DBConnection with an `index` and appends it to the pool.
   * Assumes the database of the pool when establishing the connection.
   * @param index An identifier for debug purposes
   */
  createConnection(index) {
    let me = this,
      connections = me.connections;

    // Indices can only be > 0 if integer-based
    if (typeof index === 'undefined' || (Number.isInteger(index) && index < 0)) {
      index = connections.length + 1;
    }

    me.log(`Creating Connection ${index}...`);
    me.connections.push(new DBConnection(index, {
      database: me.database,
      debug: me.debug
    }));
    me.log(`Connection ${index} created`);
  }

  /**
   * Frees all connections in the pool
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
   * Retires all connections from being used again
   */
  async retireAll() {
    let me = this,
      i = me.connections.length;

    while (i--) {
      try {
        await me.retire(i);
      } catch (error) {
        return `Error retiring all connections.\n${error}`;
      }
    }

    return true;
  }

  /**
   * Frees a connection
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
  validateSql(sql){
    if (sql && typeof sql === 'string'){
      return true;
    }
    throw TypeError('Must Provide SQL as a String');
  }
  /**
   * Shorthand to execute a statemnt , just provide the sql to execute.
   * @param {string} sql - the sql statment to execute.
   * @return {array} - if the SQL returns a result set it is returned as an array of objects.
   */
  async query(sql = '') {
    this.validateSql(sql);
    let conn = this.attach();
    try {
      let results = await conn.getStatement().exec(sql);
      return results;
    } catch (err) {
      this.log(err);
      this.retire(conn);
    } finally {
      conn.detach();
    }
  }
  /**
   * Method to prepare SQL statement and execute it
   * @param {string} sql - the SQL to prepare and execute.
   * @return {array} - if the Prepared SQL has output params it will be returned.
   * otherwise attempts returns result set it is returned as an array of objects.
   * Caller should check that the return array.length === 0 , therefore indicating no output or results.
   */
  async pe(sql = '') {
    this.validateSql(sql);
    let conn = this.attach();
    try {
      await conn.getStatement().prepare(sql);
      let outputParams = await conn.getStatement().execute();
      //by default will return array of length zero
      //so check that if the length is greater than 0
      if (outputParams.length > 0){
        return outputParams;
      }
      let resultSet = [];
      try {
        resultSet = await conn.getStatement().fetchAll();
      } catch (err){
        //tried to get the results no were results were available.
        //this is normal behavior for some querries for example "INSERT" or "UPDATE"
        this.log('SQL did not return a result set.');
      }
      return resultSet;
    } catch (err) {
      this.log(err);
      this.retire(conn);
    } finally {
      conn.detach();
    }
  }
  /**
   * Shortcut to prepare ,bind, and execute. Just provide the sql and the params as an array.
   * @param {string} sql - the sql to prepare , include parameter markers (?, ?, ...)
   * @param {array} params - an array of objects to bind.
   * Required Keys:(value , type) value = the param's value type can be = in or inout.
   * Depending on if the param to bind is input param or inout param. defaults to in if none specified.
   * @return {array} - if the Prepared SQL returns result set it is returned as an array of objects.
   */
  async pbe(sql = '', params = []) {
    this.validatePbe(sql, params);
    let conn = this.attach();
    try {
      conn.getStatement().prepare(sql);
      let alignedParams = this.alignParams(params);
      await conn.getStatement().bindParam(alignedParams);
      let outputParams = await conn.getStatement().execute();
      if (outputParams.length > 0){
        return outputParams;
      }
      let resultSet = [];
      try {
        resultSet = await conn.getStatement().fetchAll();
      } catch (err){
        //tried to get the results no were results were available.
        //this is normal behavior for some querries for example "INSERT" or "UPDATE"
        this.log('SQL did not return a result set.');
      }
      return resultSet;
    } catch (err) {
      this.log(err);
      this.retire(conn);
    } finally {
      conn.detach();
    }
  }
  /**
   * Internal helper function to perform a check on the input params
   * @param {string} sql
   * @param {array} params
   */
  validatePbe(sql, params) {
    if ( typeof sql === 'string' && Array.isArray(params) && sql !== '' && params.length !== 0) {
      return true;
    }
    throw TypeError('SQL must be a String , Params Must be an Array');
  }
  /**
   *Internal helper function to align params and set PARAM_INPUT & Bind Type
   * @param {array} params - an array of objects to bind. Keys:(value , type) value = the param type = in or inout
   */
  alignParams(params) {
    let bindedParams = [];
    for (let i = 0; i<params.length; i++){
      if (params[i].type === undefined || params[i].type !== 'inout'
            && params[i].type !== 'out' ){
        params[i]['type'] = idbp.SQL_PARAM_INPUT;
      }
      //Set the desired Param Type specified by the user
      if (params[i].type === 'inout'){
        params[i].type = idbp.SQL_PARAM_INPUT_OUTPUT;
      } else if (params[i].type === 'out'){
        params[i].value = idbp.SQL_PARAM_OUTPUT;
      }
      //Check the type of the value specifed to bind it correctly
      if (typeof params[i].value === 'string') {
        bindedParams[i] = [params[i].value, params[i].type, idbp.SQL_BIND_CHAR];
      } else if (typeof params[i].value === 'number') {
        bindedParams[i] = [params[i].value, params[i].type, idbp.SQL_BIND_NUMERIC];
      } else if (typeof params[i].value === null) {
        bindedParams[i] = [params[i], params[i].type, idbp.SQL_BIND_NULL_DATA];
      } else {
        this.log(`Type is: ${typeof params[i].type }`);
        this.log(`Param that caused error was ${JSON.stringify( params[i])} during ${i} iteration`);
        throw TypeError('Object to bind key name must be \'value\' && be string , number , or null');
      }
    }
    return bindedParams;
  }

}
exports.DBPool = DBPool;

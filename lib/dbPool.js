const idbp = require('./idb-pconnector');

/**
 * Uses and Extends the Connection class implemented in idb-pconnector.
 */
class DBPoolConnection {
  /**
   * Constructor to instantiate a new instance of a DBPoolConnection class given the `poolIndex` and `config`
   * @param {number} poolIndex An identifier for debug purposes
   * @param {object} config Object includes `database`
   */
  constructor(poolIndex, config = {
    database: {
      url: '*LOCAL'
    }
  }) {
    let me = this,
      {
        database,
        options
      } = config;

    // Defaults are initialized if `config` does not have all properties defined at instantiation.
    me.database = database || {
      url: '*LOCAL'
    };
    me.options = options || {
      debug :false
    };
    me.poolIndex = poolIndex;
    me.available = true;
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
      {
        debug
      } = me.options;

    me.connection = new idbp.Connection();

    if (!username && !password) {
      // should be connecting '*LOCAL',that's the only way to connect w/o username, password.
      me.connection.connect(url);
    } else {
      // connecting to remote url or username, password was provided.
      me.connection.connect(url, username, password);
    }
    // if debug = true, turn it on @ the idb level.
    debug ? me.connection.debug(true) : debug = false;
  }

  /**
   * Instantiates a new Statement instance for the Connection if one is not set and returns it.
   * Otherwise will close the previous statement and return a new statement
   * @returns {Statement} new statement from the connection
   */
  async newStatement() {
    let me = this,
      reason;

    if (me.statement) {
      try {
        await me.statement.close();
      } catch (error) {
        reason = new Error('Statement failed to close. New Statement could not be created.');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        throw reason;
      }
    }

    me.statement = me.connection.getStatement();

    return me.statement;
  }
  /**
   * @returns {Statement} returns the handle to the Statement.
  */
  getStatement() {
    return this.statement;
  }

  /**
   * Closes the connection
   */
  async close() {
    let me = this,
      reason;

    try {
      await me.connection.disconn();
      await me.connection.close();
    } catch (error) {
      reason = new Error('Connection failed to close');
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }

    return true;
  }

  /**
   * Cleans up the old statement and gets a new one, if retiring closes the connection.
   * @param {boolean} retire If true, retires the connection so it can be removed from the pool
   * @returns {boolean | object} True if retiring, or the detached connection
   */
  async detach(retire = false) {
    let me = this,
      reason;

    try {
      if (retire) {
        await me.close();
      } else {
        await me.newStatement();
        me.setAvailable(true);
      }
    } catch (error) {
      reason = new Error(`DBPoolConnection: failed to ${retire ? 'retire' : 'detach'}.`);
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }

    return retire ? true : me;
  }
  /**
   * @returns {boolean} true if the connection is available , false if the connection is unavailable.
  */
  isAvailable() {
    return this.available;
  }
  /**
   *
   * @param {boolean} availability - true or false to set the availablilty flag of the connection.
   */
  setAvailable(availability) {
    this.available = availability;
  }
}

/**
 * Manages a list of DBPoolConnection instances.
 *
 */
class DBPool {
  /**
   * Manages a list of DBPoolConnection instances.
   * Constructor to instantiate a new instance of a DBPool class given the `database` and `config`
   * @param {object} database - Object includes the `url`, `username`, and `password`.
   * @param {object} config - Object includes the `incrementSize` and `debug`.
   * @constructor
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
   * @param {number} index - An identifier to id the connection for debug purposes.
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
      options: {
        debug: me.debug
      }
    }));
    me.log(`Connection ${index} created`);
  }

  /**
   * Frees all connections in the pool (Sets "Available" back to true for all)
   * closes any statements and gets a new statement.
   * @returns {boolean} - true if all were detached succesfully
   */
  async detachAll() {
    let me = this,
      connections = me.connections,
      connection = {},
      reason;

    for (connection of connections) {
      try {
        await me.detach(connection);
      } catch (error) {
        reason = new Error('DBPool: Failed to detachAll()');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        throw reason;
      }
    }

    return true;
  }

  /**
   * Retires (Removes) all connections from being used again
   * @returns {boolean} - true if all were retired succesfully
   */
  async retireAll() {
    let me = this,
      connections = me.connections,
      reason;

    try {
      await me.detachAll();

      while (connections.length){
        connections.pop();
      }
    } catch (error){
      reason = new Error('DBPool: Failed to retireAll()');
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }
    return true;
  }


  /**
   * Frees a connection (Returns the connection "Available" back to true)
   * closes any statements and gets a new statement.
   * @param {DBPoolConnection} connection
   * @returns {boolean} - true if detached succesfully
   */
  async detach(connection) {
    let me = this,
      index = connection.poolIndex,
      reason;

    me.log(`Detaching Connection ${index}...`);
    try {
      await connection.detach();
    } catch (error) {
      reason = new Error('DBPool: Failed to detach()');
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }
    me.log(`Connection ${index} detached`);
    return true;
  }

  /**
   * Retires a connection from being used and removes it from the pool
   * @param {DBPoolConnection} connection
   */
  async retire(connection) {
    let me = this,
      connections = me.connections,
      index = connection.poolIndex,
      reason;

    me.log(`Retiring Connection ${index}...`);
    try {
      await connection.detach(true);

      // Remove the connection from the pool
      connections.splice(connections.indexOf(connection), 1);
    } catch (error) {
      reason = new Error(`DBPool: Failed to retire() Connection #${poolIndex}`);
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }
    me.log(`Connection ${index} retired`);
  }

  /**
   * Finds and returns the first available Connection.
   * @returns {DBPoolConnection} - one connection from the DBPool.
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
   * Internal function used to log debug information to the console.
   * @param {string} message - the message to log.
   */
  log(message = '') {
    if (this.debug) {
      process.stdout.write(`${message}\n`);
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
      resultSet = [],
      reason;


    me.log(`Executing SQL...\nSQL Statement: ${sql}`);
    resultSet = await statement.exec(sql)
      .catch(async (error) => {
        reason = new Error('runSql: Failed to exec()');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await me.detach(connection);
        throw reason;
      });

    me.log(`Executed SQL`);
    await connection.detach()
      .catch(async (error) => {
        reason = new Error('runSql: Failed to detach() the connection');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await me.retire(connection);
        throw reason;
      });

    if (!resultSet){
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
   * @return {object} - In the Format: {resultSet: [], outputParams: []}
   * if the Prepared SQL returns result set it is returned as an array of objects.
   * if the Prepared SQL returns output parameters it is returned as an array of objects/
   * else null will be returned indicating that there is no result set or outputParams.
   */
  async prepareExecute(sql = '', params = [], options = {}) {
    let me = this,
      connection = me.attach(),
      statement = connection.getStatement(),
      resultSet = null,
      outParams = null,
      data = {},
      reason;

    me.log(`Preparing Statement...`);
    await statement.prepare(sql)
      .catch(async (error) => {
        reason = new Error('PE: Failed to prepare() the Statement');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await me.detach(connection);
        throw reason;
      });

    if (params.length > 0){
      me.log(`Binding Parameters...`);
      await statement.bindParam(me.setupParams(params, options))
        .catch(async (error) => {
          reason = new Error('PE: Failed to bindParam()');
          reason.stack += `\nCaused By:\n ${error.stack}`;
          await me.detach(connection);
          throw reason;
        });
    }
    // execute() returns an empty [] when no outParams availble, if bindParams was called first.
    outParams = await statement.execute()
      .catch(async (error) => {
        reason = new Error('PE: Failed to execute() statement');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await me.detach(connection);
        throw reason;
      });

    if (outParams !== null){
      // set outParams to null if its an empty []
      outParams.length === 0 ? outParams = null : outParams = outParams;
    }

    me.log(`Fetching Result Set...`);
    resultSet = await statement.fetchAll()
      .catch ( () => {
        //tried to get the results no were results were available.
        //this is normal behavior for some queries for example "INSERT" or "UPDATE"
        me.log('SQL did not return a result set.');
      });

    await connection.detach()
      .catch(async (error) => {
        reason = new Error('PE: Failed to detach() the connection');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await me.retire(connection);
        throw reason;
      });
    // no resultSet or outParams to return
    if (!resultSet && !outParams){
      return null;
    }
    // return resultSet if its not null and length is not 0
    if (resultSet && resultSet.length){
      data.resultSet = resultSet;
    }
    // return outParams if its not null
    if (outParams){
      data.outputParams = outParams;
    }
    // return null if data object is still empty
    if (Object.keys(data).length === 0){
      return null;
    }
    return data;
  }

  /**
   *Internal helper function to format params and set Param Indicator & Bind Type
   * @param {array} params - an array of values to bind. type of values should be (string , number , or null)
   * @param {object} options - an object with config options to set for all parameters.
   * Currently, the input/output indicatior is the only available option to set. {io: in | out | both}.
   * This will overide the default which is to bind as 'both'.
   * @returns {array} - an array of bounded params properly formated to use.
   */
  setupParams(params, options) {
    let boundParams = [],
      me = this,
      {io} = options,
      parameter;

    io = io || 'both';

    for ( parameter of params  ){
      if (parameter instanceof Object){
        let {value, asClob = false} = parameter;

        if (!value){
          throw new Error('The parameter object must define a value property');
        }
        // assigning the value of io from the parameter object to the io variable declared before.
        // if io from parameter object is undefined default back to value of io from before.
        ({io = io} = parameter);
        // allows customization of io for an individual parameter.
        me.formatParams(boundParams, value, {io, asClob});
      } else {
        // when just passing values but would like to overide default io (INPUT_OUTPUT)
        me.formatParams(boundParams, parameter, {io});
      }
    }
    me.log(`Size of BoundParams: ${boundParams.length} \n ${JSON.stringify(boundParams)}`);
    return boundParams;
  }
  /**
   *Internal helper function to format params and set Param Indicator & Bind Type
   * @param {array} boundParams - the array to push the formatted parmeter.
   * @param {object} options - an object with config options {io: in | out | both, asClob: true | false}.
   */
  formatParams(boundParams, value, options){
    let {io, asClob} = options;

    io = idbp[`${io === 'both' ? 'INOUT': io.toUpperCase()}`];

    if (typeof value === 'string'){ //String
      if (asClob){ //as clob
        boundParams.push([value, io, idbp.CLOB]);
      } else { // as string
        boundParams.push([value, io, idbp.CHAR]);
      }
    } else if (typeof value === 'number') { //Number
      boundParams.push([value, io, idbp[`${Number.isInteger(value) ? 'INT' : 'NUMERIC'}`]]);
    } else if (value === null) { //Null
      boundParams.push([value, io, idbp.NULL]);
    } else if (Buffer.isBuffer(value)){ //Binary/blob
      boundParams.push([value, io, idbp.BINARY]);
    } else if (typeof value === 'boolean'){ //Boolean
      boundParams.push([value, io, idbp.BOOLEAN]);
    } else {
      this.log(`Parameter that caused error was ${JSON.stringify(value)}`);
      throw new TypeError('Parameters to bind should be String, Number, null, boolean or Buffer');
    }
  }

  /**
   * Sets the connection attribute for each a DBPoolConnection in the pool.
   * @param {object} connectionAttribute with the properties {attribute: integer, value: integer | String}
   */
  async setConnectionAttribute(connectionAttribute = null){
    let me = this;
    //an object was not passed
    if ( !(connectionAttribute instanceof Object) ){
      throw new Error('Connection Attribute should be an Object');
    }

    let {attribute = null, value = null} = connectionAttribute;

    //it is possbile for value to equal 0 which would evaluate to false incorrectly.
    if (attribute !== null && value !== null){
      for ( let poolConnection of me.connections){
        //from the poolConnection get access to the underlying idb-p Connection() object.
        let {connection} = poolConnection;

        await connection.setConnAttr(attribute, value)
          .catch( () => {
            throw new Error('Setting Connection Attributes failed, check your parameters');
          });
      }
    } else {
      throw new Error('Provide a valid Connection Attribute and Value');
    }
  }

}
exports.DBPool = DBPool;
exports.DBPoolConnection = DBPoolConnection;

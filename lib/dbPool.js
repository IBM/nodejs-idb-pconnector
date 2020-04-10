const EventEmitter = require('events');

const {
  CLOB, CHAR, INT, NUMERIC, NULL, BOOLEAN, BINARY, IN, OUT, INOUT,
} = require('idb-connector');

const DBPoolConnection = require('./dbPoolConnection');

class DBPool extends EventEmitter {
  /**
   * Manages a list of DBPoolConnection instances.
   * Constructor to instantiate a new instance of a DBPool class given the `database` and `config`
   * @param {object} database - Object includes the `url`, `username`, and `password`.
   * @param {object} config - Object includes the `incrementSize` and `debug`.
   * @constructor
   */
  constructor(database = {
    url: '*LOCAL',
  }, config = {
    incrementSize: 8,
    debug: false,
  }) {
    super();
    const {
      incrementSize,
      debug,
    } = config;

    this.connections = [];

    // Defaults are initialized if `config` does not have all properties defined at instantiation.
    this.database = database || {
      url: '*LOCAL',
    };
    this.incrementSize = incrementSize || 8;
    this.debug = debug || false;
  }

  /**
   * Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
   * Assumes the database of the pool when establishing the connection.
   * @param {number} index - An identifier to id the connection for debug purposes.
   */
  createConnection(index) {
    // Indices can only be > 0 if integer-based
    if (typeof index === 'undefined' || (Number.isInteger(index) && index < 0)) {
      // eslint-disable-next-line no-param-reassign
      index = this.connections.length;
    }

    this.log(`Creating Connection ${index}...`);
    const poolConnection = new DBPoolConnection(index, {
      database: this.database,
      options: {
        debug: this.debug,
      },
    });
    this.connections.push(poolConnection);
    this.emit('new connection', poolConnection.connection);
    this.log(`Connection ${index} created`);
  }

  /**
   * Frees all connections in the pool (Sets "Available" back to true for all)
   * closes any statements and gets a new statement.
   * @returns {boolean} - true if all were detached successfully
   */
  async detachAll() {
    for (let i = 0; i < this.connections.length; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.detach(this.connections[i]);
      } catch (error) {
        const reason = new Error('DBPool: Failed to detachAll()');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        throw reason;
      }
    }

    return true;
  }

  /**
   * Retires (Removes) all connections from being used again
   * @returns {boolean} - true if all were retired successfully
   */
  async retireAll() {
    try {
      await this.detachAll();

      while (this.connections.length) {
        this.connections.pop();
      }
    } catch (error) {
      const reason = new Error('DBPool: Failed to retireAll()');
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }
    return true;
  }


  /**
   * Frees a connection (Returns the connection "Available" back to true)
   * closes any statements and gets a new statement.
   * @param {DBPoolConnection} connection
   * @returns {boolean} - true if detached successfully
   */
  async detach(connection) {
    const index = connection.poolIndex;
    this.log(`Detaching Connection ${index}...`);
    try {
      await connection.detach();
    } catch (error) {
      const reason = new Error('DBPool: Failed to detach()');
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }
    this.log(`Connection ${index} detached`);
    return true;
  }

  /**
   * Retires a connection from being used and removes it from the pool
   * @param {DBPoolConnection} connection
   */
  async retire(connection) {
    const index = connection.poolIndex;

    this.log(`Retiring Connection ${index}...`);
    try {
      await connection.detach(true);

      // Remove the connection from the pool
      this.connections.splice(this.connections.indexOf(connection), 1);
    } catch (error) {
      const reason = new Error(`DBPool: Failed to retire() Connection #${index}`);
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }
    this.log(`Connection ${index} retired`);
  }

  /**
   * Finds and returns the first available Connection.
   * @returns {DBPoolConnection} - one connection from the DBPool.
   */
  attach() {
    const { connections, incrementSize } = this;
    let validConnection = false;
    let connectionsLength = connections.length;
    let connection;
    let i;
    let j;

    // initialize pool if its empty
    if (!connectionsLength) {
      this.log('Initializing the pool');
      for (let iter = 0; iter < this.incrementSize; iter += 1) {
        this.createConnection(iter);
      }
      connections[0].setAvailable(false);
      return connections[0];
    }

    this.log('Finding available Connection...');
    while (!validConnection) {
      for (i = 0; i < connectionsLength; i += 1) {
        connection = connections[i];

        if (connection.isAvailable()) {
          validConnection = true;
          this.log(`Connection ${connection.poolIndex} found`);
          connection.setAvailable(false);

          return connection;
        }
      }

      this.log('Maximum available connections reached.');
      j = connectionsLength;

      for (i = 0; i < incrementSize; i += 1) {
        this.createConnection(j + i);
      }

      connectionsLength += incrementSize;

      this.log(`Increased connections by ${incrementSize} to ${connectionsLength} (total).`);
    }
    return null;
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
    const connection = this.attach();
    const statement = connection.getStatement();
    let resultSet = [];
    let reason;

    this.log(`Executing SQL...\nSQL Statement: ${sql}`);
    resultSet = await statement.exec(sql)
      .catch(async (error) => {
        reason = new Error('runSql: Failed to exec()');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await this.detach(connection);
        throw reason;
      });

    this.log('Executed SQL');
    await connection.detach()
      .catch(async (error) => {
        reason = new Error('runSql: Failed to detach() the connection');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await this.retire(connection);
        throw reason;
      });

    if (!resultSet) {
      this.log('SQL did not return a result set.');
      return null;
    }
    this.log('Fetched Result Set');
    return resultSet;
  }

  /**
   * Shortcut to prepare ,bind, and execute. Just provide the sql and the params as an array.
   * @param {string} sql - the sql to prepare , include parameter markers (?, ?, ...)
   * @param {array} [params] - an optional array of values to bind
   * order of the values in the array must match the order of the desired parameter markers
   * @return {object} - In the Format: {resultSet: [], outputParams: []}
   * if the Prepared SQL returns result set it is returned as an array of objects.
   * if the Prepared SQL returns output parameters it is returned as an array of objects/
   * else null will be returned indicating that there is no result set or outputParams.
   */
  async prepareExecute(sql = '', params = [], options = {}) {
    const connection = this.attach();
    const statement = connection.getStatement();
    const data = {};
    let resultSet = null;
    let outParams = null;
    let reason;

    this.log('Preparing Statement...');
    await statement.prepare(sql)
      .catch(async (error) => {
        reason = new Error('PE: Failed to prepare() the Statement');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await this.detach(connection);
        throw reason;
      });

    if (params.length > 0) {
      this.log('Binding Parameters...');
      await statement.bindParam(this.setupParams(params, options))
        .catch(async (error) => {
          reason = new Error('PE: Failed to bindParam()');
          reason.stack += `\nCaused By:\n ${error.stack}`;
          await this.detach(connection);
          throw reason;
        });
    }
    // execute() returns an empty [] when no outParams available, if bindParams was called first.
    outParams = await statement.execute()
      .catch(async (error) => {
        reason = new Error('PE: Failed to execute() statement');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await this.detach(connection);
        throw reason;
      });

    this.log('Fetching Result Set...');
    resultSet = await statement.fetchAll()
      .catch(() => {
        // tried to get the results no were results were available.
        // this is normal behavior for some queries for example "INSERT" or "UPDATE"
        this.log('SQL did not return a result set.');
      });

    await connection.detach()
      .catch(async (error) => {
        reason = new Error('PE: Failed to detach() the connection');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        await this.retire(connection);
        throw reason;
      });
    // no resultSet or outParams to return
    if (!resultSet && !outParams) {
      return null;
    }
    // return resultSet if its not null and length is not 0
    if (resultSet && resultSet.length) {
      data.resultSet = resultSet;
    }
    // return outParams if its not null
    if (outParams) {
      data.outputParams = outParams;
    }
    // return null if data object is still empty
    if (Object.keys(data).length === 0) {
      return null;
    }
    return data;
  }

  /**
   * Internal helper function to format params and set Param Indicator & Bind Type
   * @param {array} params - an array of values to bind. type of values should be:
   * (string , number , or null)
   * @param {object} options - an object with config options to set for all parameters.
   * Currently, the input/output indicator is the only available option to set:
   * {io: in | out | both}.
   * This will override the default which is to bind as 'both'.
   * @returns {array} - an array of bounded params properly formated to use.
   */
  setupParams(params, options) {
    const boundParams = [];
    let { io } = options;

    io = io || 'both';

    params.forEach((parameter) => {
      if (parameter instanceof Object) {
        const { value, asClob = false } = parameter;

        if (typeof value === 'undefined') {
          throw new Error('The parameter object must define a value property');
        }
        // assigning the value of io from the parameter object to the io variable declared before.
        // if io from parameter object is undefined default back to value of io from before.
        ({ io = io } = parameter);
        // allows customization of io for an individual parameter.
        this.formatParams(boundParams, value, { io, asClob });
      } else {
        // when just passing values but would like to override default io (INPUT_OUTPUT)
        this.formatParams(boundParams, parameter, { io });
      }
    });

    this.log(`Size of BoundParams: ${boundParams.length} \n ${JSON.stringify(boundParams)}`);

    return boundParams;
  }

  /**
   *Internal helper function to format params and set Param Indicator & Bind Type
   * @param {array} boundParams - the array to push the formatted parameter.
   * @param {object} options - an object with config options:
   * {io: in | out | both, asClob: true | false}.
   */
  formatParams(boundParams, value, options) {
    const { asClob } = options;
    let { io } = options;

    if (io === 'both') {
      io = INOUT;
    } else if (io === 'in') {
      io = IN;
    } else if (io === 'out') {
      io = OUT;
    }

    if (typeof value === 'string') { // String
      if (asClob) { // as clob
        boundParams.push([value, io, CLOB]);
      } else { // as string
        boundParams.push([value, io, CHAR]);
      }
    } else if (typeof value === 'number') { // Number
      let indicator;

      // eslint-disable-next-line no-unused-expressions
      Number.isInteger(value)
        ? indicator = INT
        : indicator = NUMERIC;

      boundParams.push([value, io, indicator]);
    } else if (value === null) { // Null
      boundParams.push([value, io, NULL]);
    } else if (Buffer.isBuffer(value)) { // Binary/blob
      boundParams.push([value, io, BINARY]);
    } else if (typeof value === 'boolean') { // Boolean
      boundParams.push([value, io, BOOLEAN]);
    } else {
      this.log(`Parameter that caused error was ${JSON.stringify(value)}`);
      throw new TypeError('Parameters to bind should be String, Number, null, boolean or Buffer');
    }
  }

  /**
   * Sets the connection attribute for each a DBPoolConnection in the pool.
   * @param {object} connectionAttribute with the properties:
   *  {attribute: integer, value: integer | String}
   */
  async setConnectionAttribute(connectionAttribute = null) {
    // an object was not passed
    if (!(connectionAttribute instanceof Object)) {
      throw new Error('Connection Attribute should be an Object');
    }

    const { attribute = null, value = null } = connectionAttribute;

    // it is possible for value to equal 0 which would evaluate to false incorrectly.
    if (attribute !== null && value !== null) {
      const { connections } = this;
      for (let i = 0; i < connections.length; i += 1) {
        // from the poolConnection get access to the underlying idb-p Connection() object.
        const { connection } = connections[i];

        // eslint-disable-next-line no-await-in-loop
        await connection.setConnAttr(attribute, value)
          .catch(() => {
            throw new Error('Setting Connection Attributes failed, check your parameters');
          });
      }
    } else {
      throw new Error('Provide a valid Connection Attribute and Value');
    }
  }
}


module.exports = DBPool;

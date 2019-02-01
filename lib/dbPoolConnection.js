const {Connection} = require('./connection');

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

    me.connection = new Connection();

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

module.exports = DBPoolConnection;

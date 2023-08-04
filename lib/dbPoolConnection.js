// Copyright contributors to the nodejs-idb-pconnector project
// SPDX-License-Identifier: MIT

const Connection = require('./connection');

/**
 * Uses and Extends the Connection class implemented in idb-pconnector.
 */
class DBPoolConnection {
  /**
   * @description
   * instantiates a new instance of a DBPoolConnection class given the `poolIndex` and `config`
   * @param {number} poolIndex An identifier for debug purposes
   * @param {object} config Object includes `database`
   */
  constructor(poolIndex, config = {
    database: {
      url: '*LOCAL',
    },
  }) {
    const {
      database,
      options,
    } = config;

    // Defaults are initialized if `config` does not have all properties defined at instantiation.
    this.database = database || {
      url: '*LOCAL',
    };
    this.options = options || {
      debug: false,
    };
    this.poolIndex = poolIndex;
    this.available = true;
    this.newConnection();
    this.newStatement();
  }

  /**
   * Instantiates a new Connection instance
   */
  newConnection() {
    const {
      url,
      username = '',
      password = '',
    } = this.database;

    let {
      debug,
    } = this.options;

    this.connection = new Connection();

    if (!username && !password) {
      // should be connecting '*LOCAL',that's the only way to connect w/o username, password.
      this.connection.connect(url);
    } else {
      // connecting to remote url or username, password was provided.
      this.connection.connect(url, username, password);
    }
    // if debug = true, turn it on at the idb level.
    // eslint-disable-next-line no-unused-expressions
    debug ? this.connection.debug(true) : debug = false;
  }

  /**
   * @description
   * Instantiates a new Statement instance for the Connection if one is not set and returns it.
   * Otherwise will close the previous statement and return a new statement
   * @returns {Statement} new statement from the connection
   */
  async newStatement() {
    if (this.statement) {
      try {
        await this.statement.close();
      } catch (error) {
        const reason = new Error('Statement failed to close, new Statement could not be created.');
        reason.stack += `\nCaused By:\n ${error.stack}`;
        throw reason;
      }
    }

    this.statement = this.connection.getStatement();

    return this.statement;
  }

  /**
   * @description
   * returns the handle to the Statement.
   * @returns {Statement}
   */
  getStatement() {
    return this.statement;
  }

  /**
   * @description
   * Closes the connection
   * @returns {Promise} resolves to boolean true on success
   */
  async close() {
    try {
      await this.connection.disconn();
      await this.connection.close();
    } catch (error) {
      const reason = new Error('Connection failed to close');
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
    try {
      if (retire) {
        await this.close();
      } else {
        await this.newStatement();
        this.setAvailable(true);
      }
    } catch (error) {
      const reason = new Error(`DBPoolConnection: failed to ${retire ? 'retire' : 'detach'}.`);
      reason.stack += `\nCaused By:\n ${error.stack}`;
      throw reason;
    }

    return retire ? true : this;
  }

  /**
   * @returns {boolean} true if the connection is available , false if unavailable.
   */
  isAvailable() {
    return this.available;
  }

  /**
   *
   * @param {boolean} availability - true or false to set the availability flag of the connection.
   */
  setAvailable(availability) {
    this.available = availability;
  }
}

module.exports = DBPoolConnection;

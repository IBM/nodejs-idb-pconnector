const { dbconn } = require('idb-connector');

/**
 * @class Connection
 * @constructor
 */
class Connection {
  constructor(db = { url: '', username: '', password: '' }) {
    const { url, username, password } = db;
    const isLocal = url === '*LOCAL';

    // eslint-disable-next-line new-cap
    this.dbconn = new dbconn();

    if (isLocal && !username && !password) {
      this.connect();
    } else if (url && username && password) {
      this.connect(url, username, password);
    }
  }

  /**
   * Establishes a Connection to the database.
   * @param {string} [url] - The url of the database to connect to, which Defaults to '*LOCAL'.
   * @param {string} [username] - The user name for the database user.
   * @param {string} [password] - The password for the database user.
   * @returns {object} - The dbConn Object with an established connection.
   * @memberof Connection
   */
  connect(url = '*LOCAL', username = '', password = '') {
    // connecting to '*LOCAL' and username, password was not provided.
    if (url && !username && !password) {
      this.dbconn.conn(url);
    } else {
      // connecting to remote url or username, password was provided.
      this.dbconn.conn(url, username, password);
    }
    return this;
  }

  /**
   * Returns a Statment Object initialized to the current dbConn Connection.
   * @returns {object} - A new Statement initialized with the current dbconn.
   * @memberof Connection
   */
  getStatement() {
    // eslint-disable-next-line global-require
    const Statement = require('./statement');
    return new Statement(this);
  }

  /**
   * Closes the Connection to the DB and frees the connection object.
   * @returns {Promise} - Promise object represents the closure of the Connection.
   * @memberof Connection
   */
  async close() {
    const conn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(conn.close());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnects an existing connection to the database.
   * @returns {Promise} - Promise object represents the disconnect of the Connection.
   * @memberof Connection
   */
  async disconn() {
    const conn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(conn.disconn());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Prints more detailed info if choice = true. Turned off by setting choice = false.
   * @param {boolean} choice - The option either true or false to turn on debugging.
   * @returns {Promise} - resolves to boolean indicating current debug value.
   * @memberof Connection
   */
  async debug(choice) {
    const conn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(conn.debug(choice));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * If a connection attribute exists then return type String or Int depending on the attribute type
   * @param {number} attribute
   * @returns {Promise} - resolves to Number value of the specified connection attribute.
   * Further Documentation {@link https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsconx.htm HERE}
   * @memberof Connection
   */
  async getConnAttr(attribute) {
    const conn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(conn.getConnAttr(attribute));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sets the ConnAttr. Attribute should be INT.
   * @param {number} attribute - The attribute to be set.
   * refer to the getConAttr example to view available attributes.
   * @param {(string | number)} value - The value to set the attribute to.
   * @returns {Promise} - Promise object represents the execution of the setConnAttr().
   * @memberof Connection
   */
  async setConnAttr(attribute, value) {
    const conn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(conn.setConnAttr(attribute, value));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Checks if the given SQL is valid and interprets vendor escape clauses.
   * @param {string} sql - The sql string to be validated.
   * @returns {Promise} - resolves to the transformed SQL string that is seen by the data source.
   */
  async validStmt(sql) {
    const conn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(conn.validStmt(sql));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Checks if the Connection object is connected to the db.
   * @returns {boolean} - true or false indicating if the Connection object is currently connected.
   */
  isConnected() {
    return this.dbconn.isConnected();
  }
}

module.exports = Connection;

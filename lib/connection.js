const {dbconn} = require('idb-connector');
const Statement = require('./Statement');

/**
 * @class Connection
 * @constructor
 */
class Connection {
  constructor(db = {url: '', username: '', password: ''}) {
    let me = this,
      {url, username, password} = db,
      isLocal = url === '*LOCAL';

    me.dbconn = new dbconn();

    if (isLocal && !username && !password){
      me.connect();
    } else if (url && username && password){
      me.connect(url, username, password);
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
    let me = this;

    //connecting to '*LOCAL' and username, password was not provided.
    if (url && !username && !password){
      me.dbconn.conn(url);
    } else {
      //connecting to remote url or username, password was provided.
      me.dbconn.conn(url, username, password);
    }
    return me;
  }

  /**
       * Returns a Statment Object initialized to the current dbConn Connection.
       * @returns {object} - A new Statement initialized with the current dbconn.
       * @memberof Connection
       */
  getStatement() {
    return new Statement(this);
  }

  /**
       * Closes the Connection to the DB and frees the connection object.
       * @returns {Promise} - Promise object represents the closure of the Connection.
       * @memberof Connection
       */
  async close() {
    let dbconn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(dbconn.close());
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
    let dbconn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(dbconn.disconn());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
       * Prints more detailed info if choice = true. Turned off by setting choice = false.
       * @param {boolean} choice - The option either true or false to turn on debugging.
       * @returns {Promise} - Promise object represents the debug method being set to the choice specified.
       * @memberof Connection
       */
  async debug(choice) {
    let dbconn = this.dbconn;

    return new Promise(function (resolve, reject) {
      try {
        resolve(dbconn.debug(choice));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
       * If a connection attribute exists then return type String or Int depending on the attribute type
       * @param {number} attribute
       * @returns {Promise} - Promise object represents the the current settings for the specified connection attribute.
       * Further Documentation {@link https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsconx.htm HERE}
       * @memberof Connection
       */
  async getConnAttr(attribute) {
    let dbconn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(dbconn.getConnAttr(attribute));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
       * Sets the ConnAttr. Attribute should be INT.
       * @param {number} attribute - The attribute to be set refer to the getConAttr example to view available attributes.
       * @param {(string | number)} value - The value to set the attribute to. Can be String or Int depending the attribute.
       * @returns {Promise} - Promise object represents the execution of the setConnAttr().
       * @memberof Connection
       */
  async setConnAttr(attribute, value) {
    let dbconn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(dbconn.setConnAttr(attribute, value));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
       * Checks if the given SQL is valid and interprets vendor escape clauses.
       * @param {string} sql - The sql string to be validated.
       * @returns {Promise} - Promise object represents the transformed SQL string that is seen by the data source.
       */
  async validStmt(sql) {
    let dbconn = this.dbconn;

    return new Promise((resolve, reject) => {
      try {
        resolve(dbconn.validStmt(sql));
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
       * Checks if the Connection object is connected to the db.
       * @returns {boolean} - true or false indicating if the Connection object is currently connected.
       */
  isConnected(){
    return this.dbconn.isConnected();
  }
}

exports = Connection;

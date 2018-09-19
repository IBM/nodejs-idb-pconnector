const idb = require('idb-connector');

/**
 * @class Connection
 * @constructor
 */
class Connection {
  constructor(db = {url: '', username: '', password: ''}) {
    let me = this,
      {url, username, password} = db,
      isLocal = url === '*LOCAL';

    me.dbconn = new idb.dbconn();

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
    return new Statement(this.dbconn);
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
     * @example Available Set & Get Connection Attributes:
     * SQL_ATTR_2ND_LEVEL_TEXT
     * SQL_ATTR_AUTOCOMMIT
     * SQL_ATTR_CONCURRENT_ACCESS_RESOLUTION
     * SQL_ATTR_CONN_SORT_SEQUENCE
     * SQL_ATTR_COMMIT
     * SQL_ATTR_DBC_DEFAULT_LIB
     * SQL_ATTR_DECFLOAT_ROUNDING_MODE
     * SQL_ATTR_DECIMAL_SEP
     * SQL_ATTR_EXTENDED_COL_INFO
     * SQL_ATTR_EXTENDED_INDICATORS
     * SQL_ATTR_FREE_LOCATORS
     * SQL_ATTR_HEX_LITERALS
     * SQL_ATTR_INFO_ACCTSTR
     * SQL_ATTR_INFO_APPLNAME
     * SQL_ATTR_INFO_PROGRAMID
     * SQL_ATTR_INFO_USERID
     * SQL_ATTR_INFO_WRKSTNNAME
     * SQL_ATTR_MAX_PRECISION
     * SQL_ATTR_MAX_SCALE
     * SQL_ATTR_MIN_DIVIDE_SCALE
     * SQL_ATTR_OLD_MTADTA_BEHAVIOR
     * SQL_ATTR_NULLT_ARRAY_RESULTS
     * SQL_ATTR_NULLT_OUTPUT_PARMS
     * SQL_ATTR_QUERY_OPTIMIZE_GOAL
     * SQL_ATTR_SAVEPOINT_NAME
     * SQL_ATTR_TIME_FMT
     * SQL_ATTR_TIME_SEP
     * SQL_ATTR_TIMESTAMP_PREC
     * SQL_ATTR_TXN_EXTERNAL
     * SQL_ATTR_TXN_INFO
     * SQL_ATTR_UCS2
     *
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

/**
 * @class Statement
 * @constructor
 * @param {Object} [dbconn] - A Connection Object to initialize the Statement. If a connection is not provided one will be initialized for the statement.
 */
class Statement {
  constructor(dbconn = new Connection().connect().dbconn) {
    let me = this;

    me.dbc = dbconn;
    me.stmt = new idb.dbstmt(me.dbc);
  }

  /**
     * Associates parameter markers in an SQL statement to app variables.
     * @param {Array} params - An Array of the parameter list. Each parameter element will also be an Array with 3 values (Value, In/out Type, Indicator).
     * @example dbStmt.bindParam([
     *              [2099, idb.SQL_PARAM_INPUT, idb.SQL_BIND_NUMERIC],
     *              ['Node.Js', idb.SQL_PARAM_INPUT,idb.SQL_BIND_CHAR]
     *          ]);
     * IN/OUT TYPE CAN BE:
     *  - SQL_PARAM_INPUT
     *  - SQL_PARAM_OUTPUT
     *  - SQL_PARAM_INPUT_OUTPUT
     * INDICATORS CAN BE:
     *  - SQL_BIND_CLOB
     *  - SQL_BIND_CHAR
     *  - SQL_BIND_INT
     *  - SQL_BIND_NULL_DATA
     *  - SQL_BIND_NUMERIC
     *  - SQL_BIND_BOOLEAN
     *  - SQL_BIND_BINARY
     *  - SQL_BIND_BLOB
     * @returns {Promise} - Promise object represents the execution of bindParam().
     * @memberof Statement
     */
  async bindParam(params) {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      stmt.bindParam(params, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
     * Shorthand for bindParam
     * @param {Array} params - An Array of the parameter list. See `bindParam` for additional documentation.
     * @memberof Statement
     */
  async bind(params) {
    return await this.bindParam(params);
  }

  /**
     * Ends and frees the statement object.
     * @returns {Promise} - Promise object represents the execution of close().
     * @memberof Statement
     */
  async close() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.close());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * Closes the cursor associated with the dbstmt object and discards any pending results.
     * @returns {Promise} - Promise object represents the execution of closeCursor().
     * @memberof Statement
     */
  async closeCursor() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.closeCursor());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * Adds all changes to the database that have been made on the connection since connect time.
     * @returns {Promise} - Promise object represents the execution of Commit().
     * @memberof Statement
     */
  async commit() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.commit());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * performs action of given SQL String. The exec() method does not work with stored procedure calls use execute() instead.
     * @param {string} sqlString
     * @returns the result set as an array.
     * @returns {Promise} - Promise object represents the result set from the exection of exec().
     * @memberof Statement
     */
  async exec(sqlString) {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      stmt.exec(sqlString, function (result, error){
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
     * Runs a statement that was successfully prepared using prepare().
     * Use execute() for stored procedure calls.
     * @example
     * - Calling a stored Procedure that returns a result set with execute() & displaying the result set.

     const idb = require('idb-pconnector');
     try {
		  // note that that calling the new Statement() without the DbConn as a parameter
		  // creates a new connection automatically and uses that for the Statement.
		  let dbStmt = new idb.Statement();,
		      sql = 'call QIWS.sampleProc',
		      response;

		  await dbStmt.prepare(sql);
		  await dbStmt.execute();
		  response = await dbStmt.fetchAll();
		  console.log(`Result is\n: ${JSON.stringify(response)}`);
	 } catch(error){
		  console.log(error.stack);
	 }
     * @example
     * - Insert Example With Prepare , Binding Parameter , and Execution

     const idb = require('idb-pconnector');
     try {
		  // note that that calling the new Statement() without the DbConn as a parameter
		  // creates a new connection automatically and uses that for the Statement.
		  let dbStmt = new idb.Statement(),
		      response;

		  await dbStmt.prepare('INSERT INTO AMUSSE.TABLE1 VALUES (?,?)');
		  await dbStmt.bind([
		      [2018, idb.SQL_PARAM_INPUT, idb.SQL_BIND_NUMERIC],
		      [null, idb.PARM_TYPE_INPUT, idb.SQL_BIND_NULL_DATA]
		  ]);
		  await dbStmt.execute();

		  response = await dbStmt.exec('SELECT * FROM AMUSSE.TABLE1');
		  console.log(`Select results: ${JSON.stringify(response)}`);
	 } catch (error) {
		  console.log(error.stack);
	 }
     * @returns {Promise} - Promise object represents the execution of execute().
     * @memberof Statement
     */
  async execute() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      stmt.execute((result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
     * If a result exists, retrieve a row from the result set
     * @returns {Promise | null} - Promise object represents the row that was retrieved from the execution of fetch().
     * when no data is found null is returned , indicating there ws nothing to return from fetch call.
     * @memberof Statement
     */
  async fetch() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      stmt.fetch((result, rc) => {
        if (rc === idb.SQL_SUCCESS ){ //idb.SQL_SUCCESS == 0
          resolve(result);
        } else if (rc === idb.SQL_NO_DATA_FOUND){
          resolve(null); //Indicates the end of the Data Set
        }
        reject('Error');
      });
    });
  }

  /**
     * If a result set exists, retrieve all the rows of data from the result set.
     * @returns {Promise} - Promise object represents the the an array containing the result that was retrieved from the execution of fetchAll().
     * @memberof Statement
     */
  async fetchAll() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      stmt.fetchAll((result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
     * Helper function to simplify function bodies like fieldName or fieldNullable.
     * Requires an int index parameter. If a valid index is provided, returns the name of the indicated field.
     * @param suffix The suffix of the function name to call.
     * @param {number} index - The position of the field within the table. It is 0 based.
     * @memberof Statement
     */
  field(suffix, index) {
    let stmt = this.stmt,
      response;

    return new Promise((resolve, reject) => {
      if (Number.isInteger(index)) {
        try {
          response = stmt[`field${suffix}`](index);

          if (suffix === 'Nullable') {
            response = !!response;
          }

          resolve(response);
        } catch (error) {
          reject(error);
        }
      } else {
        reject('Index must be an Integer.');
      }
    });
  }

  /**
     * Requires an int index parameter. If a valid index is provided, returns the name of the indicated field.
     * @param {number} index - The position of the field within the table. It is 0 based.
     * @returns {Promise} - Promise object represents the the String that was retrieved from the execution of fieldName().
     * @memberof Statement
     */
  async fieldName(index) {
    return await this.field('Name', index);
  }

  /**
     * Requires an int index parameter. If a valid index is provided, returns t/f if the indicated field can be Null
     * @param {number} index - The position of the field within the table. It is 0 based.
     * @returns {Promise} - Promise object represents the the boolean that was retrieved from the execution of fieldNullable().
     * @memberof Statement
     */
  async fieldNullable(index) {
    return await this.field('Nullable', index);
  }

  /**
     * Requires an int index parameter. If a valid index is provided, returns the precision of the indicated field
     * @param {number} index - The position of the field within the table. It is 0 based.
     * @returns {Promise} - Promise object represents the the Number that was retrieved from the execution of fieldPrecise().
     * @memberof Statement
     */
  async fieldPrecise(index) {
    return await this.field('Precise', index);
  }

  /**
     * Requires an int index parameter. If a valid index is provided, returns the scale of the indicated column
     * @param {number} index - The position of the field within the table. It is 0 based.
     * @returns {Promise} - Promise object represents the the Number that was retrieved from the execution of fieldScale().
     * @memberof Statement
     */
  async fieldScale(index) {
    return await this.field('Scale', index);
  }

  /**
     * requires an int index parameter. If a valid index is provided, returns the data type of the indicated field
     * @param {number} index - the postion of the field within the table. It is 0 based.
     * @returns {Promise} - Promise object represents the the Number that was retrieved from the execution of fieldType().
     * @memberof Statement
     */
  async fieldType(index) {
    return await this.field('Type', index);
  }

  /**
     * requires an int index parameter. If a valid index is provided, returns the field width of the indicated field
     * @param {number} index - the postion of the field within the table. It is 0 based.
     * @returns {Promise} - Promise object represents the the Number that was retrieved from the execution of fieldWidth().
     * @memberof Statement
     */
  async fieldWidth(index) {
    return await this.field('Width', index);
  }

  /**
     * If a valid Statment attribute is provided , returns the current settings for the specified Statement attribute.
     * Refer to the list below for valid Statement Attributes.
     * @param {number} attribute - the statement attribute to get
     * @returns {Promise} Promise object represents the the String | Number that was retrieved from the execution of getStmtAttr().
     * @memberof Statement
     * @example Available Set & Get Statement Attributes
     * SQL_ATTR_APP_PARAM_DESC
     * SQL_ATTR_APP_ROW_DESC
     * SQL_ATTR_BIND_TYPE
     * SQL_ATTR_CURSOR_HOLD
     * SQL_ATTR_CURSOR_SCROLLABLE
     * SQL_ATTR_CURSOR_SENSITIVITY
     * SQL_ATTR_CURSOR_TYPE
     * SQL_ATTR_EXTENDED_COL_INFO
     * SQL_ATTR_FOR_FETCH_ONLY
     * SQL_ATTR_FULL_OPEN
     * SQL_ATTR_NUMBER_RESULTSET_ROWS_PTR
     * SQL_ATTR_PARAM_BIND_TYPE
     * SQL_ATTR_PARAM_STATUS_PTR
     * SQL_ATTR_PARAMS_PROCESSED_PTR
     * SQL_ATTR_PARAMSET_SIZE
     * SQL_ATTR_ROW_BIND_TYPE
     * SQL_ATTR_ROW_STATUS_PTR
     * SQL_ATTR_ROWS_FETCHED_PTR
     * SQL_ATTR_ROWSET_SIZE
     *
     * Further Documentation {@link https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsstma.htm HERE}
     */
  async getStmtAttr(attribute) {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.getStmtAttr(attribute));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * Determines whether there is more information available on the statement
     * @returns {Promise} - Promise object represents the execution of nextResult().
     * @memberof Statement
     */
  async nextResult() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.nextResult());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * If a result is available, retrieve number of fields contained in result.
     * @returns {Promise} - Promise object represents the Number returned from the execution of numFields().
     * @memberof Statement
     */
  async numFields() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.numFields());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * if a query was performed ,retrieves number of rows that were effected by a query
     * @returns {Promise} - Promise object represents the Number returned from the execution of numRows().
     * @memberof Statement
     */
  async numRows() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.numRows());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * If valid SQL is provided, prepare SQL and send it to the DBMS.
     * @param {string} sqlString - The SQL string to be prepared.
     * @returns {Promise} - Promise object represents the the execution of prepare().
     * @example - View the examples located at the excute() method.
     * @memberof Statement
     */
  async prepare(sqlString) {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      stmt.prepare(sqlString, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
     * Reverts changes to the database that have been made on the connection since connect time or the previous call to commit().
     * @memberof Statement
     */
  async rollback() {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.rollback());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
     * If a valid attribute and value is provided, set StmtAttr indicate Attribute. Refer to the example @getStmtAttr for a list of valid Statement Attributes.
     * @param {number} attribute - must be an int.
     * @param {(string | number)} value -  can String or Int depending on the attribute
     * @returns {Promise} - Promise object represents the execution of setStmtAttr().
     * @memberof Statement
     */
  async setStmtAttr(attribute, value) {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      if (attribute && Number.isInteger(attribute)) {
        try {
          resolve(stmt.setStmtAttr(attribute, value));
        } catch (error) {
          reject(error);
        }
      } else {
        reject('Attribute must be an Integer.');
      }
    });
  }

  /**
     * Returns the diagnostic information associated with the most recently called function for a particular statement, connection, or environment handler.
     * @param {number} hType - Indicates the handler type of diagnostic information.
     * @example hType can be following values:
     * SQL_HANDLE_ENV:Retrieve the environment diagnostic information
     * SQL_HANDLE_DBC:Retrieve the connection diagnostic information
     * SQL_HANDLE_STMT:Retrieve the statement diagnostic information
     * @param {number} index - Indicates which error should be retrieved. The first error record index is number 1.
     * @returns {Promise} - Promise object represents Number retrieved from the execution of stmtError().
     * @memberof Statement
     */
  async stmtError(hType, index) {
    let stmt = this.stmt;

    return new Promise((resolve, reject) => {
      if (index < 1) {
        reject('Index must be at least 1.');
      } else {
        stmt.stmtError(hType, index, (result, error) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    });
  }
}

// export variables from new idb-pconnector
exports.Connection = Connection;
exports.Statement = Statement;
exports.DBPool = require('./dbPool.js').DBPool;
exports.SQL_BIND_CLOB = 0;
exports.SQL_BIND_CHAR = 1;
exports.SQL_BIND_INT = 2;
exports.SQL_BIND_NULL_DATA = 3;
exports.SQL_BIND_NUMERIC = 4;
exports.SQL_BIND_BOOLEAN = 5;
exports.SQL_BIND_BINARY = idb.SQL_BINARY;
exports.SQL_BIND_BLOB = idb.SQL_BLOB;
//alias variables
exports.BIND_CLOB = idb.BIND_CLOB;
exports.BIND_STRING = idb.BIND_STRING;
exports.BIND_INT = idb.BIND_INT;
exports.BIND_NULL = idb.BIND_NULL;
exports.BIND_NUMERIC = idb.BIND_NUMERIC;
exports.BIND_BOOLEAN = idb.BIND_BOOLEAN;
exports.BIND_BINARY = idb.BIND_BINARY;
exports.BIND_BLOB = idb.BIND_BLOB;
exports.PARAM_INPUT = idb.SQL_PARAM_INPUT;
exports.PARAM_OUTPUT = idb.SQL_PARAM_OUTPUT;
exports.PARAM_INPUT_OUTPUT = idb.SQL_PARAM_INPUT_OUTPUT;

// export variables from original idb-connector
exports.SQL_FALSE = idb.SQL_FALSE;
exports.SQL_TRUE = idb.SQL_TRUE;
exports.SQL_NTS = idb.SQL_NTS;
exports.SQL_SQLSTATE_SIZE = idb.SQL_SQLSTATE_SIZE;
exports.SQL_MAX_MESSAGE_LENGTH = idb.SQL_MAX_MESSAGE_LENGTH;
exports.SQL_MAX_OPTION_STRING_LENGTH = idb.SQL_MAX_OPTION_STRING_LENGTH;

exports.SQL_SUCCESS = idb.SQL_SUCCESS;
exports.SQL_SUCCESS_WITH_INFO = idb.SQL_SUCCESS_WITH_INFO;
exports.SQL_NO_DATA_FOUND = idb.SQL_NO_DATA_FOUND;
exports.SQL_NEED_DATA = idb.SQL_NEED_DATA;
exports.SQL_NO_DATA = idb.SQL_NO_DATA;
exports.SQL_ERROR = idb.SQL_ERROR;
exports.SQL_INVALID_HANDLE = idb.SQL_INVALID_HANDLE;
exports.SQL_STILL_EXECUTING = idb.SQL_STILL_EXECUTING;

exports.SQL_CLOSE = idb.SQL_CLOSE;
exports.SQL_DROP = idb.SQL_DROP;
exports.SQL_UNBIND = idb.SQL_UNBIND;
exports.SQL_RESET_PARAMS = idb.SQL_RESET_PARAMS;

exports.SQL_C_DEFAULT = idb.SQL_C_DEFAULT;

exports.SQL_COMMIT = idb.SQL_COMMIT;
exports.SQL_ROLLBACK = idb.SQL_ROLLBACK;
exports.SQL_COMMIT_HOLD = idb.SQL_COMMIT_HOLD;
exports.SQL_ROLLBACK_HOLD = idb.SQL_ROLLBACK_HOLD;
exports.SQL_SAVEPOINT_NAME_RELEASE = idb.SQL_SAVEPOINT_NAME_RELEASE;
exports.SQL_SAVEPOINT_NAME_ROLLBACK = idb.SQL_SAVEPOINT_NAME_ROLLBACK;

exports.SQL_DRIVER_COMPLETE = idb.SQL_DRIVER_COMPLETE;
exports.SQL_DRIVER_COMPLETE_REQUIRED = idb.SQL_DRIVER_COMPLETE_REQUIRED;
exports.SQL_DRIVER_NOPROMPT = idb.SQL_DRIVER_NOPROMPT;
exports.SQL_DRIVER_PROMPT = idb.SQL_DRIVER_PROMPT;

exports.SQL_ACTIVE_CONNECTIONS = idb.SQL_ACTIVE_CONNECTIONS;
exports.SQL_MAX_DRIVER_CONNECTIONS = idb.SQL_MAX_DRIVER_CONNECTIONS;
exports.SQL_MAX_CONCURRENT_ACTIVITIES = idb.SQL_MAX_CONCURRENT_ACTIVITIES;
exports.SQL_ACTIVE_STATEMENTS = idb.SQL_ACTIVE_STATEMENTS;
exports.SQL_PROCEDURES = idb.SQL_PROCEDURES;
exports.SQL_DRIVER_NAME = idb.SQL_DRIVER_NAME;
exports.SQL_ODBC_API_CONFORMANCE = idb.SQL_ODBC_API_CONFORMANCE;
exports.SQL_ODBC_SQL_CONFORMANCE = idb.SQL_ODBC_SQL_CONFORMANCE;
exports.SQL_DBMS_NAME = idb.SQL_DBMS_NAME;
exports.SQL_DBMS_VER = idb.SQL_DBMS_VER;
exports.SQL_DRIVER_VER = idb.SQL_DRIVER_VER;
exports.SQL_IDENTIFIER_CASE = idb.SQL_IDENTIFIER_CASE;
exports.SQL_IDENTIFIER_QUOTE_CHAR = idb.SQL_IDENTIFIER_QUOTE_CHAR;
exports.SQL_MAX_COLUMN_NAME_LEN = idb.SQL_MAX_COLUMN_NAME_LEN;
exports.SQL_MAX_CURSOR_NAME_LEN = idb.SQL_MAX_CURSOR_NAME_LEN;
exports.SQL_MAX_OWNER_NAME_LEN = idb.SQL_MAX_OWNER_NAME_LEN;
exports.SQL_MAX_SCHEMA_NAME_LEN = idb.SQL_MAX_SCHEMA_NAME_LEN;
exports.SQL_MAX_TABLE_NAME_LEN = idb.SQL_MAX_TABLE_NAME_LEN;
exports.SQL_MAX_COLUMNS_IN_GROUP_BY = idb.SQL_MAX_COLUMNS_IN_GROUP_BY;
exports.SQL_MAX_COLUMNS_IN_ORDER_BY = idb.SQL_MAX_COLUMNS_IN_ORDER_BY;
exports.SQL_MAX_COLUMNS_IN_SELECT = idb.SQL_MAX_COLUMNS_IN_SELECT;
exports.SQL_MAX_COLUMNS_IN_TABLE = idb.SQL_MAX_COLUMNS_IN_TABLE;
exports.SQL_MAX_TABLES_IN_SELECT = idb.SQL_MAX_TABLES_IN_SELECT;
exports.SQL_COLUMN_ALIAS = idb.SQL_COLUMN_ALIAS;
exports.SQL_DATA_SOURCE_NAME = idb.SQL_DATA_SOURCE_NAME;
exports.SQL_DATASOURCE_NAME = idb.SQL_DATASOURCE_NAME;
exports.SQL_MAX_COLUMNS_IN_INDEX = idb.SQL_MAX_COLUMNS_IN_INDEX;
exports.SQL_PROCEDURE_TERM = idb.SQL_PROCEDURE_TERM;
exports.SQL_QUALIFIER_TERM = idb.SQL_QUALIFIER_TERM;
exports.SQL_TXN_CAPABLE = idb.SQL_TXN_CAPABLE;
exports.SQL_OWNER_TERM = idb.SQL_OWNER_TERM;
exports.SQL_DATA_SOURCE_READ_ONLY = idb.SQL_DATA_SOURCE_READ_ONLY;
exports.SQL_DEFAULT_TXN_ISOLATION = idb.SQL_DEFAULT_TXN_ISOLATION;
exports.SQL_MULTIPLE_ACTIVE_TXN = idb.SQL_MULTIPLE_ACTIVE_TXN;
exports.SQL_QUALIFIER_NAME_SEPARATOR = idb.SQL_QUALIFIER_NAME_SEPARATOR;
exports.SQL_CORRELATION_NAME = idb.SQL_CORRELATION_NAME;
exports.SQL_NON_NULLABLE_COLUMNS = idb.SQL_NON_NULLABLE_COLUMNS;
exports.SQL_DRIVER_ODBC_VER = idb.SQL_DRIVER_ODBC_VER;
exports.SQL_GROUP_BY = idb.SQL_GROUP_BY;
exports.SQL_ORDER_BY_COLUMNS_IN_SELECT = idb.SQL_ORDER_BY_COLUMNS_IN_SELECT;
exports.SQL_OWNER_USAGE = idb.SQL_OWNER_USAGE;
exports.SQL_QUALIFIER_USAGE = idb.SQL_QUALIFIER_USAGE;
exports.SQL_QUOTED_IDENTIFIER_CASE = idb.SQL_QUOTED_IDENTIFIER_CASE;
exports.SQL_MAX_ROW_SIZE = idb.SQL_MAX_ROW_SIZE;
exports.SQL_QUALIFIER_LOCATION = idb.SQL_QUALIFIER_LOCATION;
exports.SQL_MAX_CATALOG_NAME_LEN = idb.SQL_MAX_CATALOG_NAME_LEN;
exports.SQL_MAX_STATEMENT_LEN = idb.SQL_MAX_STATEMENT_LEN;
exports.SQL_SEARCH_PATTERN_ESCAPE = idb.SQL_SEARCH_PATTERN_ESCAPE;
exports.SQL_OUTER_JOINS = idb.SQL_OUTER_JOINS;
exports.SQL_LIKE_ESCAPE_CLAUSE = idb.SQL_LIKE_ESCAPE_CLAUSE;
exports.SQL_CATALOG_NAME = idb.SQL_CATALOG_NAME;
exports.SQL_DESCRIBE_PARAMETER = idb.SQL_DESCRIBE_PARAMETER;
exports.SQL_STRING_FUNCTIONS = idb.SQL_STRING_FUNCTIONS;
exports.SQL_NUMERIC_FUNCTIONS = idb.SQL_NUMERIC_FUNCTIONS;
exports.SQL_CONVERT_FUNCTIONS = idb.SQL_CONVERT_FUNCTIONS;
exports.SQL_TIMEDATE_FUNCTIONS = idb.SQL_TIMEDATE_FUNCTIONS;
exports.SQL_SQL92_PREDICATES = idb.SQL_SQL92_PREDICATES;
exports.SQL_SQL92_VALUE_EXPRESSIONS = idb.SQL_SQL92_VALUE_EXPRESSIONS;
exports.SQL_AGGREGATE_FUNCTIONS = idb.SQL_AGGREGATE_FUNCTIONS;
exports.SQL_SQL_CONFORMANCE = idb.SQL_SQL_CONFORMANCE;
exports.SQL_CONVERT_CHAR = idb.SQL_CONVERT_CHAR;
exports.SQL_CONVERT_NUMERIC = idb.SQL_CONVERT_NUMERIC;
exports.SQL_CONVERT_DECIMAL = idb.SQL_CONVERT_DECIMAL;
exports.SQL_CONVERT_INTEGER = idb.SQL_CONVERT_INTEGER;
exports.SQL_CONVERT_SMALLINT = idb.SQL_CONVERT_SMALLINT;
exports.SQL_CONVERT_FLOAT = idb.SQL_CONVERT_FLOAT;
exports.SQL_CONVERT_REAL = idb.SQL_CONVERT_REAL;
exports.SQL_CONVERT_DOUBLE = idb.SQL_CONVERT_DOUBLE;
exports.SQL_CONVERT_VARCHAR = idb.SQL_CONVERT_VARCHAR;
exports.SQL_CONVERT_LONGVARCHAR = idb.SQL_CONVERT_LONGVARCHAR;
exports.SQL_CONVERT_BINARY = idb.SQL_CONVERT_BINARY;
exports.SQL_CONVERT_VARBINARY = idb.SQL_CONVERT_VARBINARY;
exports.SQL_CONVERT_BIT = idb.SQL_CONVERT_BIT;
exports.SQL_CONVERT_TINYINT = idb.SQL_CONVERT_TINYINT;
exports.SQL_CONVERT_BIGINT = idb.SQL_CONVERT_BIGINT;
exports.SQL_CONVERT_DATE = idb.SQL_CONVERT_DATE;
exports.SQL_CONVERT_TIME = idb.SQL_CONVERT_TIME;
exports.SQL_CONVERT_TIMESTAMP = idb.SQL_CONVERT_TIMESTAMP;
exports.SQL_CONVERT_LONGVARBINARY = idb.SQL_CONVERT_LONGVARBINARY;
exports.SQL_CONVERT_INTERVAL_YEAR_MONTH = idb.SQL_CONVERT_INTERVAL_YEAR_MONTH;
exports.SQL_CONVERT_INTERVAL_DAY_TIME = idb.SQL_CONVERT_INTERVAL_DAY_TIME;
exports.SQL_CONVERT_WCHAR = idb.SQL_CONVERT_WCHAR;
exports.SQL_CONVERT_WLONGVARCHAR = idb.SQL_CONVERT_WLONGVARCHAR;
exports.SQL_CONVERT_WVARCHAR = idb.SQL_CONVERT_WVARCHAR;
exports.SQL_CONVERT_BLOB = idb.SQL_CONVERT_BLOB;
exports.SQL_CONVERT_CLOB = idb.SQL_CONVERT_CLOB;
exports.SQL_CONVERT_DBCLOB = idb.SQL_CONVERT_DBCLOB;
exports.SQL_CURSOR_COMMIT_BEHAVIOR = idb.SQL_CURSOR_COMMIT_BEHAVIOR;
exports.SQL_CURSOR_ROLLBACK_BEHAVIOR = idb.SQL_CURSOR_ROLLBACK_BEHAVIOR;
exports.SQL_POSITIONED_STATEMENTS = idb.SQL_POSITIONED_STATEMENTS;
exports.SQL_KEYWORDS = idb.SQL_KEYWORDS;
exports.SQL_CONNECTION_JOB_NAME = idb.SQL_CONNECTION_JOB_NAME;
exports.SQL_USER_NAME = idb.SQL_USER_NAME;
exports.SQL_DATABASE_NAME = idb.SQL_DATABASE_NAME;
exports.SQL_CONVERT_DECFLOAT7 = idb.SQL_CONVERT_DECFLOAT7;
exports.SQL_CONVERT_DECFLOAT16 = idb.SQL_CONVERT_DECFLOAT16;
exports.SQL_CONVERT_DECFLOAT34 = idb.SQL_CONVERT_DECFLOAT34;
exports.SQL_LOCK_TYPES = idb.SQL_LOCK_TYPES;
exports.SQL_POS_OPERATIONS = idb.SQL_POS_OPERATIONS;

exports.SQL_CB_DELETE = idb.SQL_CB_DELETE;
exports.SQL_CB_CLOSE = idb.SQL_CB_CLOSE;
exports.SQL_CB_PRESERVE = idb.SQL_CB_PRESERVE;

exports.SQL_SCHEMA_TERM = idb.SQL_SCHEMA_TERM;
exports.SQL_SCHEMA_USAGE = idb.SQL_SCHEMA_USAGE;
exports.SQL_CATALOG_LOCATION = idb.SQL_CATALOG_LOCATION;
exports.SQL_CATALOG_TERM = idb.SQL_CATALOG_TERM;
exports.SQL_CATALOG_USAGE = idb.SQL_CATALOG_USAGE;
exports.SQL_CATALOG_NAME_SEPARATOR = idb.SQL_CATALOG_NAME_SEPARATOR;
exports.SQL_OAC_NONE = idb.SQL_OAC_NONE;
exports.SQL_OAC_LEVEL1 = idb.SQL_OAC_LEVEL1;
exports.SQL_OAC_LEVEL2 = idb.SQL_OAC_LEVEL2;

exports.SQL_OSC_MINIMUM = idb.SQL_OSC_MINIMUM;
exports.SQL_OSC_CORE = idb.SQL_OSC_CORE;
exports.SQL_OSC_EXTENDED = idb.SQL_OSC_EXTENDED;

exports.SQL_QU_NOT_SUPPORTED = idb.SQL_QU_NOT_SUPPORTED;
exports.SQL_QU_DML_STATEMENTS = idb.SQL_QU_DML_STATEMENTS;
exports.SQL_QU_PROCEDURE_INVOCATION = idb.SQL_QU_PROCEDURE_INVOCATION;
exports.SQL_QU_TABLE_DEFINITION = idb.SQL_QU_TABLE_DEFINITION;
exports.SQL_QU_INDEX_DEFINITION = idb.SQL_QU_INDEX_DEFINITION;
exports.SQL_QU_PRIVILEGE_DEFINITION = idb.SQL_QU_PRIVILEGE_DEFINITION;
exports.SQL_QL_START = idb.SQL_QL_START;
exports.SQL_QL_END = idb.SQL_QL_END;

exports.SQL_OU_DML_STATEMENTS = idb.SQL_OU_DML_STATEMENTS;
exports.SQL_OU_PROCEDURE_INVOCATION = idb.SQL_OU_PROCEDURE_INVOCATION;
exports.SQL_OU_TABLE_DEFINITION = idb.SQL_OU_TABLE_DEFINITION;
exports.SQL_OU_INDEX_DEFINITION = idb.SQL_OU_INDEX_DEFINITION;
exports.SQL_OU_PRIVILEGE_DEFINITION = idb.SQL_OU_PRIVILEGE_DEFINITION;

exports.SQL_TC_NONE = idb.SQL_TC_NONE;
exports.SQL_TC_DML = idb.SQL_TC_DML;
exports.SQL_TC_ALL = idb.SQL_TC_ALL;
exports.SQL_TC_DDL_COMMIT = idb.SQL_TC_DDL_COMMIT;
exports.SQL_TC_DDL_IGNORE = idb.SQL_TC_DDL_IGNORE;
exports.SQL_TXN_READ_UNCOMMITTED_MASK = idb.SQL_TXN_READ_UNCOMMITTED_MASK;
exports.SQL_TXN_READ_COMMITTED_MASK = idb.SQL_TXN_READ_COMMITTED_MASK;
exports.SQL_TXN_REPEATABLE_READ_MASK = idb.SQL_TXN_REPEATABLE_READ_MASK;
exports.SQL_TXN_SERIALIZABLE_MASK = idb.SQL_TXN_SERIALIZABLE_MASK;

exports.SQL_FN_STR_CONCAT = idb.SQL_FN_STR_CONCAT;
exports.SQL_FN_STR_UCASE = idb.SQL_FN_STR_UCASE;
exports.SQL_FN_STR_LCASE = idb.SQL_FN_STR_LCASE;
exports.SQL_FN_STR_SUBSTRING = idb.SQL_FN_STR_SUBSTRING;
exports.SQL_FN_STR_LENGTH = idb.SQL_FN_STR_LENGTH;
exports.SQL_FN_STR_POSITION = idb.SQL_FN_STR_POSITION;
exports.SQL_FN_STR_LTRIM = idb.SQL_FN_STR_LTRIM;
exports.SQL_FN_STR_RTRIM = idb.SQL_FN_STR_RTRIM;
exports.SQL_POS_POSITION = idb.SQL_POS_POSITION;
exports.SQL_POS_REFRESH = idb.SQL_POS_REFRESH;
exports.SQL_POS_UPDATE = idb.SQL_POS_UPDATE;
exports.SQL_POS_DELETE = idb.SQL_POS_DELETE;
exports.SQL_POS_ADD = idb.SQL_POS_ADD;

exports.SQL_FN_NUM_ABS = idb.SQL_FN_NUM_ABS;
exports.SQL_FN_NUM_ACOS = idb.SQL_FN_NUM_ACOS;
exports.SQL_FN_NUM_ASIN = idb.SQL_FN_NUM_ASIN;
exports.SQL_FN_NUM_ATAN = idb.SQL_FN_NUM_ATAN;
exports.SQL_FN_NUM_ATAN2 = idb.SQL_FN_NUM_ATAN2;
exports.SQL_FN_NUM_CEILING = idb.SQL_FN_NUM_CEILING;
exports.SQL_FN_NUM_COS = idb.SQL_FN_NUM_COS;
exports.SQL_FN_NUM_COT = idb.SQL_FN_NUM_COT;
exports.SQL_FN_NUM_EXP = idb.SQL_FN_NUM_EXP;
exports.SQL_FN_NUM_FLOOR = idb.SQL_FN_NUM_FLOOR;
exports.SQL_FN_NUM_LOG = idb.SQL_FN_NUM_LOG;
exports.SQL_FN_NUM_MOD = idb.SQL_FN_NUM_MOD;
exports.SQL_FN_NUM_SIGN = idb.SQL_FN_NUM_SIGN;
exports.SQL_FN_NUM_SIN = idb.SQL_FN_NUM_SIN;
exports.SQL_FN_NUM_SQRT = idb.SQL_FN_NUM_SQRT;
exports.SQL_FN_NUM_TAN = idb.SQL_FN_NUM_TAN;
exports.SQL_FN_NUM_PI = idb.SQL_FN_NUM_PI;
exports.SQL_FN_NUM_RAND = idb.SQL_FN_NUM_RAND;
exports.SQL_FN_NUM_DEGREES = idb.SQL_FN_NUM_DEGREES;
exports.SQL_FN_NUM_LOG10 = idb.SQL_FN_NUM_LOG10;
exports.SQL_FN_NUM_POWER = idb.SQL_FN_NUM_POWER;
exports.SQL_FN_NUM_RADIANS = idb.SQL_FN_NUM_RADIANS;
exports.SQL_FN_NUM_ROUND = idb.SQL_FN_NUM_ROUND;
exports.SQL_FN_NUM_TRUNCATE = idb.SQL_FN_NUM_TRUNCATE;

exports.SQL_SVE_CASE = idb.SQL_SVE_CASE;
exports.SQL_SVE_CAST = idb.SQL_SVE_CAST;
exports.SQL_SVE_COALESCE = idb.SQL_SVE_COALESCE;
exports.SQL_SVE_NULLIF = idb.SQL_SVE_NULLIF;

exports.SQL_SP_EXISTS = idb.SQL_SP_EXISTS;
exports.SQL_SP_ISNOTNULL = idb.SQL_SP_ISNOTNULL;
exports.SQL_SP_ISNULL = idb.SQL_SP_ISNULL;
exports.SQL_SP_MATCH_FULL = idb.SQL_SP_MATCH_FULL;
exports.SQL_SP_MATCH_PARTIAL = idb.SQL_SP_MATCH_PARTIAL;
exports.SQL_SP_MATCH_UNIQUE_FULL = idb.SQL_SP_MATCH_UNIQUE_FULL;
exports.SQL_SP_MATCH_UNIQUE_PARTIAL = idb.SQL_SP_MATCH_UNIQUE_PARTIAL;
exports.SQL_SP_OVERLAPS = idb.SQL_SP_OVERLAPS;
exports.SQL_SP_UNIQUE = idb.SQL_SP_UNIQUE;
exports.SQL_SP_LIKE = idb.SQL_SP_LIKE;
exports.SQL_SP_IN = idb.SQL_SP_IN;
exports.SQL_SP_BETWEEN = idb.SQL_SP_BETWEEN;
exports.SQL_SP_COMPARISON = idb.SQL_SP_COMPARISON;
exports.SQL_SP_QUANTIFIED_COMPARISON = idb.SQL_SP_QUANTIFIED_COMPARISON;

exports.SQL_AF_AVG = idb.SQL_AF_AVG;
exports.SQL_AF_COUNT = idb.SQL_AF_COUNT;
exports.SQL_AF_MAX = idb.SQL_AF_MAX;
exports.SQL_AF_MIN = idb.SQL_AF_MIN;
exports.SQL_AF_SUM = idb.SQL_AF_SUM;
exports.SQL_AF_DISTINCT = idb.SQL_AF_DISTINCT;
exports.SQL_AF_ALL = idb.SQL_AF_ALL;

exports.SQL_SC_SQL92_ENTRY = idb.SQL_SC_SQL92_ENTRY;
exports.SQL_SC_FIPS127_2_TRANSITIONAL = idb.SQL_SC_FIPS127_2_TRANSITIONAL;
exports.SQL_SC_SQL92_INTERMEDIATE = idb.SQL_SC_SQL92_INTERMEDIATE;
exports.SQL_SC_SQL92_FULL = idb.SQL_SC_SQL92_FULL;

exports.SQL_FN_CVT_CONVERT = idb.SQL_FN_CVT_CONVERT;
exports.SQL_FN_CVT_CAST = idb.SQL_FN_CVT_CAST;

exports.SQL_PS_POSITIONED_DELETE = idb.SQL_PS_POSITIONED_DELETE;
exports.SQL_PS_POSITIONED_UPDATE = idb.SQL_PS_POSITIONED_UPDATE;
exports.SQL_PS_SELECT_FOR_UPDATE = idb.SQL_PS_SELECT_FOR_UPDATE;

exports.SQL_CVT_CHAR = idb.SQL_CVT_CHAR;
exports.SQL_CVT_NUMERIC = idb.SQL_CVT_NUMERIC;
exports.SQL_CVT_DECIMAL = idb.SQL_CVT_DECIMAL;
exports.SQL_CVT_INTEGER = idb.SQL_CVT_INTEGER;
exports.SQL_CVT_SMALLINT = idb.SQL_CVT_SMALLINT;
exports.SQL_CVT_FLOAT = idb.SQL_CVT_FLOAT;
exports.SQL_CVT_REAL = idb.SQL_CVT_REAL;
exports.SQL_CVT_DOUBLE = idb.SQL_CVT_DOUBLE;
exports.SQL_CVT_VARCHAR = idb.SQL_CVT_VARCHAR;
exports.SQL_CVT_LONGVARCHAR = idb.SQL_CVT_LONGVARCHAR;
exports.SQL_CVT_BINARY = idb.SQL_CVT_BINARY;
exports.SQL_CVT_VARBINARY = idb.SQL_CVT_VARBINARY;
exports.SQL_CVT_BIT = idb.SQL_CVT_BIT;
exports.SQL_CVT_TINYINT = idb.SQL_CVT_TINYINT;
exports.SQL_CVT_BIGINT = idb.SQL_CVT_BIGINT;
exports.SQL_CVT_DATE = idb.SQL_CVT_DATE;
exports.SQL_CVT_TIME = idb.SQL_CVT_TIME;
exports.SQL_CVT_TIMESTAMP = idb.SQL_CVT_TIMESTAMP;
exports.SQL_CVT_LONGVARBINARY = idb.SQL_CVT_LONGVARBINARY;
exports.SQL_CVT_INTERVAL_YEAR_MONTH = idb.SQL_CVT_INTERVAL_YEAR_MONTH;
exports.SQL_CVT_INTERVAL_DAY_TIME = idb.SQL_CVT_INTERVAL_DAY_TIME;
exports.SQL_CVT_WCHAR = idb.SQL_CVT_WCHAR;
exports.SQL_CVT_WLONGVARCHAR = idb.SQL_CVT_WLONGVARCHAR;
exports.SQL_CVT_WVARCHAR = idb.SQL_CVT_WVARCHAR;
exports.SQL_CVT_BLOB = idb.SQL_CVT_BLOB;
exports.SQL_CVT_CLOB = idb.SQL_CVT_CLOB;
exports.SQL_CVT_DBCLOB = idb.SQL_CVT_DBCLOB;
exports.SQL_CVT_DECFLOAT7 = idb.SQL_CVT_DECFLOAT7;
exports.SQL_CVT_DECFLOAT16 = idb.SQL_CVT_DECFLOAT16;
exports.SQL_CVT_DECFLOAT34 = idb.SQL_CVT_DECFLOAT34;

exports.SQL_FN_TD_NOW = idb.SQL_FN_TD_NOW;
exports.SQL_FN_TD_CURDATE = idb.SQL_FN_TD_CURDATE;
exports.SQL_FN_TD_DAYOFMONTH = idb.SQL_FN_TD_DAYOFMONTH;
exports.SQL_FN_TD_DAYOFWEEK = idb.SQL_FN_TD_DAYOFWEEK;
exports.SQL_FN_TD_DAYOFYEAR = idb.SQL_FN_TD_DAYOFYEAR;
exports.SQL_FN_TD_MONTH = idb.SQL_FN_TD_MONTH;
exports.SQL_FN_TD_QUARTER = idb.SQL_FN_TD_QUARTER;
exports.SQL_FN_TD_WEEK = idb.SQL_FN_TD_WEEK;
exports.SQL_FN_TD_YEAR = idb.SQL_FN_TD_YEAR;
exports.SQL_FN_TD_CURTIME = idb.SQL_FN_TD_CURTIME;
exports.SQL_FN_TD_HOUR = idb.SQL_FN_TD_HOUR;
exports.SQL_FN_TD_MINUTE = idb.SQL_FN_TD_MINUTE;
exports.SQL_FN_TD_SECOND = idb.SQL_FN_TD_SECOND;
exports.SQL_FN_TD_TIMESTAMPADD = idb.SQL_FN_TD_TIMESTAMPADD;
exports.SQL_FN_TD_TIMESTAMPDIFF = idb.SQL_FN_TD_TIMESTAMPDIFF;
exports.SQL_FN_TD_DAYNAME = idb.SQL_FN_TD_DAYNAME;
exports.SQL_FN_TD_MONTHNAME = idb.SQL_FN_TD_MONTHNAME;
exports.SQL_FN_TD_CURRENT_DATE = idb.SQL_FN_TD_CURRENT_DATE;
exports.SQL_FN_TD_CURRENT_TIME = idb.SQL_FN_TD_CURRENT_TIME;
exports.SQL_FN_TD_CURRENT_TIMESTAMP = idb.SQL_FN_TD_CURRENT_TIMESTAMP;
exports.SQL_FN_TD_EXTRACT = idb.SQL_FN_TD_EXTRACT;

exports.SQL_CN_NONE = idb.SQL_CN_NONE;
exports.SQL_CN_DIFFERENT = idb.SQL_CN_DIFFERENT;
exports.SQL_CN_ANY = idb.SQL_CN_ANY;

exports.SQL_IC_UPPER = idb.SQL_IC_UPPER;
exports.SQL_IC_LOWER = idb.SQL_IC_LOWER;
exports.SQL_IC_SENSITIVE = idb.SQL_IC_SENSITIVE;
exports.SQL_IC_MIXED = idb.SQL_IC_MIXED;

exports.SQL_NNC_NULL = idb.SQL_NNC_NULL;
exports.SQL_NNC_NON_NULL = idb.SQL_NNC_NON_NULL;

exports.SQL_GB_NO_RELATION = idb.SQL_GB_NO_RELATION;
exports.SQL_GB_NOT_SUPPORTED = idb.SQL_GB_NOT_SUPPORTED;
exports.SQL_GB_GROUP_BY_EQUALS_SELECT = idb.SQL_GB_GROUP_BY_EQUALS_SELECT;
exports.SQL_GB_GROUP_BY_CONTAINS_SELECT = idb.SQL_GB_GROUP_BY_CONTAINS_SELECT;

exports.SQL_CHAR = idb.SQL_CHAR;
exports.SQL_NUMERIC = idb.SQL_NUMERIC;
exports.SQL_DECIMAL = idb.SQL_DECIMAL;
exports.SQL_INTEGER = idb.SQL_INTEGER;
exports.SQL_SMALLINT = idb.SQL_SMALLINT;
exports.SQL_FLOAT = idb.SQL_FLOAT;
exports.SQL_REAL = idb.SQL_REAL;
exports.SQL_DOUBLE = idb.SQL_DOUBLE;
exports.SQL_DATETIME = idb.SQL_DATETIME;
exports.SQL_VARCHAR = idb.SQL_VARCHAR;
exports.SQL_BLOB = idb.SQL_BLOB;
exports.SQL_CLOB = idb.SQL_CLOB;
exports.SQL_DBCLOB = idb.SQL_DBCLOB;
exports.SQL_DATALINK = idb.SQL_DATALINK;
exports.SQL_WCHAR = idb.SQL_WCHAR;
exports.SQL_WVARCHAR = idb.SQL_WVARCHAR;
exports.SQL_BIGINT = idb.SQL_BIGINT;
exports.SQL_BLOB_LOCATOR = idb.SQL_BLOB_LOCATOR;
exports.SQL_CLOB_LOCATOR = idb.SQL_CLOB_LOCATOR;
exports.SQL_DBCLOB_LOCATOR = idb.SQL_DBCLOB_LOCATOR;
exports.SQL_UTF8_CHAR = idb.SQL_UTF8_CHAR;
exports.SQL_WLONGVARCHAR = idb.SQL_WLONGVARCHAR;
exports.SQL_LONGVARCHAR = idb.SQL_LONGVARCHAR;
exports.SQL_GRAPHIC = idb.SQL_GRAPHIC;
exports.SQL_VARGRAPHIC = idb.SQL_VARGRAPHIC;
exports.SQL_LONGVARGRAPHIC = idb.SQL_LONGVARGRAPHIC;
exports.SQL_BINARY = idb.SQL_BINARY;
exports.SQL_VARBINARY = idb.SQL_VARBINARY;
exports.SQL_LONGVARBINARY = idb.SQL_LONGVARBINARY;
exports.SQL_DATE = idb.SQL_DATE;
exports.SQL_TYPE_DATE = idb.SQL_TYPE_DATE;
exports.SQL_TIME = idb.SQL_TIME;
exports.SQL_TYPE_TIME = idb.SQL_TYPE_TIME;
exports.SQL_TIMESTAMP = idb.SQL_TIMESTAMP;
exports.SQL_TYPE_TIMESTAMP = idb.SQL_TYPE_TIMESTAMP;
exports.SQL_CODE_DATE = idb.SQL_CODE_DATE;
exports.SQL_CODE_TIME = idb.SQL_CODE_TIME;
exports.SQL_CODE_TIMESTAMP = idb.SQL_CODE_TIMESTAMP;
exports.SQL_ALL_TYPES = idb.SQL_ALL_TYPES;
exports.SQL_DECFLOAT = idb.SQL_DECFLOAT;
exports.SQL_XML = idb.SQL_XML;

exports.SQL_UNUSED = idb.SQL_UNUSED;
exports.SQL_HANDLE_ENV = idb.SQL_HANDLE_ENV;
exports.SQL_HANDLE_DBC = idb.SQL_HANDLE_DBC;
exports.SQL_HANDLE_STMT = idb.SQL_HANDLE_STMT;
exports.SQL_HANDLE_DESC = idb.SQL_HANDLE_DESC;
exports.SQL_NULL_HANDLE = idb.SQL_NULL_HANDLE;
exports.SQL_HANDLE_DBC_UNICODE = idb.SQL_HANDLE_DBC_UNICODE;

exports.SQL_NO_NULLS = idb.SQL_NO_NULLS;
exports.SQL_NULLABLE = idb.SQL_NULLABLE;
exports.SQL_NULLABLE_UNKNOWN = idb.SQL_NULLABLE_UNKNOWN;

exports.SQL_NO_TOTAL = idb.SQL_NO_TOTAL;
exports.SQL_NULL_DATA = idb.SQL_NULL_DATA;
exports.SQL_DATA_AT_EXEC = idb.SQL_DATA_AT_EXEC;
exports.SQL_BIGINT_PREC = idb.SQL_BIGINT_PREC;
exports.SQL_INTEGER_PREC = idb.SQL_INTEGER_PREC;
exports.SQL_SMALLINT_PREC = idb.SQL_SMALLINT_PREC;

exports.SQL_DEFAULT_PARAM = idb.SQL_DEFAULT_PARAM;
exports.SQL_UNASSIGNED = idb.SQL_UNASSIGNED;

exports.SQL_ATTR_READONLY = idb.SQL_ATTR_READONLY;
exports.SQL_ATTR_WRITE = idb.SQL_ATTR_WRITE;
exports.SQL_ATTR_READWRITE_UNKNOWN = idb.SQL_ATTR_READWRITE_UNKNOWN;

exports.SQL_CONCUR_LOCK = idb.SQL_CONCUR_LOCK;
exports.SQL_CONCUR_READ_ONLY = idb.SQL_CONCUR_READ_ONLY;
exports.SQL_CONCUR_ROWVER = idb.SQL_CONCUR_ROWVER;
exports.SQL_CONCUR_VALUES = idb.SQL_CONCUR_VALUES;

exports.SQL_ATTR_OUTPUT_NTS = idb.SQL_ATTR_OUTPUT_NTS;
exports.SQL_ATTR_SYS_NAMING = idb.SQL_ATTR_SYS_NAMING;
exports.SQL_ATTR_DEFAULT_LIB = idb.SQL_ATTR_DEFAULT_LIB;
exports.SQL_ATTR_SERVER_MODE = idb.SQL_ATTR_SERVER_MODE;
exports.SQL_ATTR_JOB_SORT_SEQUENCE = idb.SQL_ATTR_JOB_SORT_SEQUENCE;
exports.SQL_ATTR_ENVHNDL_COUNTER = idb.SQL_ATTR_ENVHNDL_COUNTER;
exports.SQL_ATTR_ESCAPE_CHAR = idb.SQL_ATTR_ESCAPE_CHAR;
exports.SQL_ATTR_INCLUDE_NULL_IN_LEN = idb.SQL_ATTR_INCLUDE_NULL_IN_LEN;
exports.SQL_ATTR_UTF8 = idb.SQL_ATTR_UTF8;
exports.SQL_ATTR_SYSCAP = idb.SQL_ATTR_SYSCAP;
exports.SQL_ATTR_REQUIRE_PROFILE = idb.SQL_ATTR_REQUIRE_PROFILE;
exports.SQL_ATTR_UCS2 = idb.SQL_ATTR_UCS2;
exports.SQL_ATTR_TRUNCATION_RTNC = idb.SQL_ATTR_TRUNCATION_RTNC;

exports.SQL_ATTR_DATE_FMT = idb.SQL_ATTR_DATE_FMT;
exports.SQL_ATTR_DATE_SEP = idb.SQL_ATTR_DATE_SEP;
exports.SQL_ATTR_TIME_FMT = idb.SQL_ATTR_TIME_FMT;
exports.SQL_ATTR_TIME_SEP = idb.SQL_ATTR_TIME_SEP;
exports.SQL_ATTR_DECIMAL_SEP = idb.SQL_ATTR_DECIMAL_SEP;
exports.SQL_ATTR_TXN_INFO = idb.SQL_ATTR_TXN_INFO;
exports.SQL_ATTR_TXN_EXTERNAL = idb.SQL_ATTR_TXN_EXTERNAL;
exports.SQL_ATTR_2ND_LEVEL_TEXT = idb.SQL_ATTR_2ND_LEVEL_TEXT;
exports.SQL_ATTR_SAVEPOINT_NAME = idb.SQL_ATTR_SAVEPOINT_NAME;
exports.SQL_ATTR_TRACE = idb.SQL_ATTR_TRACE;
exports.SQL_ATTR_MAX_PRECISION = idb.SQL_ATTR_MAX_PRECISION;
exports.SQL_ATTR_MAX_SCALE = idb.SQL_ATTR_MAX_SCALE;
exports.SQL_ATTR_MIN_DIVIDE_SCALE = idb.SQL_ATTR_MIN_DIVIDE_SCALE;
exports.SQL_ATTR_HEX_LITERALS = idb.SQL_ATTR_HEX_LITERALS;
exports.SQL_ATTR_CORRELATOR = idb.SQL_ATTR_CORRELATOR;
exports.SQL_ATTR_QUERY_OPTIMIZE_GOAL = idb.SQL_ATTR_QUERY_OPTIMIZE_GOAL;
exports.SQL_ATTR_CONN_SORT_SEQUENCE = idb.SQL_ATTR_CONN_SORT_SEQUENCE;
exports.SQL_ATTR_PREFETCH = idb.SQL_ATTR_PREFETCH;
exports.SQL_ATTR_CLOSEONEOF = idb.SQL_ATTR_CLOSEONEOF;
exports.SQL_ATTR_ANSI_APP = idb.SQL_ATTR_ANSI_APP;
exports.SQL_ATTR_INFO_USERID = idb.SQL_ATTR_INFO_USERID;
exports.SQL_ATTR_INFO_WRKSTNNAME = idb.SQL_ATTR_INFO_WRKSTNNAME;
exports.SQL_ATTR_INFO_APPLNAME = idb.SQL_ATTR_INFO_APPLNAME;
exports.SQL_ATTR_INFO_ACCTSTR = idb.SQL_ATTR_INFO_ACCTSTR;
exports.SQL_ATTR_INFO_PROGRAMID = idb.SQL_ATTR_INFO_PROGRAMID;
exports.SQL_ATTR_DECFLOAT_ROUNDING_MODE = idb.SQL_ATTR_DECFLOAT_ROUNDING_MODE;
exports.SQL_ATTR_OLD_MTADTA_BEHAVIOR = idb.SQL_ATTR_OLD_MTADTA_BEHAVIOR;
exports.SQL_ATTR_NULL_REQUIRED = idb.SQL_ATTR_NULL_REQUIRED;
exports.SQL_ATTR_FREE_LOCATORS = idb.SQL_ATTR_FREE_LOCATORS;
exports.SQL_ATTR_EXTENDED_INDICATORS = idb.SQL_ATTR_EXTENDED_INDICATORS;
exports.SQL_ATTR_NULLT_ARRAY_RESULTS = idb.SQL_ATTR_NULLT_ARRAY_RESULTS;
exports.SQL_ATTR_NULLT_OUTPUT_PARMS = idb.SQL_ATTR_NULLT_OUTPUT_PARMS;
exports.SQL_ATTR_TIMESTAMP_PREC = idb.SQL_ATTR_TIMESTAMP_PREC;
exports.SQL_ATTR_CONCURRENT_ACCESS_RESOLUTION = idb.SQL_ATTR_CONCURRENT_ACCESS_RESOLUTION;
exports.SQL_CONCURRENT_ACCESS_RESOLUTION_UNSET = idb.SQL_CONCURRENT_ACCESS_RESOLUTION_UNSET;
exports.SQL_USE_CURRENTLY_COMMITTED = idb.SQL_USE_CURRENTLY_COMMITTED;
exports.SQL_WAIT_FOR_OUTCOME = idb.SQL_WAIT_FOR_OUTCOME;
exports.SQL_SKIP_LOCKED_DATA = idb.SQL_SKIP_LOCKED_DATA;

exports.SQL_TXN_FIND = idb.SQL_TXN_FIND;
exports.SQL_TXN_CREATE = idb.SQL_TXN_CREATE;
exports.SQL_TXN_RESUME = idb.SQL_TXN_RESUME;
exports.SQL_TXN_CLEAR = idb.SQL_TXN_CLEAR;
exports.SQL_TXN_END = idb.SQL_TXN_END;
exports.SQL_TXN_HOLD = idb.SQL_TXN_HOLD;
exports.SQL_TXN_END_FAIL = idb.SQL_TXN_END_FAIL;

exports.SQL_FMT_ISO = idb.SQL_FMT_ISO;
exports.SQL_FMT_USA = idb.SQL_FMT_USA;
exports.SQL_FMT_EUR = idb.SQL_FMT_EUR;
exports.SQL_FMT_JIS = idb.SQL_FMT_JIS;
exports.SQL_FMT_MDY = idb.SQL_FMT_MDY;
exports.SQL_FMT_DMY = idb.SQL_FMT_DMY;
exports.SQL_FMT_YMD = idb.SQL_FMT_YMD;
exports.SQL_FMT_JUL = idb.SQL_FMT_JUL;
exports.SQL_FMT_HMS = idb.SQL_FMT_HMS;
exports.SQL_FMT_JOB = idb.SQL_FMT_JOB;
exports.SQL_SEP_SLASH = idb.SQL_SEP_SLASH;
exports.SQL_SEP_DASH = idb.SQL_SEP_DASH;
exports.SQL_SEP_PERIOD = idb.SQL_SEP_PERIOD;
exports.SQL_SEP_COMMA = idb.SQL_SEP_COMMA;
exports.SQL_SEP_BLANK = idb.SQL_SEP_BLANK;
exports.SQL_SEP_COLON = idb.SQL_SEP_COLON;
exports.SQL_SEP_JOB = idb.SQL_SEP_JOB;
exports.SQL_HEX_IS_CHAR = idb.SQL_HEX_IS_CHAR;
exports.SQL_HEX_IS_BINARY = idb.SQL_HEX_IS_BINARY;
exports.SQL_FIRST_IO = idb.SQL_FIRST_IO;
exports.SQL_ALL_IO = idb.SQL_ALL_IO;
exports.ROUND_HALF_EVEN = idb.ROUND_HALF_EVEN;
exports.ROUND_HALF_UP = idb.ROUND_HALF_UP;
exports.ROUND_DOWN = idb.ROUND_DOWN;
exports.ROUND_CEILING = idb.ROUND_CEILING;
exports.ROUND_FLOOR = idb.ROUND_FLOOR;
exports.ROUND_HALF_DOWN = idb.ROUND_HALF_DOWN;
exports.ROUND_UP = idb.ROUND_UP;

exports.SQL_DEFAULT = idb.SQL_DEFAULT;
exports.SQL_ARD_TYPE = idb.SQL_ARD_TYPE;

exports.SQL_CASCADE = idb.SQL_CASCADE;
exports.SQL_RESTRICT = idb.SQL_RESTRICT;
exports.SQL_NO_ACTION = idb.SQL_NO_ACTION;
exports.SQL_SET_NULL = idb.SQL_SET_NULL;
exports.SQL_SET_DEFAULT = idb.SQL_SET_DEFAULT;
exports.SQL_INITIALLY_DEFERRED = idb.SQL_INITIALLY_DEFERRED;
exports.SQL_INITIALLY_IMMEDIATE = idb.SQL_INITIALLY_IMMEDIATE;
exports.SQL_NOT_DEFERRABLE = idb.SQL_NOT_DEFERRABLE;
exports.SQL_PT_UNKNOWN = idb.SQL_PT_UNKNOWN;
exports.SQL_PT_PROCEDURE = idb.SQL_PT_PROCEDURE;
exports.SQL_PT_FUNCTION = idb.SQL_PT_FUNCTION;

exports.SQL_PARAM_INPUT = idb.SQL_PARAM_INPUT;
exports.SQL_PARAM_OUTPUT = idb.SQL_PARAM_OUTPUT;
exports.SQL_PARAM_INPUT_OUTPUT = idb.SQL_PARAM_INPUT_OUTPUT;
exports.SQL_ATTR_APP_ROW_DESC = idb.SQL_ATTR_APP_ROW_DESC;
exports.SQL_ATTR_APP_PARAM_DESC = idb.SQL_ATTR_APP_PARAM_DESC;
exports.SQL_ATTR_IMP_ROW_DESC = idb.SQL_ATTR_IMP_ROW_DESC;
exports.SQL_ATTR_IMP_PARAM_DESC = idb.SQL_ATTR_IMP_PARAM_DESC;
exports.SQL_ATTR_FOR_FETCH_ONLY = idb.SQL_ATTR_FOR_FETCH_ONLY;
exports.SQL_ATTR_CONCURRENCY = idb.SQL_ATTR_CONCURRENCY;
exports.SQL_CONCURRENCY = idb.SQL_CONCURRENCY;
exports.SQL_ATTR_CURSOR_SCROLLABLE = idb.SQL_ATTR_CURSOR_SCROLLABLE;
exports.SQL_ATTR_ROWSET_SIZE = idb.SQL_ATTR_ROWSET_SIZE;
exports.SQL_ROWSET_SIZE = idb.SQL_ROWSET_SIZE;
exports.SQL_ATTR_ROW_ARRAY_SIZE = idb.SQL_ATTR_ROW_ARRAY_SIZE;
exports.SQL_ATTR_CURSOR_HOLD = idb.SQL_ATTR_CURSOR_HOLD;
exports.SQL_ATTR_FULL_OPEN = idb.SQL_ATTR_FULL_OPEN;
exports.SQL_ATTR_EXTENDED_COL_INFO = idb.SQL_ATTR_EXTENDED_COL_INFO;
exports.SQL_ATTR_BIND_TYPE = idb.SQL_ATTR_BIND_TYPE;
exports.SQL_BIND_TYPE = idb.SQL_BIND_TYPE;
exports.SQL_ATTR_CURSOR_TYPE = idb.SQL_ATTR_CURSOR_TYPE;
exports.SQL_CURSOR_TYPE = idb.SQL_CURSOR_TYPE;
exports.SQL_ATTR_CURSOR_SENSITIVITY = idb.SQL_ATTR_CURSOR_SENSITIVITY;
exports.SQL_CURSOR_SENSITIVE = idb.SQL_CURSOR_SENSITIVE;
exports.SQL_ATTR_ROW_STATUS_PTR = idb.SQL_ATTR_ROW_STATUS_PTR;
exports.SQL_ATTR_ROWS_FETCHED_PTR = idb.SQL_ATTR_ROWS_FETCHED_PTR;
exports.SQL_ATTR_ROW_BIND_TYPE = idb.SQL_ATTR_ROW_BIND_TYPE;
exports.SQL_ATTR_PARAM_BIND_TYPE = idb.SQL_ATTR_PARAM_BIND_TYPE;
exports.SQL_ATTR_PARAMSET_SIZE = idb.SQL_ATTR_PARAMSET_SIZE;
exports.SQL_ATTR_PARAM_STATUS_PTR = idb.SQL_ATTR_PARAM_STATUS_PTR;
exports.SQL_ATTR_PARAMS_PROCESSED_PTR = idb.SQL_ATTR_PARAMS_PROCESSED_PTR;
exports.SQL_ATTR_NUMBER_RESULTSET_ROWS_PTR = idb.SQL_ATTR_NUMBER_RESULTSET_ROWS_PTR;
exports.SQL_BIND_BY_ROW = idb.SQL_BIND_BY_ROW;
exports.SQL_BIND_BY_COLUMN = idb.SQL_BIND_BY_COLUMN;
exports.SQL_CURSOR_FORWARD_ONLY = idb.SQL_CURSOR_FORWARD_ONLY;
exports.SQL_CURSOR_STATIC = idb.SQL_CURSOR_STATIC;
exports.SQL_CURSOR_DYNAMIC = idb.SQL_CURSOR_DYNAMIC;
exports.SQL_CURSOR_KEYSET_DRIVEN = idb.SQL_CURSOR_KEYSET_DRIVEN;
exports.SQL_UNSPECIFIED = idb.SQL_UNSPECIFIED;
exports.SQL_INSENSITIVE = idb.SQL_INSENSITIVE;
exports.SQL_SENSITIVE = idb.SQL_SENSITIVE;
exports.SQL_FETCH_NEXT = idb.SQL_FETCH_NEXT;
exports.SQL_FETCH_FIRST = idb.SQL_FETCH_FIRST;
exports.SQL_FETCH_LAST = idb.SQL_FETCH_LAST;
exports.SQL_FETCH_PRIOR = idb.SQL_FETCH_PRIOR;
exports.SQL_FETCH_ABSOLUTE = idb.SQL_FETCH_ABSOLUTE;
exports.SQL_FETCH_RELATIVE = idb.SQL_FETCH_RELATIVE;
exports.SQL_DESC_COUNT = idb.SQL_DESC_COUNT;
exports.SQL_DESC_TYPE = idb.SQL_DESC_TYPE;
exports.SQL_DESC_LENGTH = idb.SQL_DESC_LENGTH;
exports.SQL_DESC_LENGTH_PTR = idb.SQL_DESC_LENGTH_PTR;
exports.SQL_DESC_PRECISION = idb.SQL_DESC_PRECISION;
exports.SQL_DESC_SCALE = idb.SQL_DESC_SCALE;
exports.SQL_DESC_DATETIME_INTERVAL_CODE = idb.SQL_DESC_DATETIME_INTERVAL_CODE;
exports.SQL_DESC_NULLABLE = idb.SQL_DESC_NULLABLE;
exports.SQL_DESC_INDICATOR_PTR = idb.SQL_DESC_INDICATOR_PTR;
exports.SQL_DESC_DATA_PTR = idb.SQL_DESC_DATA_PTR;
exports.SQL_DESC_NAME = idb.SQL_DESC_NAME;
exports.SQL_DESC_UNNAMED = idb.SQL_DESC_UNNAMED;
exports.SQL_DESC_DISPLAY_SIZE = idb.SQL_DESC_DISPLAY_SIZE;
exports.SQL_DESC_AUTO_INCREMENT = idb.SQL_DESC_AUTO_INCREMENT;
exports.SQL_DESC_SEARCHABLE = idb.SQL_DESC_SEARCHABLE;
exports.SQL_DESC_UPDATABLE = idb.SQL_DESC_UPDATABLE;
exports.SQL_DESC_BASE_COLUMN = idb.SQL_DESC_BASE_COLUMN;
exports.SQL_DESC_BASE_TABLE = idb.SQL_DESC_BASE_TABLE;
exports.SQL_DESC_BASE_SCHEMA = idb.SQL_DESC_BASE_SCHEMA;
exports.SQL_DESC_LABEL = idb.SQL_DESC_LABEL;
exports.SQL_DESC_MONEY = idb.SQL_DESC_MONEY;
exports.SQL_DESC_TYPE_NAME = idb.SQL_DESC_TYPE_NAME;
exports.SQL_DESC_COLUMN_CCSID = idb.SQL_DESC_COLUMN_CCSID;
exports.SQL_DESC_ALLOC_TYPE = idb.SQL_DESC_ALLOC_TYPE;
exports.SQL_DESC_ALLOC_AUTO = idb.SQL_DESC_ALLOC_AUTO;
exports.SQL_DESC_ALLOC_USER = idb.SQL_DESC_ALLOC_USER;
exports.SQL_COLUMN_COUNT = idb.SQL_COLUMN_COUNT;
exports.SQL_COLUMN_TYPE = idb.SQL_COLUMN_TYPE;
exports.SQL_COLUMN_LENGTH = idb.SQL_COLUMN_LENGTH;
exports.SQL_COLUMN_LENGTH_PTR = idb.SQL_COLUMN_LENGTH_PTR;
exports.SQL_COLUMN_PRECISION = idb.SQL_COLUMN_PRECISION;
exports.SQL_COLUMN_SCALE = idb.SQL_COLUMN_SCALE;
exports.SQL_COLUMN_DATETIME_INTERVAL_CODE = idb.SQL_COLUMN_DATETIME_INTERVAL_CODE;
exports.SQL_COLUMN_NULLABLE = idb.SQL_COLUMN_NULLABLE;
exports.SQL_COLUMN_INDICATOR_PTR = idb.SQL_COLUMN_INDICATOR_PTR;
exports.SQL_COLUMN_DATA_PTR = idb.SQL_COLUMN_DATA_PTR;
exports.SQL_COLUMN_NAME = idb.SQL_COLUMN_NAME;
exports.SQL_COLUMN_UNNAMED = idb.SQL_COLUMN_UNNAMED;
exports.SQL_COLUMN_DISPLAY_SIZE = idb.SQL_COLUMN_DISPLAY_SIZE;
exports.SQL_COLUMN_AUTO_INCREMENT = idb.SQL_COLUMN_AUTO_INCREMENT;
exports.SQL_COLUMN_SEARCHABLE = idb.SQL_COLUMN_SEARCHABLE;
exports.SQL_COLUMN_UPDATABLE = idb.SQL_COLUMN_UPDATABLE;
exports.SQL_COLUMN_BASE_COLUMN = idb.SQL_COLUMN_BASE_COLUMN;
exports.SQL_COLUMN_BASE_TABLE = idb.SQL_COLUMN_BASE_TABLE;
exports.SQL_COLUMN_BASE_SCHEMA = idb.SQL_COLUMN_BASE_SCHEMA;
exports.SQL_COLUMN_LABEL = idb.SQL_COLUMN_LABEL;
exports.SQL_COLUMN_MONEY = idb.SQL_COLUMN_MONEY;
exports.SQL_COLUMN_ALLOC_TYPE = idb.SQL_COLUMN_ALLOC_TYPE;
exports.SQL_COLUMN_ALLOC_AUTO = idb.SQL_COLUMN_ALLOC_AUTO;
exports.SQL_COLUMN_ALLOC_USER = idb.SQL_COLUMN_ALLOC_USER;

exports.SQL_SCOPE_CURROW = idb.SQL_SCOPE_CURROW;
exports.SQL_SCOPE_TRANSACTION = idb.SQL_SCOPE_TRANSACTION;
exports.SQL_SCOPE_SESSION = idb.SQL_SCOPE_SESSION;
exports.SQL_PC_UNKNOWN = idb.SQL_PC_UNKNOWN;
exports.SQL_PC_NOT_PSEUDO = idb.SQL_PC_NOT_PSEUDO;
exports.SQL_PC_PSEUDO = idb.SQL_PC_PSEUDO;

exports.SQL_ATTR_AUTO_IPD = idb.SQL_ATTR_AUTO_IPD;
exports.SQL_ATTR_ACCESS_MODE = idb.SQL_ATTR_ACCESS_MODE;
exports.SQL_ACCESS_MODE = idb.SQL_ACCESS_MODE;
exports.SQL_ATTR_AUTOCOMMIT = idb.SQL_ATTR_AUTOCOMMIT;
exports.SQL_AUTOCOMMIT = idb.SQL_AUTOCOMMIT;
exports.SQL_ATTR_DBC_SYS_NAMING = idb.SQL_ATTR_DBC_SYS_NAMING;
exports.SQL_ATTR_DBC_DEFAULT_LIB = idb.SQL_ATTR_DBC_DEFAULT_LIB;
exports.SQL_ATTR_ADOPT_OWNER_AUTH = idb.SQL_ATTR_ADOPT_OWNER_AUTH;
exports.SQL_ATTR_SYSBAS_CMT = idb.SQL_ATTR_SYSBAS_CMT;
exports.SQL_ATTR_SET_SSA = idb.SQL_ATTR_SET_SSA;
exports.SQL_HEX_SORT_SEQUENCE = idb.SQL_HEX_SORT_SEQUENCE;
exports.SQL_JOB_SORT_SEQUENCE = idb.SQL_JOB_SORT_SEQUENCE;
exports.SQL_JOBRUN_SORT_SEQUENCE = idb.SQL_JOBRUN_SORT_SEQUENCE;
exports.SQL_ATTR_COMMIT = idb.SQL_ATTR_COMMIT;
exports.SQL_MODE_READ_ONLY = idb.SQL_MODE_READ_ONLY;
exports.SQL_MODE_READ_WRITE = idb.SQL_MODE_READ_WRITE;
exports.SQL_MODE_DEFAULT = idb.SQL_MODE_DEFAULT;
exports.SQL_AUTOCOMMIT_OFF = idb.SQL_AUTOCOMMIT_OFF;
exports.SQL_AUTOCOMMIT_ON = idb.SQL_AUTOCOMMIT_ON;
exports.SQL_TXN_ISOLATION = idb.SQL_TXN_ISOLATION;
exports.SQL_ATTR_TXN_ISOLATION = idb.SQL_ATTR_TXN_ISOLATION;
exports.SQL_COMMIT_NONE = idb.SQL_COMMIT_NONE;
exports.SQL_TXN_NO_COMMIT = idb.SQL_TXN_NO_COMMIT;
exports.SQL_TXN_NOCOMMIT = idb.SQL_TXN_NOCOMMIT;
exports.SQL_COMMIT_CHG = idb.SQL_COMMIT_CHG;
exports.SQL_COMMIT_UR = idb.SQL_COMMIT_UR;
exports.SQL_TXN_READ_UNCOMMITTED = idb.SQL_TXN_READ_UNCOMMITTED;
exports.SQL_COMMIT_CS = idb.SQL_COMMIT_CS;
exports.SQL_TXN_READ_COMMITTED = idb.SQL_TXN_READ_COMMITTED;
exports.SQL_COMMIT_ALL = idb.SQL_COMMIT_ALL;
exports.SQL_COMMIT_RS = idb.SQL_COMMIT_RS;
exports.SQL_TXN_REPEATABLE_READ = idb.SQL_TXN_REPEATABLE_READ;
exports.SQL_COMMIT_RR = idb.SQL_COMMIT_RR;
exports.SQL_TXN_SERIALIZABLE = idb.SQL_TXN_SERIALIZABLE;

exports.SQL_INDEX_UNIQUE = idb.SQL_INDEX_UNIQUE;
exports.SQL_INDEX_ALL = idb.SQL_INDEX_ALL;
exports.SQL_INDEX_OTHER = idb.SQL_INDEX_OTHER;
exports.SQL_TABLE_STAT = idb.SQL_TABLE_STAT;
exports.SQL_ENSURE = idb.SQL_ENSURE;
exports.SQL_QUICK = idb.SQL_QUICK;

exports.SQL_ATTR_TRACE_CLI = idb.SQL_ATTR_TRACE_CLI;
exports.SQL_ATTR_TRACE_DBMON = idb.SQL_ATTR_TRACE_DBMON;
exports.SQL_ATTR_TRACE_DEBUG = idb.SQL_ATTR_TRACE_DEBUG;
exports.SQL_ATTR_TRACE_JOBLOG = idb.SQL_ATTR_TRACE_JOBLOG;
exports.SQL_ATTR_TRACE_STRTRC = idb.SQL_ATTR_TRACE_STRTRC;

exports.SQL_FILE_READ = idb.SQL_FILE_READ;
exports.SQL_FILE_CREATE = idb.SQL_FILE_CREATE;
exports.SQL_FILE_OVERWRITE = idb.SQL_FILE_OVERWRITE;
exports.SQL_FILE_APPEND = idb.SQL_FILE_APPEND;

exports.SQL_DIAG_RETURNCODE = idb.SQL_DIAG_RETURNCODE;
exports.SQL_DIAG_NUMBER = idb.SQL_DIAG_NUMBER;
exports.SQL_DIAG_ROW_COUNT = idb.SQL_DIAG_ROW_COUNT;
exports.SQL_DIAG_SQLSTATE = idb.SQL_DIAG_SQLSTATE;
exports.SQL_DIAG_NATIVE = idb.SQL_DIAG_NATIVE;
exports.SQL_DIAG_MESSAGE_TEXT = idb.SQL_DIAG_MESSAGE_TEXT;
exports.SQL_DIAG_DYNAMIC_FUNCTION = idb.SQL_DIAG_DYNAMIC_FUNCTION;
exports.SQL_DIAG_CLASS_ORIGIN = idb.SQL_DIAG_CLASS_ORIGIN;
exports.SQL_DIAG_SUBCLASS_ORIGIN = idb.SQL_DIAG_SUBCLASS_ORIGIN;
exports.SQL_DIAG_CONNECTION_NAME = idb.SQL_DIAG_CONNECTION_NAME;
exports.SQL_DIAG_SERVER_NAME = idb.SQL_DIAG_SERVER_NAME;
exports.SQL_DIAG_MESSAGE_TOKENS = idb.SQL_DIAG_MESSAGE_TOKENS;
exports.SQL_DIAG_AUTOGEN_KEY = idb.SQL_DIAG_AUTOGEN_KEY;
exports.SQL_UNSEARCHABLE = idb.SQL_UNSEARCHABLE;
exports.SQL_LIKE_ONLY = idb.SQL_LIKE_ONLY;
exports.SQL_ALL_EXCEPT_LIKE = idb.SQL_ALL_EXCEPT_LIKE;
exports.SQL_SEARCHABLE = idb.SQL_SEARCHABLE;

exports.SQL_API_SQLALLOCCONNECT = idb.SQL_API_SQLALLOCCONNECT;
exports.SQL_API_SQLALLOCENV = idb.SQL_API_SQLALLOCENV;
exports.SQL_API_SQLALLOCHANDLE = idb.SQL_API_SQLALLOCHANDLE;
exports.SQL_API_SQLALLOCSTMT = idb.SQL_API_SQLALLOCSTMT;
exports.SQL_API_SQLBINDCOL = idb.SQL_API_SQLBINDCOL;
exports.SQL_API_SQLBINDFILETOCOL = idb.SQL_API_SQLBINDFILETOCOL;
exports.SQL_API_SQLBINDFILETOPARAM = idb.SQL_API_SQLBINDFILETOPARAM;
exports.SQL_API_SQLBINDPARAM = idb.SQL_API_SQLBINDPARAM;
exports.SQL_API_SQLBINDPARAMETER = idb.SQL_API_SQLBINDPARAMETER;
exports.SQL_API_SQLCANCEL = idb.SQL_API_SQLCANCEL;
exports.SQL_API_SQLCLOSECURSOR = idb.SQL_API_SQLCLOSECURSOR;
exports.SQL_API_SQLCOLATTRIBUTE = idb.SQL_API_SQLCOLATTRIBUTE;
exports.SQL_API_SQLCOLATTRIBUTEW = idb.SQL_API_SQLCOLATTRIBUTEW;
exports.SQL_API_SQLCOLATTRIBUTES = idb.SQL_API_SQLCOLATTRIBUTES;
exports.SQL_API_SQLCOLATTRIBUTESW = idb.SQL_API_SQLCOLATTRIBUTESW;
exports.SQL_API_SQLCOLUMNPRIVILEGES = idb.SQL_API_SQLCOLUMNPRIVILEGES;
exports.SQL_API_SQLCOLUMNPRIVILEGESW = idb.SQL_API_SQLCOLUMNPRIVILEGESW;
exports.SQL_API_SQLCOLUMNS = idb.SQL_API_SQLCOLUMNS;
exports.SQL_API_SQLCOLUMNSW = idb.SQL_API_SQLCOLUMNSW;
exports.SQL_API_SQLCONNECT = idb.SQL_API_SQLCONNECT;
exports.SQL_API_SQLCONNECTW = idb.SQL_API_SQLCONNECTW;
exports.SQL_API_SQLCOPYDESC = idb.SQL_API_SQLCOPYDESC;
exports.SQL_API_SQLDATASOURCES = idb.SQL_API_SQLDATASOURCES;
exports.SQL_API_SQLDATASOURCESW = idb.SQL_API_SQLDATASOURCESW;
exports.SQL_API_SQLDESCRIBECOL = idb.SQL_API_SQLDESCRIBECOL;
exports.SQL_API_SQLDESCRIBECOLW = idb.SQL_API_SQLDESCRIBECOLW;
exports.SQL_API_SQLDESCRIBEPARAM = idb.SQL_API_SQLDESCRIBEPARAM;
exports.SQL_API_SQLDISCONNECT = idb.SQL_API_SQLDISCONNECT;
exports.SQL_API_SQLDRIVERCONNECT = idb.SQL_API_SQLDRIVERCONNECT;
exports.SQL_API_SQLENDTRAN = idb.SQL_API_SQLENDTRAN;
exports.SQL_API_SQLERROR = idb.SQL_API_SQLERROR;
exports.SQL_API_SQLERRORW = idb.SQL_API_SQLERRORW;
exports.SQL_API_SQLEXECDIRECT = idb.SQL_API_SQLEXECDIRECT;
exports.SQL_API_SQLEXECDIRECTW = idb.SQL_API_SQLEXECDIRECTW;
exports.SQL_API_SQLEXECUTE = idb.SQL_API_SQLEXECUTE;
exports.SQL_API_SQLEXTENDEDFETCH = idb.SQL_API_SQLEXTENDEDFETCH;
exports.SQL_API_SQLFETCH = idb.SQL_API_SQLFETCH;
exports.SQL_API_SQLFETCHSCROLL = idb.SQL_API_SQLFETCHSCROLL;
exports.SQL_API_SQLFOREIGNKEYS = idb.SQL_API_SQLFOREIGNKEYS;
exports.SQL_API_SQLFOREIGNKEYSW = idb.SQL_API_SQLFOREIGNKEYSW;
exports.SQL_API_SQLFREECONNECT = idb.SQL_API_SQLFREECONNECT;
exports.SQL_API_SQLFREEENV = idb.SQL_API_SQLFREEENV;
exports.SQL_API_SQLFREEHANDLE = idb.SQL_API_SQLFREEHANDLE;
exports.SQL_API_SQLFREESTMT = idb.SQL_API_SQLFREESTMT;
exports.SQL_API_SQLGETCOL = idb.SQL_API_SQLGETCOL;
exports.SQL_API_SQLGETCOLW = idb.SQL_API_SQLGETCOLW;
exports.SQL_API_SQLGETCONNECTATTR = idb.SQL_API_SQLGETCONNECTATTR;
exports.SQL_API_SQLGETCONNECTATTRW = idb.SQL_API_SQLGETCONNECTATTRW;
exports.SQL_API_SQLGETCONNECTOPTION = idb.SQL_API_SQLGETCONNECTOPTION;
exports.SQL_API_SQLGETCONNECTOPTIONW = idb.SQL_API_SQLGETCONNECTOPTIONW;
exports.SQL_API_SQLGETCURSORNAME = idb.SQL_API_SQLGETCURSORNAME;
exports.SQL_API_SQLGETCURSORNAMEW = idb.SQL_API_SQLGETCURSORNAMEW;
exports.SQL_API_SQLGETDATA = idb.SQL_API_SQLGETDATA;
exports.SQL_API_SQLGETDESCFIELD = idb.SQL_API_SQLGETDESCFIELD;
exports.SQL_API_SQLGETDESCFIELDW = idb.SQL_API_SQLGETDESCFIELDW;
exports.SQL_API_SQLGETDESCREC = idb.SQL_API_SQLGETDESCREC;
exports.SQL_API_SQLGETDESCRECW = idb.SQL_API_SQLGETDESCRECW;
exports.SQL_API_SQLGETDIAGFIELD = idb.SQL_API_SQLGETDIAGFIELD;
exports.SQL_API_SQLGETDIAGFIELDW = idb.SQL_API_SQLGETDIAGFIELDW;
exports.SQL_API_SQLGETDIAGREC = idb.SQL_API_SQLGETDIAGREC;
exports.SQL_API_SQLGETDIAGRECW = idb.SQL_API_SQLGETDIAGRECW;
exports.SQL_API_SQLGETENVATTR = idb.SQL_API_SQLGETENVATTR;
exports.SQL_API_SQLGETFUNCTIONS = idb.SQL_API_SQLGETFUNCTIONS;
exports.SQL_API_SQLGETINFO = idb.SQL_API_SQLGETINFO;
exports.SQL_API_SQLGETINFOW = idb.SQL_API_SQLGETINFOW;
exports.SQL_API_SQLGETLENGTH = idb.SQL_API_SQLGETLENGTH;
exports.SQL_API_SQLGETPOSITION = idb.SQL_API_SQLGETPOSITION;
exports.SQL_API_SQLGETPOSITIONW = idb.SQL_API_SQLGETPOSITIONW;
exports.SQL_API_SQLGETSTMTATTR = idb.SQL_API_SQLGETSTMTATTR;
exports.SQL_API_SQLGETSTMTATTRW = idb.SQL_API_SQLGETSTMTATTRW;
exports.SQL_API_SQLGETSTMTOPTION = idb.SQL_API_SQLGETSTMTOPTION;
exports.SQL_API_SQLGETSTMTOPTIONW = idb.SQL_API_SQLGETSTMTOPTIONW;
exports.SQL_API_SQLGETSUBSTRING = idb.SQL_API_SQLGETSUBSTRING;
exports.SQL_API_SQLGETSUBSTRINGW = idb.SQL_API_SQLGETSUBSTRINGW;
exports.SQL_API_SQLGETTYPEINFO = idb.SQL_API_SQLGETTYPEINFO;
exports.SQL_API_SQLGETTYPEINFOW = idb.SQL_API_SQLGETTYPEINFOW;
exports.SQL_API_SQLLANGUAGES = idb.SQL_API_SQLLANGUAGES;
exports.SQL_API_SQLMORERESULTS = idb.SQL_API_SQLMORERESULTS;
exports.SQL_API_SQLNATIVESQL = idb.SQL_API_SQLNATIVESQL;
exports.SQL_API_SQLNATIVESQLW = idb.SQL_API_SQLNATIVESQLW;
exports.SQL_API_SQLNEXTRESULT = idb.SQL_API_SQLNEXTRESULT;
exports.SQL_API_SQLNUMPARAMS = idb.SQL_API_SQLNUMPARAMS;
exports.SQL_API_SQLNUMRESULTCOLS = idb.SQL_API_SQLNUMRESULTCOLS;
exports.SQL_API_SQLPARAMDATA = idb.SQL_API_SQLPARAMDATA;
exports.SQL_API_SQLPARAMOPTIONS = idb.SQL_API_SQLPARAMOPTIONS;
exports.SQL_API_SQLPREPARE = idb.SQL_API_SQLPREPARE;
exports.SQL_API_SQLPREPAREW = idb.SQL_API_SQLPREPAREW;
exports.SQL_API_SQLPRIMARYKEYS = idb.SQL_API_SQLPRIMARYKEYS;
exports.SQL_API_SQLPRIMARYKEYSW = idb.SQL_API_SQLPRIMARYKEYSW;
exports.SQL_API_SQLPROCEDURECOLUMNS = idb.SQL_API_SQLPROCEDURECOLUMNS;
exports.SQL_API_SQLPROCEDURECOLUMNSW = idb.SQL_API_SQLPROCEDURECOLUMNSW;
exports.SQL_API_SQLPROCEDURES = idb.SQL_API_SQLPROCEDURES;
exports.SQL_API_SQLPROCEDURESW = idb.SQL_API_SQLPROCEDURESW;
exports.SQL_API_SQLPUTDATA = idb.SQL_API_SQLPUTDATA;
exports.SQL_API_SQLRELEASEENV = idb.SQL_API_SQLRELEASEENV;
exports.SQL_API_SQLROWCOUNT = idb.SQL_API_SQLROWCOUNT;
exports.SQL_API_SQLSETCONNECTATTR = idb.SQL_API_SQLSETCONNECTATTR;
exports.SQL_API_SQLSETCONNECTATTRW = idb.SQL_API_SQLSETCONNECTATTRW;
exports.SQL_API_SQLSETCONNECTOPTION = idb.SQL_API_SQLSETCONNECTOPTION;
exports.SQL_API_SQLSETCONNECTOPTIONW = idb.SQL_API_SQLSETCONNECTOPTIONW;
exports.SQL_API_SQLSETCURSORNAME = idb.SQL_API_SQLSETCURSORNAME;
exports.SQL_API_SQLSETCURSORNAMEW = idb.SQL_API_SQLSETCURSORNAMEW;
exports.SQL_API_SQLSETDESCFIELD = idb.SQL_API_SQLSETDESCFIELD;
exports.SQL_API_SQLSETDESCFIELDW = idb.SQL_API_SQLSETDESCFIELDW;
exports.SQL_API_SQLSETDESCREC = idb.SQL_API_SQLSETDESCREC;
exports.SQL_API_SQLSETENVATTR = idb.SQL_API_SQLSETENVATTR;
exports.SQL_API_SQLSETPARAM = idb.SQL_API_SQLSETPARAM;
exports.SQL_API_SQLSETSTMTATTR = idb.SQL_API_SQLSETSTMTATTR;
exports.SQL_API_SQLSETSTMTATTRW = idb.SQL_API_SQLSETSTMTATTRW;
exports.SQL_API_SQLSETSTMTOPTION = idb.SQL_API_SQLSETSTMTOPTION;
exports.SQL_API_SQLSETSTMTOPTIONW = idb.SQL_API_SQLSETSTMTOPTIONW;
exports.SQL_API_SQLSPECIALCOLUMNS = idb.SQL_API_SQLSPECIALCOLUMNS;
exports.SQL_API_SQLSPECIALCOLUMNSW = idb.SQL_API_SQLSPECIALCOLUMNSW;
exports.SQL_API_SQLSTARTTRAN = idb.SQL_API_SQLSTARTTRAN;
exports.SQL_API_SQLSTATISTICS = idb.SQL_API_SQLSTATISTICS;
exports.SQL_API_SQLSTATISTICSW = idb.SQL_API_SQLSTATISTICSW;
exports.SQL_API_SQLTABLEPRIVILEGES = idb.SQL_API_SQLTABLEPRIVILEGES;
exports.SQL_API_SQLTABLEPRIVILEGESW = idb.SQL_API_SQLTABLEPRIVILEGESW;
exports.SQL_API_SQLTABLES = idb.SQL_API_SQLTABLES;
exports.SQL_API_SQLTABLESW = idb.SQL_API_SQLTABLESW;
exports.SQL_API_SQLTRANSACT = idb.SQL_API_SQLTRANSACT;
exports.SQL_API_SQLSETPOS = idb.SQL_API_SQLSETPOS;

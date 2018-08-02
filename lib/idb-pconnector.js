const dba = require('idb-connector');

/**
 * @class Connection
 * @constructor
 */
class Connection {
  constructor() {
    let me = this;

    me.dbconn = new dba.dbconn();
    console.log(`constructed, dbconn=${JSON.stringify(me.dbconn)}`);
  }

  /**
     * Establishes a Connection to the database.
     * @param {string} [database] - The name of the database to connect to. Defaults to "*LOCAL".
     * @returns {object} - The dbConn Object with an established connection.
     * @memberof Connection
     */
  connect(database = '*LOCAL') {
    let me = this;

    me.dbconn.conn(database);

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
    me.stmt = new dba.dbstmt(me.dbc);
  }

  /**
     * Associates parameter markers in an SQL statement to app variables.
     * @param {Array} params - An Array of the parameter list. Each parameter element will also be an Array with 3 values (Value, In/out Type, Indicator).
     * @example dbStmt.bindParam([
     *              [2099, dba.SQL_PARAM_INPUT, dba.SQL_BIND_NUMERIC],
     *              ['Node.Js', dba.SQL_PARAM_INPUT,dba.SQL_BIND_CHAR]
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

     const dba = require('idb-pconnector');
     try {
		  // note that that calling the new Statement() without the DbConn as a parameter
		  // creates a new connection automatically and uses that for the Statement.
		  let dbStmt = new dba.Statement();,
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

     const dba = require('idb-pconnector');
     try {
		  // note that that calling the new Statement() without the DbConn as a parameter
		  // creates a new connection automatically and uses that for the Statement.
		  let dbStmt = new dba.Statement(),
		      response;

		  await dbStmt.prepare('INSERT INTO AMUSSE.TABLE1 VALUES (?,?)');
		  await dbStmt.bind([
		      [2018, dba.SQL_PARAM_INPUT, dba.SQL_BIND_NUMERIC],
		      [null, dba.PARM_TYPE_INPUT, dba.SQL_BIND_NULL_DATA]
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
        if (rc === dba.SQL_SUCCESS ){ //dba.SQL_SUCCESS == 0
          resolve(result);
        } else if (rc === dba.SQL_NO_DATA_FOUND){
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
exports.SQL_BIND_BINARY = dba.SQL_BINARY;
exports.SQL_BIND_BLOB = dba.SQL_BLOB;

// export variables from original idb-connector
exports.SQL_FALSE = dba.SQL_FALSE;
exports.SQL_TRUE = dba.SQL_TRUE;
exports.SQL_NTS = dba.SQL_NTS;
exports.SQL_SQLSTATE_SIZE = dba.SQL_SQLSTATE_SIZE;
exports.SQL_MAX_MESSAGE_LENGTH = dba.SQL_MAX_MESSAGE_LENGTH;
exports.SQL_MAX_OPTION_STRING_LENGTH = dba.SQL_MAX_OPTION_STRING_LENGTH;

exports.SQL_SUCCESS = dba.SQL_SUCCESS;
exports.SQL_SUCCESS_WITH_INFO = dba.SQL_SUCCESS_WITH_INFO;
exports.SQL_NO_DATA_FOUND = dba.SQL_NO_DATA_FOUND;
exports.SQL_NEED_DATA = dba.SQL_NEED_DATA;
exports.SQL_NO_DATA = dba.SQL_NO_DATA;
exports.SQL_ERROR = dba.SQL_ERROR;
exports.SQL_INVALID_HANDLE = dba.SQL_INVALID_HANDLE;
exports.SQL_STILL_EXECUTING = dba.SQL_STILL_EXECUTING;

exports.SQL_CLOSE = dba.SQL_CLOSE;
exports.SQL_DROP = dba.SQL_DROP;
exports.SQL_UNBIND = dba.SQL_UNBIND;
exports.SQL_RESET_PARAMS = dba.SQL_RESET_PARAMS;

exports.SQL_C_DEFAULT = dba.SQL_C_DEFAULT;

exports.SQL_COMMIT = dba.SQL_COMMIT;
exports.SQL_ROLLBACK = dba.SQL_ROLLBACK;
exports.SQL_COMMIT_HOLD = dba.SQL_COMMIT_HOLD;
exports.SQL_ROLLBACK_HOLD = dba.SQL_ROLLBACK_HOLD;
exports.SQL_SAVEPOINT_NAME_RELEASE = dba.SQL_SAVEPOINT_NAME_RELEASE;
exports.SQL_SAVEPOINT_NAME_ROLLBACK = dba.SQL_SAVEPOINT_NAME_ROLLBACK;

exports.SQL_DRIVER_COMPLETE = dba.SQL_DRIVER_COMPLETE;
exports.SQL_DRIVER_COMPLETE_REQUIRED = dba.SQL_DRIVER_COMPLETE_REQUIRED;
exports.SQL_DRIVER_NOPROMPT = dba.SQL_DRIVER_NOPROMPT;
exports.SQL_DRIVER_PROMPT = dba.SQL_DRIVER_PROMPT;

exports.SQL_ACTIVE_CONNECTIONS = dba.SQL_ACTIVE_CONNECTIONS;
exports.SQL_MAX_DRIVER_CONNECTIONS = dba.SQL_MAX_DRIVER_CONNECTIONS;
exports.SQL_MAX_CONCURRENT_ACTIVITIES = dba.SQL_MAX_CONCURRENT_ACTIVITIES;
exports.SQL_ACTIVE_STATEMENTS = dba.SQL_ACTIVE_STATEMENTS;
exports.SQL_PROCEDURES = dba.SQL_PROCEDURES;
exports.SQL_DRIVER_NAME = dba.SQL_DRIVER_NAME;
exports.SQL_ODBC_API_CONFORMANCE = dba.SQL_ODBC_API_CONFORMANCE;
exports.SQL_ODBC_SQL_CONFORMANCE = dba.SQL_ODBC_SQL_CONFORMANCE;
exports.SQL_DBMS_NAME = dba.SQL_DBMS_NAME;
exports.SQL_DBMS_VER = dba.SQL_DBMS_VER;
exports.SQL_DRIVER_VER = dba.SQL_DRIVER_VER;
exports.SQL_IDENTIFIER_CASE = dba.SQL_IDENTIFIER_CASE;
exports.SQL_IDENTIFIER_QUOTE_CHAR = dba.SQL_IDENTIFIER_QUOTE_CHAR;
exports.SQL_MAX_COLUMN_NAME_LEN = dba.SQL_MAX_COLUMN_NAME_LEN;
exports.SQL_MAX_CURSOR_NAME_LEN = dba.SQL_MAX_CURSOR_NAME_LEN;
exports.SQL_MAX_OWNER_NAME_LEN = dba.SQL_MAX_OWNER_NAME_LEN;
exports.SQL_MAX_SCHEMA_NAME_LEN = dba.SQL_MAX_SCHEMA_NAME_LEN;
exports.SQL_MAX_TABLE_NAME_LEN = dba.SQL_MAX_TABLE_NAME_LEN;
exports.SQL_MAX_COLUMNS_IN_GROUP_BY = dba.SQL_MAX_COLUMNS_IN_GROUP_BY;
exports.SQL_MAX_COLUMNS_IN_ORDER_BY = dba.SQL_MAX_COLUMNS_IN_ORDER_BY;
exports.SQL_MAX_COLUMNS_IN_SELECT = dba.SQL_MAX_COLUMNS_IN_SELECT;
exports.SQL_MAX_COLUMNS_IN_TABLE = dba.SQL_MAX_COLUMNS_IN_TABLE;
exports.SQL_MAX_TABLES_IN_SELECT = dba.SQL_MAX_TABLES_IN_SELECT;
exports.SQL_COLUMN_ALIAS = dba.SQL_COLUMN_ALIAS;
exports.SQL_DATA_SOURCE_NAME = dba.SQL_DATA_SOURCE_NAME;
exports.SQL_DATASOURCE_NAME = dba.SQL_DATASOURCE_NAME;
exports.SQL_MAX_COLUMNS_IN_INDEX = dba.SQL_MAX_COLUMNS_IN_INDEX;
exports.SQL_PROCEDURE_TERM = dba.SQL_PROCEDURE_TERM;
exports.SQL_QUALIFIER_TERM = dba.SQL_QUALIFIER_TERM;
exports.SQL_TXN_CAPABLE = dba.SQL_TXN_CAPABLE;
exports.SQL_OWNER_TERM = dba.SQL_OWNER_TERM;
exports.SQL_DATA_SOURCE_READ_ONLY = dba.SQL_DATA_SOURCE_READ_ONLY;
exports.SQL_DEFAULT_TXN_ISOLATION = dba.SQL_DEFAULT_TXN_ISOLATION;
exports.SQL_MULTIPLE_ACTIVE_TXN = dba.SQL_MULTIPLE_ACTIVE_TXN;
exports.SQL_QUALIFIER_NAME_SEPARATOR = dba.SQL_QUALIFIER_NAME_SEPARATOR;
exports.SQL_CORRELATION_NAME = dba.SQL_CORRELATION_NAME;
exports.SQL_NON_NULLABLE_COLUMNS = dba.SQL_NON_NULLABLE_COLUMNS;
exports.SQL_DRIVER_ODBC_VER = dba.SQL_DRIVER_ODBC_VER;
exports.SQL_GROUP_BY = dba.SQL_GROUP_BY;
exports.SQL_ORDER_BY_COLUMNS_IN_SELECT = dba.SQL_ORDER_BY_COLUMNS_IN_SELECT;
exports.SQL_OWNER_USAGE = dba.SQL_OWNER_USAGE;
exports.SQL_QUALIFIER_USAGE = dba.SQL_QUALIFIER_USAGE;
exports.SQL_QUOTED_IDENTIFIER_CASE = dba.SQL_QUOTED_IDENTIFIER_CASE;
exports.SQL_MAX_ROW_SIZE = dba.SQL_MAX_ROW_SIZE;
exports.SQL_QUALIFIER_LOCATION = dba.SQL_QUALIFIER_LOCATION;
exports.SQL_MAX_CATALOG_NAME_LEN = dba.SQL_MAX_CATALOG_NAME_LEN;
exports.SQL_MAX_STATEMENT_LEN = dba.SQL_MAX_STATEMENT_LEN;
exports.SQL_SEARCH_PATTERN_ESCAPE = dba.SQL_SEARCH_PATTERN_ESCAPE;
exports.SQL_OUTER_JOINS = dba.SQL_OUTER_JOINS;
exports.SQL_LIKE_ESCAPE_CLAUSE = dba.SQL_LIKE_ESCAPE_CLAUSE;
exports.SQL_CATALOG_NAME = dba.SQL_CATALOG_NAME;
exports.SQL_DESCRIBE_PARAMETER = dba.SQL_DESCRIBE_PARAMETER;
exports.SQL_STRING_FUNCTIONS = dba.SQL_STRING_FUNCTIONS;
exports.SQL_NUMERIC_FUNCTIONS = dba.SQL_NUMERIC_FUNCTIONS;
exports.SQL_CONVERT_FUNCTIONS = dba.SQL_CONVERT_FUNCTIONS;
exports.SQL_TIMEDATE_FUNCTIONS = dba.SQL_TIMEDATE_FUNCTIONS;
exports.SQL_SQL92_PREDICATES = dba.SQL_SQL92_PREDICATES;
exports.SQL_SQL92_VALUE_EXPRESSIONS = dba.SQL_SQL92_VALUE_EXPRESSIONS;
exports.SQL_AGGREGATE_FUNCTIONS = dba.SQL_AGGREGATE_FUNCTIONS;
exports.SQL_SQL_CONFORMANCE = dba.SQL_SQL_CONFORMANCE;
exports.SQL_CONVERT_CHAR = dba.SQL_CONVERT_CHAR;
exports.SQL_CONVERT_NUMERIC = dba.SQL_CONVERT_NUMERIC;
exports.SQL_CONVERT_DECIMAL = dba.SQL_CONVERT_DECIMAL;
exports.SQL_CONVERT_INTEGER = dba.SQL_CONVERT_INTEGER;
exports.SQL_CONVERT_SMALLINT = dba.SQL_CONVERT_SMALLINT;
exports.SQL_CONVERT_FLOAT = dba.SQL_CONVERT_FLOAT;
exports.SQL_CONVERT_REAL = dba.SQL_CONVERT_REAL;
exports.SQL_CONVERT_DOUBLE = dba.SQL_CONVERT_DOUBLE;
exports.SQL_CONVERT_VARCHAR = dba.SQL_CONVERT_VARCHAR;
exports.SQL_CONVERT_LONGVARCHAR = dba.SQL_CONVERT_LONGVARCHAR;
exports.SQL_CONVERT_BINARY = dba.SQL_CONVERT_BINARY;
exports.SQL_CONVERT_VARBINARY = dba.SQL_CONVERT_VARBINARY;
exports.SQL_CONVERT_BIT = dba.SQL_CONVERT_BIT;
exports.SQL_CONVERT_TINYINT = dba.SQL_CONVERT_TINYINT;
exports.SQL_CONVERT_BIGINT = dba.SQL_CONVERT_BIGINT;
exports.SQL_CONVERT_DATE = dba.SQL_CONVERT_DATE;
exports.SQL_CONVERT_TIME = dba.SQL_CONVERT_TIME;
exports.SQL_CONVERT_TIMESTAMP = dba.SQL_CONVERT_TIMESTAMP;
exports.SQL_CONVERT_LONGVARBINARY = dba.SQL_CONVERT_LONGVARBINARY;
exports.SQL_CONVERT_INTERVAL_YEAR_MONTH = dba.SQL_CONVERT_INTERVAL_YEAR_MONTH;
exports.SQL_CONVERT_INTERVAL_DAY_TIME = dba.SQL_CONVERT_INTERVAL_DAY_TIME;
exports.SQL_CONVERT_WCHAR = dba.SQL_CONVERT_WCHAR;
exports.SQL_CONVERT_WLONGVARCHAR = dba.SQL_CONVERT_WLONGVARCHAR;
exports.SQL_CONVERT_WVARCHAR = dba.SQL_CONVERT_WVARCHAR;
exports.SQL_CONVERT_BLOB = dba.SQL_CONVERT_BLOB;
exports.SQL_CONVERT_CLOB = dba.SQL_CONVERT_CLOB;
exports.SQL_CONVERT_DBCLOB = dba.SQL_CONVERT_DBCLOB;
exports.SQL_CURSOR_COMMIT_BEHAVIOR = dba.SQL_CURSOR_COMMIT_BEHAVIOR;
exports.SQL_CURSOR_ROLLBACK_BEHAVIOR = dba.SQL_CURSOR_ROLLBACK_BEHAVIOR;
exports.SQL_POSITIONED_STATEMENTS = dba.SQL_POSITIONED_STATEMENTS;
exports.SQL_KEYWORDS = dba.SQL_KEYWORDS;
exports.SQL_CONNECTION_JOB_NAME = dba.SQL_CONNECTION_JOB_NAME;
exports.SQL_USER_NAME = dba.SQL_USER_NAME;
exports.SQL_DATABASE_NAME = dba.SQL_DATABASE_NAME;
exports.SQL_CONVERT_DECFLOAT7 = dba.SQL_CONVERT_DECFLOAT7;
exports.SQL_CONVERT_DECFLOAT16 = dba.SQL_CONVERT_DECFLOAT16;
exports.SQL_CONVERT_DECFLOAT34 = dba.SQL_CONVERT_DECFLOAT34;
exports.SQL_LOCK_TYPES = dba.SQL_LOCK_TYPES;
exports.SQL_POS_OPERATIONS = dba.SQL_POS_OPERATIONS;

exports.SQL_CB_DELETE = dba.SQL_CB_DELETE;
exports.SQL_CB_CLOSE = dba.SQL_CB_CLOSE;
exports.SQL_CB_PRESERVE = dba.SQL_CB_PRESERVE;

exports.SQL_SCHEMA_TERM = dba.SQL_SCHEMA_TERM;
exports.SQL_SCHEMA_USAGE = dba.SQL_SCHEMA_USAGE;
exports.SQL_CATALOG_LOCATION = dba.SQL_CATALOG_LOCATION;
exports.SQL_CATALOG_TERM = dba.SQL_CATALOG_TERM;
exports.SQL_CATALOG_USAGE = dba.SQL_CATALOG_USAGE;
exports.SQL_CATALOG_NAME_SEPARATOR = dba.SQL_CATALOG_NAME_SEPARATOR;
exports.SQL_OAC_NONE = dba.SQL_OAC_NONE;
exports.SQL_OAC_LEVEL1 = dba.SQL_OAC_LEVEL1;
exports.SQL_OAC_LEVEL2 = dba.SQL_OAC_LEVEL2;

exports.SQL_OSC_MINIMUM = dba.SQL_OSC_MINIMUM;
exports.SQL_OSC_CORE = dba.SQL_OSC_CORE;
exports.SQL_OSC_EXTENDED = dba.SQL_OSC_EXTENDED;

exports.SQL_QU_NOT_SUPPORTED = dba.SQL_QU_NOT_SUPPORTED;
exports.SQL_QU_DML_STATEMENTS = dba.SQL_QU_DML_STATEMENTS;
exports.SQL_QU_PROCEDURE_INVOCATION = dba.SQL_QU_PROCEDURE_INVOCATION;
exports.SQL_QU_TABLE_DEFINITION = dba.SQL_QU_TABLE_DEFINITION;
exports.SQL_QU_INDEX_DEFINITION = dba.SQL_QU_INDEX_DEFINITION;
exports.SQL_QU_PRIVILEGE_DEFINITION = dba.SQL_QU_PRIVILEGE_DEFINITION;
exports.SQL_QL_START = dba.SQL_QL_START;
exports.SQL_QL_END = dba.SQL_QL_END;

exports.SQL_OU_DML_STATEMENTS = dba.SQL_OU_DML_STATEMENTS;
exports.SQL_OU_PROCEDURE_INVOCATION = dba.SQL_OU_PROCEDURE_INVOCATION;
exports.SQL_OU_TABLE_DEFINITION = dba.SQL_OU_TABLE_DEFINITION;
exports.SQL_OU_INDEX_DEFINITION = dba.SQL_OU_INDEX_DEFINITION;
exports.SQL_OU_PRIVILEGE_DEFINITION = dba.SQL_OU_PRIVILEGE_DEFINITION;

exports.SQL_TC_NONE = dba.SQL_TC_NONE;
exports.SQL_TC_DML = dba.SQL_TC_DML;
exports.SQL_TC_ALL = dba.SQL_TC_ALL;
exports.SQL_TC_DDL_COMMIT = dba.SQL_TC_DDL_COMMIT;
exports.SQL_TC_DDL_IGNORE = dba.SQL_TC_DDL_IGNORE;
exports.SQL_TXN_READ_UNCOMMITTED_MASK = dba.SQL_TXN_READ_UNCOMMITTED_MASK;
exports.SQL_TXN_READ_COMMITTED_MASK = dba.SQL_TXN_READ_COMMITTED_MASK;
exports.SQL_TXN_REPEATABLE_READ_MASK = dba.SQL_TXN_REPEATABLE_READ_MASK;
exports.SQL_TXN_SERIALIZABLE_MASK = dba.SQL_TXN_SERIALIZABLE_MASK;

exports.SQL_FN_STR_CONCAT = dba.SQL_FN_STR_CONCAT;
exports.SQL_FN_STR_UCASE = dba.SQL_FN_STR_UCASE;
exports.SQL_FN_STR_LCASE = dba.SQL_FN_STR_LCASE;
exports.SQL_FN_STR_SUBSTRING = dba.SQL_FN_STR_SUBSTRING;
exports.SQL_FN_STR_LENGTH = dba.SQL_FN_STR_LENGTH;
exports.SQL_FN_STR_POSITION = dba.SQL_FN_STR_POSITION;
exports.SQL_FN_STR_LTRIM = dba.SQL_FN_STR_LTRIM;
exports.SQL_FN_STR_RTRIM = dba.SQL_FN_STR_RTRIM;
exports.SQL_POS_POSITION = dba.SQL_POS_POSITION;
exports.SQL_POS_REFRESH = dba.SQL_POS_REFRESH;
exports.SQL_POS_UPDATE = dba.SQL_POS_UPDATE;
exports.SQL_POS_DELETE = dba.SQL_POS_DELETE;
exports.SQL_POS_ADD = dba.SQL_POS_ADD;

exports.SQL_FN_NUM_ABS = dba.SQL_FN_NUM_ABS;
exports.SQL_FN_NUM_ACOS = dba.SQL_FN_NUM_ACOS;
exports.SQL_FN_NUM_ASIN = dba.SQL_FN_NUM_ASIN;
exports.SQL_FN_NUM_ATAN = dba.SQL_FN_NUM_ATAN;
exports.SQL_FN_NUM_ATAN2 = dba.SQL_FN_NUM_ATAN2;
exports.SQL_FN_NUM_CEILING = dba.SQL_FN_NUM_CEILING;
exports.SQL_FN_NUM_COS = dba.SQL_FN_NUM_COS;
exports.SQL_FN_NUM_COT = dba.SQL_FN_NUM_COT;
exports.SQL_FN_NUM_EXP = dba.SQL_FN_NUM_EXP;
exports.SQL_FN_NUM_FLOOR = dba.SQL_FN_NUM_FLOOR;
exports.SQL_FN_NUM_LOG = dba.SQL_FN_NUM_LOG;
exports.SQL_FN_NUM_MOD = dba.SQL_FN_NUM_MOD;
exports.SQL_FN_NUM_SIGN = dba.SQL_FN_NUM_SIGN;
exports.SQL_FN_NUM_SIN = dba.SQL_FN_NUM_SIN;
exports.SQL_FN_NUM_SQRT = dba.SQL_FN_NUM_SQRT;
exports.SQL_FN_NUM_TAN = dba.SQL_FN_NUM_TAN;
exports.SQL_FN_NUM_PI = dba.SQL_FN_NUM_PI;
exports.SQL_FN_NUM_RAND = dba.SQL_FN_NUM_RAND;
exports.SQL_FN_NUM_DEGREES = dba.SQL_FN_NUM_DEGREES;
exports.SQL_FN_NUM_LOG10 = dba.SQL_FN_NUM_LOG10;
exports.SQL_FN_NUM_POWER = dba.SQL_FN_NUM_POWER;
exports.SQL_FN_NUM_RADIANS = dba.SQL_FN_NUM_RADIANS;
exports.SQL_FN_NUM_ROUND = dba.SQL_FN_NUM_ROUND;
exports.SQL_FN_NUM_TRUNCATE = dba.SQL_FN_NUM_TRUNCATE;

exports.SQL_SVE_CASE = dba.SQL_SVE_CASE;
exports.SQL_SVE_CAST = dba.SQL_SVE_CAST;
exports.SQL_SVE_COALESCE = dba.SQL_SVE_COALESCE;
exports.SQL_SVE_NULLIF = dba.SQL_SVE_NULLIF;

exports.SQL_SP_EXISTS = dba.SQL_SP_EXISTS;
exports.SQL_SP_ISNOTNULL = dba.SQL_SP_ISNOTNULL;
exports.SQL_SP_ISNULL = dba.SQL_SP_ISNULL;
exports.SQL_SP_MATCH_FULL = dba.SQL_SP_MATCH_FULL;
exports.SQL_SP_MATCH_PARTIAL = dba.SQL_SP_MATCH_PARTIAL;
exports.SQL_SP_MATCH_UNIQUE_FULL = dba.SQL_SP_MATCH_UNIQUE_FULL;
exports.SQL_SP_MATCH_UNIQUE_PARTIAL = dba.SQL_SP_MATCH_UNIQUE_PARTIAL;
exports.SQL_SP_OVERLAPS = dba.SQL_SP_OVERLAPS;
exports.SQL_SP_UNIQUE = dba.SQL_SP_UNIQUE;
exports.SQL_SP_LIKE = dba.SQL_SP_LIKE;
exports.SQL_SP_IN = dba.SQL_SP_IN;
exports.SQL_SP_BETWEEN = dba.SQL_SP_BETWEEN;
exports.SQL_SP_COMPARISON = dba.SQL_SP_COMPARISON;
exports.SQL_SP_QUANTIFIED_COMPARISON = dba.SQL_SP_QUANTIFIED_COMPARISON;

exports.SQL_AF_AVG = dba.SQL_AF_AVG;
exports.SQL_AF_COUNT = dba.SQL_AF_COUNT;
exports.SQL_AF_MAX = dba.SQL_AF_MAX;
exports.SQL_AF_MIN = dba.SQL_AF_MIN;
exports.SQL_AF_SUM = dba.SQL_AF_SUM;
exports.SQL_AF_DISTINCT = dba.SQL_AF_DISTINCT;
exports.SQL_AF_ALL = dba.SQL_AF_ALL;

exports.SQL_SC_SQL92_ENTRY = dba.SQL_SC_SQL92_ENTRY;
exports.SQL_SC_FIPS127_2_TRANSITIONAL = dba.SQL_SC_FIPS127_2_TRANSITIONAL;
exports.SQL_SC_SQL92_INTERMEDIATE = dba.SQL_SC_SQL92_INTERMEDIATE;
exports.SQL_SC_SQL92_FULL = dba.SQL_SC_SQL92_FULL;

exports.SQL_FN_CVT_CONVERT = dba.SQL_FN_CVT_CONVERT;
exports.SQL_FN_CVT_CAST = dba.SQL_FN_CVT_CAST;

exports.SQL_PS_POSITIONED_DELETE = dba.SQL_PS_POSITIONED_DELETE;
exports.SQL_PS_POSITIONED_UPDATE = dba.SQL_PS_POSITIONED_UPDATE;
exports.SQL_PS_SELECT_FOR_UPDATE = dba.SQL_PS_SELECT_FOR_UPDATE;

exports.SQL_CVT_CHAR = dba.SQL_CVT_CHAR;
exports.SQL_CVT_NUMERIC = dba.SQL_CVT_NUMERIC;
exports.SQL_CVT_DECIMAL = dba.SQL_CVT_DECIMAL;
exports.SQL_CVT_INTEGER = dba.SQL_CVT_INTEGER;
exports.SQL_CVT_SMALLINT = dba.SQL_CVT_SMALLINT;
exports.SQL_CVT_FLOAT = dba.SQL_CVT_FLOAT;
exports.SQL_CVT_REAL = dba.SQL_CVT_REAL;
exports.SQL_CVT_DOUBLE = dba.SQL_CVT_DOUBLE;
exports.SQL_CVT_VARCHAR = dba.SQL_CVT_VARCHAR;
exports.SQL_CVT_LONGVARCHAR = dba.SQL_CVT_LONGVARCHAR;
exports.SQL_CVT_BINARY = dba.SQL_CVT_BINARY;
exports.SQL_CVT_VARBINARY = dba.SQL_CVT_VARBINARY;
exports.SQL_CVT_BIT = dba.SQL_CVT_BIT;
exports.SQL_CVT_TINYINT = dba.SQL_CVT_TINYINT;
exports.SQL_CVT_BIGINT = dba.SQL_CVT_BIGINT;
exports.SQL_CVT_DATE = dba.SQL_CVT_DATE;
exports.SQL_CVT_TIME = dba.SQL_CVT_TIME;
exports.SQL_CVT_TIMESTAMP = dba.SQL_CVT_TIMESTAMP;
exports.SQL_CVT_LONGVARBINARY = dba.SQL_CVT_LONGVARBINARY;
exports.SQL_CVT_INTERVAL_YEAR_MONTH = dba.SQL_CVT_INTERVAL_YEAR_MONTH;
exports.SQL_CVT_INTERVAL_DAY_TIME = dba.SQL_CVT_INTERVAL_DAY_TIME;
exports.SQL_CVT_WCHAR = dba.SQL_CVT_WCHAR;
exports.SQL_CVT_WLONGVARCHAR = dba.SQL_CVT_WLONGVARCHAR;
exports.SQL_CVT_WVARCHAR = dba.SQL_CVT_WVARCHAR;
exports.SQL_CVT_BLOB = dba.SQL_CVT_BLOB;
exports.SQL_CVT_CLOB = dba.SQL_CVT_CLOB;
exports.SQL_CVT_DBCLOB = dba.SQL_CVT_DBCLOB;
exports.SQL_CVT_DECFLOAT7 = dba.SQL_CVT_DECFLOAT7;
exports.SQL_CVT_DECFLOAT16 = dba.SQL_CVT_DECFLOAT16;
exports.SQL_CVT_DECFLOAT34 = dba.SQL_CVT_DECFLOAT34;

exports.SQL_FN_TD_NOW = dba.SQL_FN_TD_NOW;
exports.SQL_FN_TD_CURDATE = dba.SQL_FN_TD_CURDATE;
exports.SQL_FN_TD_DAYOFMONTH = dba.SQL_FN_TD_DAYOFMONTH;
exports.SQL_FN_TD_DAYOFWEEK = dba.SQL_FN_TD_DAYOFWEEK;
exports.SQL_FN_TD_DAYOFYEAR = dba.SQL_FN_TD_DAYOFYEAR;
exports.SQL_FN_TD_MONTH = dba.SQL_FN_TD_MONTH;
exports.SQL_FN_TD_QUARTER = dba.SQL_FN_TD_QUARTER;
exports.SQL_FN_TD_WEEK = dba.SQL_FN_TD_WEEK;
exports.SQL_FN_TD_YEAR = dba.SQL_FN_TD_YEAR;
exports.SQL_FN_TD_CURTIME = dba.SQL_FN_TD_CURTIME;
exports.SQL_FN_TD_HOUR = dba.SQL_FN_TD_HOUR;
exports.SQL_FN_TD_MINUTE = dba.SQL_FN_TD_MINUTE;
exports.SQL_FN_TD_SECOND = dba.SQL_FN_TD_SECOND;
exports.SQL_FN_TD_TIMESTAMPADD = dba.SQL_FN_TD_TIMESTAMPADD;
exports.SQL_FN_TD_TIMESTAMPDIFF = dba.SQL_FN_TD_TIMESTAMPDIFF;
exports.SQL_FN_TD_DAYNAME = dba.SQL_FN_TD_DAYNAME;
exports.SQL_FN_TD_MONTHNAME = dba.SQL_FN_TD_MONTHNAME;
exports.SQL_FN_TD_CURRENT_DATE = dba.SQL_FN_TD_CURRENT_DATE;
exports.SQL_FN_TD_CURRENT_TIME = dba.SQL_FN_TD_CURRENT_TIME;
exports.SQL_FN_TD_CURRENT_TIMESTAMP = dba.SQL_FN_TD_CURRENT_TIMESTAMP;
exports.SQL_FN_TD_EXTRACT = dba.SQL_FN_TD_EXTRACT;

exports.SQL_CN_NONE = dba.SQL_CN_NONE;
exports.SQL_CN_DIFFERENT = dba.SQL_CN_DIFFERENT;
exports.SQL_CN_ANY = dba.SQL_CN_ANY;

exports.SQL_IC_UPPER = dba.SQL_IC_UPPER;
exports.SQL_IC_LOWER = dba.SQL_IC_LOWER;
exports.SQL_IC_SENSITIVE = dba.SQL_IC_SENSITIVE;
exports.SQL_IC_MIXED = dba.SQL_IC_MIXED;

exports.SQL_NNC_NULL = dba.SQL_NNC_NULL;
exports.SQL_NNC_NON_NULL = dba.SQL_NNC_NON_NULL;

exports.SQL_GB_NO_RELATION = dba.SQL_GB_NO_RELATION;
exports.SQL_GB_NOT_SUPPORTED = dba.SQL_GB_NOT_SUPPORTED;
exports.SQL_GB_GROUP_BY_EQUALS_SELECT = dba.SQL_GB_GROUP_BY_EQUALS_SELECT;
exports.SQL_GB_GROUP_BY_CONTAINS_SELECT = dba.SQL_GB_GROUP_BY_CONTAINS_SELECT;

exports.SQL_CHAR = dba.SQL_CHAR;
exports.SQL_NUMERIC = dba.SQL_NUMERIC;
exports.SQL_DECIMAL = dba.SQL_DECIMAL;
exports.SQL_INTEGER = dba.SQL_INTEGER;
exports.SQL_SMALLINT = dba.SQL_SMALLINT;
exports.SQL_FLOAT = dba.SQL_FLOAT;
exports.SQL_REAL = dba.SQL_REAL;
exports.SQL_DOUBLE = dba.SQL_DOUBLE;
exports.SQL_DATETIME = dba.SQL_DATETIME;
exports.SQL_VARCHAR = dba.SQL_VARCHAR;
exports.SQL_BLOB = dba.SQL_BLOB;
exports.SQL_CLOB = dba.SQL_CLOB;
exports.SQL_DBCLOB = dba.SQL_DBCLOB;
exports.SQL_DATALINK = dba.SQL_DATALINK;
exports.SQL_WCHAR = dba.SQL_WCHAR;
exports.SQL_WVARCHAR = dba.SQL_WVARCHAR;
exports.SQL_BIGINT = dba.SQL_BIGINT;
exports.SQL_BLOB_LOCATOR = dba.SQL_BLOB_LOCATOR;
exports.SQL_CLOB_LOCATOR = dba.SQL_CLOB_LOCATOR;
exports.SQL_DBCLOB_LOCATOR = dba.SQL_DBCLOB_LOCATOR;
exports.SQL_UTF8_CHAR = dba.SQL_UTF8_CHAR;
exports.SQL_WLONGVARCHAR = dba.SQL_WLONGVARCHAR;
exports.SQL_LONGVARCHAR = dba.SQL_LONGVARCHAR;
exports.SQL_GRAPHIC = dba.SQL_GRAPHIC;
exports.SQL_VARGRAPHIC = dba.SQL_VARGRAPHIC;
exports.SQL_LONGVARGRAPHIC = dba.SQL_LONGVARGRAPHIC;
exports.SQL_BINARY = dba.SQL_BINARY;
exports.SQL_VARBINARY = dba.SQL_VARBINARY;
exports.SQL_LONGVARBINARY = dba.SQL_LONGVARBINARY;
exports.SQL_DATE = dba.SQL_DATE;
exports.SQL_TYPE_DATE = dba.SQL_TYPE_DATE;
exports.SQL_TIME = dba.SQL_TIME;
exports.SQL_TYPE_TIME = dba.SQL_TYPE_TIME;
exports.SQL_TIMESTAMP = dba.SQL_TIMESTAMP;
exports.SQL_TYPE_TIMESTAMP = dba.SQL_TYPE_TIMESTAMP;
exports.SQL_CODE_DATE = dba.SQL_CODE_DATE;
exports.SQL_CODE_TIME = dba.SQL_CODE_TIME;
exports.SQL_CODE_TIMESTAMP = dba.SQL_CODE_TIMESTAMP;
exports.SQL_ALL_TYPES = dba.SQL_ALL_TYPES;
exports.SQL_DECFLOAT = dba.SQL_DECFLOAT;
exports.SQL_XML = dba.SQL_XML;

exports.SQL_UNUSED = dba.SQL_UNUSED;
exports.SQL_HANDLE_ENV = dba.SQL_HANDLE_ENV;
exports.SQL_HANDLE_DBC = dba.SQL_HANDLE_DBC;
exports.SQL_HANDLE_STMT = dba.SQL_HANDLE_STMT;
exports.SQL_HANDLE_DESC = dba.SQL_HANDLE_DESC;
exports.SQL_NULL_HANDLE = dba.SQL_NULL_HANDLE;
exports.SQL_HANDLE_DBC_UNICODE = dba.SQL_HANDLE_DBC_UNICODE;

exports.SQL_NO_NULLS = dba.SQL_NO_NULLS;
exports.SQL_NULLABLE = dba.SQL_NULLABLE;
exports.SQL_NULLABLE_UNKNOWN = dba.SQL_NULLABLE_UNKNOWN;

exports.SQL_NO_TOTAL = dba.SQL_NO_TOTAL;
exports.SQL_NULL_DATA = dba.SQL_NULL_DATA;
exports.SQL_DATA_AT_EXEC = dba.SQL_DATA_AT_EXEC;
exports.SQL_BIGINT_PREC = dba.SQL_BIGINT_PREC;
exports.SQL_INTEGER_PREC = dba.SQL_INTEGER_PREC;
exports.SQL_SMALLINT_PREC = dba.SQL_SMALLINT_PREC;

exports.SQL_DEFAULT_PARAM = dba.SQL_DEFAULT_PARAM;
exports.SQL_UNASSIGNED = dba.SQL_UNASSIGNED;

exports.SQL_ATTR_READONLY = dba.SQL_ATTR_READONLY;
exports.SQL_ATTR_WRITE = dba.SQL_ATTR_WRITE;
exports.SQL_ATTR_READWRITE_UNKNOWN = dba.SQL_ATTR_READWRITE_UNKNOWN;

exports.SQL_CONCUR_LOCK = dba.SQL_CONCUR_LOCK;
exports.SQL_CONCUR_READ_ONLY = dba.SQL_CONCUR_READ_ONLY;
exports.SQL_CONCUR_ROWVER = dba.SQL_CONCUR_ROWVER;
exports.SQL_CONCUR_VALUES = dba.SQL_CONCUR_VALUES;

exports.SQL_ATTR_OUTPUT_NTS = dba.SQL_ATTR_OUTPUT_NTS;
exports.SQL_ATTR_SYS_NAMING = dba.SQL_ATTR_SYS_NAMING;
exports.SQL_ATTR_DEFAULT_LIB = dba.SQL_ATTR_DEFAULT_LIB;
exports.SQL_ATTR_SERVER_MODE = dba.SQL_ATTR_SERVER_MODE;
exports.SQL_ATTR_JOB_SORT_SEQUENCE = dba.SQL_ATTR_JOB_SORT_SEQUENCE;
exports.SQL_ATTR_ENVHNDL_COUNTER = dba.SQL_ATTR_ENVHNDL_COUNTER;
exports.SQL_ATTR_ESCAPE_CHAR = dba.SQL_ATTR_ESCAPE_CHAR;
exports.SQL_ATTR_INCLUDE_NULL_IN_LEN = dba.SQL_ATTR_INCLUDE_NULL_IN_LEN;
exports.SQL_ATTR_UTF8 = dba.SQL_ATTR_UTF8;
exports.SQL_ATTR_SYSCAP = dba.SQL_ATTR_SYSCAP;
exports.SQL_ATTR_REQUIRE_PROFILE = dba.SQL_ATTR_REQUIRE_PROFILE;
exports.SQL_ATTR_UCS2 = dba.SQL_ATTR_UCS2;
exports.SQL_ATTR_TRUNCATION_RTNC = dba.SQL_ATTR_TRUNCATION_RTNC;

exports.SQL_ATTR_DATE_FMT = dba.SQL_ATTR_DATE_FMT;
exports.SQL_ATTR_DATE_SEP = dba.SQL_ATTR_DATE_SEP;
exports.SQL_ATTR_TIME_FMT = dba.SQL_ATTR_TIME_FMT;
exports.SQL_ATTR_TIME_SEP = dba.SQL_ATTR_TIME_SEP;
exports.SQL_ATTR_DECIMAL_SEP = dba.SQL_ATTR_DECIMAL_SEP;
exports.SQL_ATTR_TXN_INFO = dba.SQL_ATTR_TXN_INFO;
exports.SQL_ATTR_TXN_EXTERNAL = dba.SQL_ATTR_TXN_EXTERNAL;
exports.SQL_ATTR_2ND_LEVEL_TEXT = dba.SQL_ATTR_2ND_LEVEL_TEXT;
exports.SQL_ATTR_SAVEPOINT_NAME = dba.SQL_ATTR_SAVEPOINT_NAME;
exports.SQL_ATTR_TRACE = dba.SQL_ATTR_TRACE;
exports.SQL_ATTR_MAX_PRECISION = dba.SQL_ATTR_MAX_PRECISION;
exports.SQL_ATTR_MAX_SCALE = dba.SQL_ATTR_MAX_SCALE;
exports.SQL_ATTR_MIN_DIVIDE_SCALE = dba.SQL_ATTR_MIN_DIVIDE_SCALE;
exports.SQL_ATTR_HEX_LITERALS = dba.SQL_ATTR_HEX_LITERALS;
exports.SQL_ATTR_CORRELATOR = dba.SQL_ATTR_CORRELATOR;
exports.SQL_ATTR_QUERY_OPTIMIZE_GOAL = dba.SQL_ATTR_QUERY_OPTIMIZE_GOAL;
exports.SQL_ATTR_CONN_SORT_SEQUENCE = dba.SQL_ATTR_CONN_SORT_SEQUENCE;
exports.SQL_ATTR_PREFETCH = dba.SQL_ATTR_PREFETCH;
exports.SQL_ATTR_CLOSEONEOF = dba.SQL_ATTR_CLOSEONEOF;
exports.SQL_ATTR_ANSI_APP = dba.SQL_ATTR_ANSI_APP;
exports.SQL_ATTR_INFO_USERID = dba.SQL_ATTR_INFO_USERID;
exports.SQL_ATTR_INFO_WRKSTNNAME = dba.SQL_ATTR_INFO_WRKSTNNAME;
exports.SQL_ATTR_INFO_APPLNAME = dba.SQL_ATTR_INFO_APPLNAME;
exports.SQL_ATTR_INFO_ACCTSTR = dba.SQL_ATTR_INFO_ACCTSTR;
exports.SQL_ATTR_INFO_PROGRAMID = dba.SQL_ATTR_INFO_PROGRAMID;
exports.SQL_ATTR_DECFLOAT_ROUNDING_MODE = dba.SQL_ATTR_DECFLOAT_ROUNDING_MODE;
exports.SQL_ATTR_OLD_MTADTA_BEHAVIOR = dba.SQL_ATTR_OLD_MTADTA_BEHAVIOR;
exports.SQL_ATTR_NULL_REQUIRED = dba.SQL_ATTR_NULL_REQUIRED;
exports.SQL_ATTR_FREE_LOCATORS = dba.SQL_ATTR_FREE_LOCATORS;
exports.SQL_ATTR_EXTENDED_INDICATORS = dba.SQL_ATTR_EXTENDED_INDICATORS;
exports.SQL_ATTR_NULLT_ARRAY_RESULTS = dba.SQL_ATTR_NULLT_ARRAY_RESULTS;
exports.SQL_ATTR_NULLT_OUTPUT_PARMS = dba.SQL_ATTR_NULLT_OUTPUT_PARMS;
exports.SQL_ATTR_TIMESTAMP_PREC = dba.SQL_ATTR_TIMESTAMP_PREC;
exports.SQL_ATTR_CONCURRENT_ACCESS_RESOLUTION = dba.SQL_ATTR_CONCURRENT_ACCESS_RESOLUTION;
exports.SQL_CONCURRENT_ACCESS_RESOLUTION_UNSET = dba.SQL_CONCURRENT_ACCESS_RESOLUTION_UNSET;
exports.SQL_USE_CURRENTLY_COMMITTED = dba.SQL_USE_CURRENTLY_COMMITTED;
exports.SQL_WAIT_FOR_OUTCOME = dba.SQL_WAIT_FOR_OUTCOME;
exports.SQL_SKIP_LOCKED_DATA = dba.SQL_SKIP_LOCKED_DATA;

exports.SQL_TXN_FIND = dba.SQL_TXN_FIND;
exports.SQL_TXN_CREATE = dba.SQL_TXN_CREATE;
exports.SQL_TXN_RESUME = dba.SQL_TXN_RESUME;
exports.SQL_TXN_CLEAR = dba.SQL_TXN_CLEAR;
exports.SQL_TXN_END = dba.SQL_TXN_END;
exports.SQL_TXN_HOLD = dba.SQL_TXN_HOLD;
exports.SQL_TXN_END_FAIL = dba.SQL_TXN_END_FAIL;

exports.SQL_FMT_ISO = dba.SQL_FMT_ISO;
exports.SQL_FMT_USA = dba.SQL_FMT_USA;
exports.SQL_FMT_EUR = dba.SQL_FMT_EUR;
exports.SQL_FMT_JIS = dba.SQL_FMT_JIS;
exports.SQL_FMT_MDY = dba.SQL_FMT_MDY;
exports.SQL_FMT_DMY = dba.SQL_FMT_DMY;
exports.SQL_FMT_YMD = dba.SQL_FMT_YMD;
exports.SQL_FMT_JUL = dba.SQL_FMT_JUL;
exports.SQL_FMT_HMS = dba.SQL_FMT_HMS;
exports.SQL_FMT_JOB = dba.SQL_FMT_JOB;
exports.SQL_SEP_SLASH = dba.SQL_SEP_SLASH;
exports.SQL_SEP_DASH = dba.SQL_SEP_DASH;
exports.SQL_SEP_PERIOD = dba.SQL_SEP_PERIOD;
exports.SQL_SEP_COMMA = dba.SQL_SEP_COMMA;
exports.SQL_SEP_BLANK = dba.SQL_SEP_BLANK;
exports.SQL_SEP_COLON = dba.SQL_SEP_COLON;
exports.SQL_SEP_JOB = dba.SQL_SEP_JOB;
exports.SQL_HEX_IS_CHAR = dba.SQL_HEX_IS_CHAR;
exports.SQL_HEX_IS_BINARY = dba.SQL_HEX_IS_BINARY;
exports.SQL_FIRST_IO = dba.SQL_FIRST_IO;
exports.SQL_ALL_IO = dba.SQL_ALL_IO;
exports.ROUND_HALF_EVEN = dba.ROUND_HALF_EVEN;
exports.ROUND_HALF_UP = dba.ROUND_HALF_UP;
exports.ROUND_DOWN = dba.ROUND_DOWN;
exports.ROUND_CEILING = dba.ROUND_CEILING;
exports.ROUND_FLOOR = dba.ROUND_FLOOR;
exports.ROUND_HALF_DOWN = dba.ROUND_HALF_DOWN;
exports.ROUND_UP = dba.ROUND_UP;

exports.SQL_DEFAULT = dba.SQL_DEFAULT;
exports.SQL_ARD_TYPE = dba.SQL_ARD_TYPE;

exports.SQL_CASCADE = dba.SQL_CASCADE;
exports.SQL_RESTRICT = dba.SQL_RESTRICT;
exports.SQL_NO_ACTION = dba.SQL_NO_ACTION;
exports.SQL_SET_NULL = dba.SQL_SET_NULL;
exports.SQL_SET_DEFAULT = dba.SQL_SET_DEFAULT;
exports.SQL_INITIALLY_DEFERRED = dba.SQL_INITIALLY_DEFERRED;
exports.SQL_INITIALLY_IMMEDIATE = dba.SQL_INITIALLY_IMMEDIATE;
exports.SQL_NOT_DEFERRABLE = dba.SQL_NOT_DEFERRABLE;
exports.SQL_PT_UNKNOWN = dba.SQL_PT_UNKNOWN;
exports.SQL_PT_PROCEDURE = dba.SQL_PT_PROCEDURE;
exports.SQL_PT_FUNCTION = dba.SQL_PT_FUNCTION;

exports.SQL_PARAM_INPUT = dba.SQL_PARAM_INPUT;
exports.SQL_PARAM_OUTPUT = dba.SQL_PARAM_OUTPUT;
exports.SQL_PARAM_INPUT_OUTPUT = dba.SQL_PARAM_INPUT_OUTPUT;
exports.SQL_ATTR_APP_ROW_DESC = dba.SQL_ATTR_APP_ROW_DESC;
exports.SQL_ATTR_APP_PARAM_DESC = dba.SQL_ATTR_APP_PARAM_DESC;
exports.SQL_ATTR_IMP_ROW_DESC = dba.SQL_ATTR_IMP_ROW_DESC;
exports.SQL_ATTR_IMP_PARAM_DESC = dba.SQL_ATTR_IMP_PARAM_DESC;
exports.SQL_ATTR_FOR_FETCH_ONLY = dba.SQL_ATTR_FOR_FETCH_ONLY;
exports.SQL_ATTR_CONCURRENCY = dba.SQL_ATTR_CONCURRENCY;
exports.SQL_CONCURRENCY = dba.SQL_CONCURRENCY;
exports.SQL_ATTR_CURSOR_SCROLLABLE = dba.SQL_ATTR_CURSOR_SCROLLABLE;
exports.SQL_ATTR_ROWSET_SIZE = dba.SQL_ATTR_ROWSET_SIZE;
exports.SQL_ROWSET_SIZE = dba.SQL_ROWSET_SIZE;
exports.SQL_ATTR_ROW_ARRAY_SIZE = dba.SQL_ATTR_ROW_ARRAY_SIZE;
exports.SQL_ATTR_CURSOR_HOLD = dba.SQL_ATTR_CURSOR_HOLD;
exports.SQL_ATTR_FULL_OPEN = dba.SQL_ATTR_FULL_OPEN;
exports.SQL_ATTR_EXTENDED_COL_INFO = dba.SQL_ATTR_EXTENDED_COL_INFO;
exports.SQL_ATTR_BIND_TYPE = dba.SQL_ATTR_BIND_TYPE;
exports.SQL_BIND_TYPE = dba.SQL_BIND_TYPE;
exports.SQL_ATTR_CURSOR_TYPE = dba.SQL_ATTR_CURSOR_TYPE;
exports.SQL_CURSOR_TYPE = dba.SQL_CURSOR_TYPE;
exports.SQL_ATTR_CURSOR_SENSITIVITY = dba.SQL_ATTR_CURSOR_SENSITIVITY;
exports.SQL_CURSOR_SENSITIVE = dba.SQL_CURSOR_SENSITIVE;
exports.SQL_ATTR_ROW_STATUS_PTR = dba.SQL_ATTR_ROW_STATUS_PTR;
exports.SQL_ATTR_ROWS_FETCHED_PTR = dba.SQL_ATTR_ROWS_FETCHED_PTR;
exports.SQL_ATTR_ROW_BIND_TYPE = dba.SQL_ATTR_ROW_BIND_TYPE;
exports.SQL_ATTR_PARAM_BIND_TYPE = dba.SQL_ATTR_PARAM_BIND_TYPE;
exports.SQL_ATTR_PARAMSET_SIZE = dba.SQL_ATTR_PARAMSET_SIZE;
exports.SQL_ATTR_PARAM_STATUS_PTR = dba.SQL_ATTR_PARAM_STATUS_PTR;
exports.SQL_ATTR_PARAMS_PROCESSED_PTR = dba.SQL_ATTR_PARAMS_PROCESSED_PTR;
exports.SQL_ATTR_NUMBER_RESULTSET_ROWS_PTR = dba.SQL_ATTR_NUMBER_RESULTSET_ROWS_PTR;
exports.SQL_BIND_BY_ROW = dba.SQL_BIND_BY_ROW;
exports.SQL_BIND_BY_COLUMN = dba.SQL_BIND_BY_COLUMN;
exports.SQL_CURSOR_FORWARD_ONLY = dba.SQL_CURSOR_FORWARD_ONLY;
exports.SQL_CURSOR_STATIC = dba.SQL_CURSOR_STATIC;
exports.SQL_CURSOR_DYNAMIC = dba.SQL_CURSOR_DYNAMIC;
exports.SQL_CURSOR_KEYSET_DRIVEN = dba.SQL_CURSOR_KEYSET_DRIVEN;
exports.SQL_UNSPECIFIED = dba.SQL_UNSPECIFIED;
exports.SQL_INSENSITIVE = dba.SQL_INSENSITIVE;
exports.SQL_SENSITIVE = dba.SQL_SENSITIVE;
exports.SQL_FETCH_NEXT = dba.SQL_FETCH_NEXT;
exports.SQL_FETCH_FIRST = dba.SQL_FETCH_FIRST;
exports.SQL_FETCH_LAST = dba.SQL_FETCH_LAST;
exports.SQL_FETCH_PRIOR = dba.SQL_FETCH_PRIOR;
exports.SQL_FETCH_ABSOLUTE = dba.SQL_FETCH_ABSOLUTE;
exports.SQL_FETCH_RELATIVE = dba.SQL_FETCH_RELATIVE;
exports.SQL_DESC_COUNT = dba.SQL_DESC_COUNT;
exports.SQL_DESC_TYPE = dba.SQL_DESC_TYPE;
exports.SQL_DESC_LENGTH = dba.SQL_DESC_LENGTH;
exports.SQL_DESC_LENGTH_PTR = dba.SQL_DESC_LENGTH_PTR;
exports.SQL_DESC_PRECISION = dba.SQL_DESC_PRECISION;
exports.SQL_DESC_SCALE = dba.SQL_DESC_SCALE;
exports.SQL_DESC_DATETIME_INTERVAL_CODE = dba.SQL_DESC_DATETIME_INTERVAL_CODE;
exports.SQL_DESC_NULLABLE = dba.SQL_DESC_NULLABLE;
exports.SQL_DESC_INDICATOR_PTR = dba.SQL_DESC_INDICATOR_PTR;
exports.SQL_DESC_DATA_PTR = dba.SQL_DESC_DATA_PTR;
exports.SQL_DESC_NAME = dba.SQL_DESC_NAME;
exports.SQL_DESC_UNNAMED = dba.SQL_DESC_UNNAMED;
exports.SQL_DESC_DISPLAY_SIZE = dba.SQL_DESC_DISPLAY_SIZE;
exports.SQL_DESC_AUTO_INCREMENT = dba.SQL_DESC_AUTO_INCREMENT;
exports.SQL_DESC_SEARCHABLE = dba.SQL_DESC_SEARCHABLE;
exports.SQL_DESC_UPDATABLE = dba.SQL_DESC_UPDATABLE;
exports.SQL_DESC_BASE_COLUMN = dba.SQL_DESC_BASE_COLUMN;
exports.SQL_DESC_BASE_TABLE = dba.SQL_DESC_BASE_TABLE;
exports.SQL_DESC_BASE_SCHEMA = dba.SQL_DESC_BASE_SCHEMA;
exports.SQL_DESC_LABEL = dba.SQL_DESC_LABEL;
exports.SQL_DESC_MONEY = dba.SQL_DESC_MONEY;
exports.SQL_DESC_TYPE_NAME = dba.SQL_DESC_TYPE_NAME;
exports.SQL_DESC_COLUMN_CCSID = dba.SQL_DESC_COLUMN_CCSID;
exports.SQL_DESC_ALLOC_TYPE = dba.SQL_DESC_ALLOC_TYPE;
exports.SQL_DESC_ALLOC_AUTO = dba.SQL_DESC_ALLOC_AUTO;
exports.SQL_DESC_ALLOC_USER = dba.SQL_DESC_ALLOC_USER;
exports.SQL_COLUMN_COUNT = dba.SQL_COLUMN_COUNT;
exports.SQL_COLUMN_TYPE = dba.SQL_COLUMN_TYPE;
exports.SQL_COLUMN_LENGTH = dba.SQL_COLUMN_LENGTH;
exports.SQL_COLUMN_LENGTH_PTR = dba.SQL_COLUMN_LENGTH_PTR;
exports.SQL_COLUMN_PRECISION = dba.SQL_COLUMN_PRECISION;
exports.SQL_COLUMN_SCALE = dba.SQL_COLUMN_SCALE;
exports.SQL_COLUMN_DATETIME_INTERVAL_CODE = dba.SQL_COLUMN_DATETIME_INTERVAL_CODE;
exports.SQL_COLUMN_NULLABLE = dba.SQL_COLUMN_NULLABLE;
exports.SQL_COLUMN_INDICATOR_PTR = dba.SQL_COLUMN_INDICATOR_PTR;
exports.SQL_COLUMN_DATA_PTR = dba.SQL_COLUMN_DATA_PTR;
exports.SQL_COLUMN_NAME = dba.SQL_COLUMN_NAME;
exports.SQL_COLUMN_UNNAMED = dba.SQL_COLUMN_UNNAMED;
exports.SQL_COLUMN_DISPLAY_SIZE = dba.SQL_COLUMN_DISPLAY_SIZE;
exports.SQL_COLUMN_AUTO_INCREMENT = dba.SQL_COLUMN_AUTO_INCREMENT;
exports.SQL_COLUMN_SEARCHABLE = dba.SQL_COLUMN_SEARCHABLE;
exports.SQL_COLUMN_UPDATABLE = dba.SQL_COLUMN_UPDATABLE;
exports.SQL_COLUMN_BASE_COLUMN = dba.SQL_COLUMN_BASE_COLUMN;
exports.SQL_COLUMN_BASE_TABLE = dba.SQL_COLUMN_BASE_TABLE;
exports.SQL_COLUMN_BASE_SCHEMA = dba.SQL_COLUMN_BASE_SCHEMA;
exports.SQL_COLUMN_LABEL = dba.SQL_COLUMN_LABEL;
exports.SQL_COLUMN_MONEY = dba.SQL_COLUMN_MONEY;
exports.SQL_COLUMN_ALLOC_TYPE = dba.SQL_COLUMN_ALLOC_TYPE;
exports.SQL_COLUMN_ALLOC_AUTO = dba.SQL_COLUMN_ALLOC_AUTO;
exports.SQL_COLUMN_ALLOC_USER = dba.SQL_COLUMN_ALLOC_USER;

exports.SQL_SCOPE_CURROW = dba.SQL_SCOPE_CURROW;
exports.SQL_SCOPE_TRANSACTION = dba.SQL_SCOPE_TRANSACTION;
exports.SQL_SCOPE_SESSION = dba.SQL_SCOPE_SESSION;
exports.SQL_PC_UNKNOWN = dba.SQL_PC_UNKNOWN;
exports.SQL_PC_NOT_PSEUDO = dba.SQL_PC_NOT_PSEUDO;
exports.SQL_PC_PSEUDO = dba.SQL_PC_PSEUDO;

exports.SQL_ATTR_AUTO_IPD = dba.SQL_ATTR_AUTO_IPD;
exports.SQL_ATTR_ACCESS_MODE = dba.SQL_ATTR_ACCESS_MODE;
exports.SQL_ACCESS_MODE = dba.SQL_ACCESS_MODE;
exports.SQL_ATTR_AUTOCOMMIT = dba.SQL_ATTR_AUTOCOMMIT;
exports.SQL_AUTOCOMMIT = dba.SQL_AUTOCOMMIT;
exports.SQL_ATTR_DBC_SYS_NAMING = dba.SQL_ATTR_DBC_SYS_NAMING;
exports.SQL_ATTR_DBC_DEFAULT_LIB = dba.SQL_ATTR_DBC_DEFAULT_LIB;
exports.SQL_ATTR_ADOPT_OWNER_AUTH = dba.SQL_ATTR_ADOPT_OWNER_AUTH;
exports.SQL_ATTR_SYSBAS_CMT = dba.SQL_ATTR_SYSBAS_CMT;
exports.SQL_ATTR_SET_SSA = dba.SQL_ATTR_SET_SSA;
exports.SQL_HEX_SORT_SEQUENCE = dba.SQL_HEX_SORT_SEQUENCE;
exports.SQL_JOB_SORT_SEQUENCE = dba.SQL_JOB_SORT_SEQUENCE;
exports.SQL_JOBRUN_SORT_SEQUENCE = dba.SQL_JOBRUN_SORT_SEQUENCE;
exports.SQL_ATTR_COMMIT = dba.SQL_ATTR_COMMIT;
exports.SQL_MODE_READ_ONLY = dba.SQL_MODE_READ_ONLY;
exports.SQL_MODE_READ_WRITE = dba.SQL_MODE_READ_WRITE;
exports.SQL_MODE_DEFAULT = dba.SQL_MODE_DEFAULT;
exports.SQL_AUTOCOMMIT_OFF = dba.SQL_AUTOCOMMIT_OFF;
exports.SQL_AUTOCOMMIT_ON = dba.SQL_AUTOCOMMIT_ON;
exports.SQL_TXN_ISOLATION = dba.SQL_TXN_ISOLATION;
exports.SQL_ATTR_TXN_ISOLATION = dba.SQL_ATTR_TXN_ISOLATION;
exports.SQL_COMMIT_NONE = dba.SQL_COMMIT_NONE;
exports.SQL_TXN_NO_COMMIT = dba.SQL_TXN_NO_COMMIT;
exports.SQL_TXN_NOCOMMIT = dba.SQL_TXN_NOCOMMIT;
exports.SQL_COMMIT_CHG = dba.SQL_COMMIT_CHG;
exports.SQL_COMMIT_UR = dba.SQL_COMMIT_UR;
exports.SQL_TXN_READ_UNCOMMITTED = dba.SQL_TXN_READ_UNCOMMITTED;
exports.SQL_COMMIT_CS = dba.SQL_COMMIT_CS;
exports.SQL_TXN_READ_COMMITTED = dba.SQL_TXN_READ_COMMITTED;
exports.SQL_COMMIT_ALL = dba.SQL_COMMIT_ALL;
exports.SQL_COMMIT_RS = dba.SQL_COMMIT_RS;
exports.SQL_TXN_REPEATABLE_READ = dba.SQL_TXN_REPEATABLE_READ;
exports.SQL_COMMIT_RR = dba.SQL_COMMIT_RR;
exports.SQL_TXN_SERIALIZABLE = dba.SQL_TXN_SERIALIZABLE;

exports.SQL_INDEX_UNIQUE = dba.SQL_INDEX_UNIQUE;
exports.SQL_INDEX_ALL = dba.SQL_INDEX_ALL;
exports.SQL_INDEX_OTHER = dba.SQL_INDEX_OTHER;
exports.SQL_TABLE_STAT = dba.SQL_TABLE_STAT;
exports.SQL_ENSURE = dba.SQL_ENSURE;
exports.SQL_QUICK = dba.SQL_QUICK;

exports.SQL_ATTR_TRACE_CLI = dba.SQL_ATTR_TRACE_CLI;
exports.SQL_ATTR_TRACE_DBMON = dba.SQL_ATTR_TRACE_DBMON;
exports.SQL_ATTR_TRACE_DEBUG = dba.SQL_ATTR_TRACE_DEBUG;
exports.SQL_ATTR_TRACE_JOBLOG = dba.SQL_ATTR_TRACE_JOBLOG;
exports.SQL_ATTR_TRACE_STRTRC = dba.SQL_ATTR_TRACE_STRTRC;

exports.SQL_FILE_READ = dba.SQL_FILE_READ;
exports.SQL_FILE_CREATE = dba.SQL_FILE_CREATE;
exports.SQL_FILE_OVERWRITE = dba.SQL_FILE_OVERWRITE;
exports.SQL_FILE_APPEND = dba.SQL_FILE_APPEND;

exports.SQL_DIAG_RETURNCODE = dba.SQL_DIAG_RETURNCODE;
exports.SQL_DIAG_NUMBER = dba.SQL_DIAG_NUMBER;
exports.SQL_DIAG_ROW_COUNT = dba.SQL_DIAG_ROW_COUNT;
exports.SQL_DIAG_SQLSTATE = dba.SQL_DIAG_SQLSTATE;
exports.SQL_DIAG_NATIVE = dba.SQL_DIAG_NATIVE;
exports.SQL_DIAG_MESSAGE_TEXT = dba.SQL_DIAG_MESSAGE_TEXT;
exports.SQL_DIAG_DYNAMIC_FUNCTION = dba.SQL_DIAG_DYNAMIC_FUNCTION;
exports.SQL_DIAG_CLASS_ORIGIN = dba.SQL_DIAG_CLASS_ORIGIN;
exports.SQL_DIAG_SUBCLASS_ORIGIN = dba.SQL_DIAG_SUBCLASS_ORIGIN;
exports.SQL_DIAG_CONNECTION_NAME = dba.SQL_DIAG_CONNECTION_NAME;
exports.SQL_DIAG_SERVER_NAME = dba.SQL_DIAG_SERVER_NAME;
exports.SQL_DIAG_MESSAGE_TOKENS = dba.SQL_DIAG_MESSAGE_TOKENS;
exports.SQL_DIAG_AUTOGEN_KEY = dba.SQL_DIAG_AUTOGEN_KEY;
exports.SQL_UNSEARCHABLE = dba.SQL_UNSEARCHABLE;
exports.SQL_LIKE_ONLY = dba.SQL_LIKE_ONLY;
exports.SQL_ALL_EXCEPT_LIKE = dba.SQL_ALL_EXCEPT_LIKE;
exports.SQL_SEARCHABLE = dba.SQL_SEARCHABLE;

exports.SQL_API_SQLALLOCCONNECT = dba.SQL_API_SQLALLOCCONNECT;
exports.SQL_API_SQLALLOCENV = dba.SQL_API_SQLALLOCENV;
exports.SQL_API_SQLALLOCHANDLE = dba.SQL_API_SQLALLOCHANDLE;
exports.SQL_API_SQLALLOCSTMT = dba.SQL_API_SQLALLOCSTMT;
exports.SQL_API_SQLBINDCOL = dba.SQL_API_SQLBINDCOL;
exports.SQL_API_SQLBINDFILETOCOL = dba.SQL_API_SQLBINDFILETOCOL;
exports.SQL_API_SQLBINDFILETOPARAM = dba.SQL_API_SQLBINDFILETOPARAM;
exports.SQL_API_SQLBINDPARAM = dba.SQL_API_SQLBINDPARAM;
exports.SQL_API_SQLBINDPARAMETER = dba.SQL_API_SQLBINDPARAMETER;
exports.SQL_API_SQLCANCEL = dba.SQL_API_SQLCANCEL;
exports.SQL_API_SQLCLOSECURSOR = dba.SQL_API_SQLCLOSECURSOR;
exports.SQL_API_SQLCOLATTRIBUTE = dba.SQL_API_SQLCOLATTRIBUTE;
exports.SQL_API_SQLCOLATTRIBUTEW = dba.SQL_API_SQLCOLATTRIBUTEW;
exports.SQL_API_SQLCOLATTRIBUTES = dba.SQL_API_SQLCOLATTRIBUTES;
exports.SQL_API_SQLCOLATTRIBUTESW = dba.SQL_API_SQLCOLATTRIBUTESW;
exports.SQL_API_SQLCOLUMNPRIVILEGES = dba.SQL_API_SQLCOLUMNPRIVILEGES;
exports.SQL_API_SQLCOLUMNPRIVILEGESW = dba.SQL_API_SQLCOLUMNPRIVILEGESW;
exports.SQL_API_SQLCOLUMNS = dba.SQL_API_SQLCOLUMNS;
exports.SQL_API_SQLCOLUMNSW = dba.SQL_API_SQLCOLUMNSW;
exports.SQL_API_SQLCONNECT = dba.SQL_API_SQLCONNECT;
exports.SQL_API_SQLCONNECTW = dba.SQL_API_SQLCONNECTW;
exports.SQL_API_SQLCOPYDESC = dba.SQL_API_SQLCOPYDESC;
exports.SQL_API_SQLDATASOURCES = dba.SQL_API_SQLDATASOURCES;
exports.SQL_API_SQLDATASOURCESW = dba.SQL_API_SQLDATASOURCESW;
exports.SQL_API_SQLDESCRIBECOL = dba.SQL_API_SQLDESCRIBECOL;
exports.SQL_API_SQLDESCRIBECOLW = dba.SQL_API_SQLDESCRIBECOLW;
exports.SQL_API_SQLDESCRIBEPARAM = dba.SQL_API_SQLDESCRIBEPARAM;
exports.SQL_API_SQLDISCONNECT = dba.SQL_API_SQLDISCONNECT;
exports.SQL_API_SQLDRIVERCONNECT = dba.SQL_API_SQLDRIVERCONNECT;
exports.SQL_API_SQLENDTRAN = dba.SQL_API_SQLENDTRAN;
exports.SQL_API_SQLERROR = dba.SQL_API_SQLERROR;
exports.SQL_API_SQLERRORW = dba.SQL_API_SQLERRORW;
exports.SQL_API_SQLEXECDIRECT = dba.SQL_API_SQLEXECDIRECT;
exports.SQL_API_SQLEXECDIRECTW = dba.SQL_API_SQLEXECDIRECTW;
exports.SQL_API_SQLEXECUTE = dba.SQL_API_SQLEXECUTE;
exports.SQL_API_SQLEXTENDEDFETCH = dba.SQL_API_SQLEXTENDEDFETCH;
exports.SQL_API_SQLFETCH = dba.SQL_API_SQLFETCH;
exports.SQL_API_SQLFETCHSCROLL = dba.SQL_API_SQLFETCHSCROLL;
exports.SQL_API_SQLFOREIGNKEYS = dba.SQL_API_SQLFOREIGNKEYS;
exports.SQL_API_SQLFOREIGNKEYSW = dba.SQL_API_SQLFOREIGNKEYSW;
exports.SQL_API_SQLFREECONNECT = dba.SQL_API_SQLFREECONNECT;
exports.SQL_API_SQLFREEENV = dba.SQL_API_SQLFREEENV;
exports.SQL_API_SQLFREEHANDLE = dba.SQL_API_SQLFREEHANDLE;
exports.SQL_API_SQLFREESTMT = dba.SQL_API_SQLFREESTMT;
exports.SQL_API_SQLGETCOL = dba.SQL_API_SQLGETCOL;
exports.SQL_API_SQLGETCOLW = dba.SQL_API_SQLGETCOLW;
exports.SQL_API_SQLGETCONNECTATTR = dba.SQL_API_SQLGETCONNECTATTR;
exports.SQL_API_SQLGETCONNECTATTRW = dba.SQL_API_SQLGETCONNECTATTRW;
exports.SQL_API_SQLGETCONNECTOPTION = dba.SQL_API_SQLGETCONNECTOPTION;
exports.SQL_API_SQLGETCONNECTOPTIONW = dba.SQL_API_SQLGETCONNECTOPTIONW;
exports.SQL_API_SQLGETCURSORNAME = dba.SQL_API_SQLGETCURSORNAME;
exports.SQL_API_SQLGETCURSORNAMEW = dba.SQL_API_SQLGETCURSORNAMEW;
exports.SQL_API_SQLGETDATA = dba.SQL_API_SQLGETDATA;
exports.SQL_API_SQLGETDESCFIELD = dba.SQL_API_SQLGETDESCFIELD;
exports.SQL_API_SQLGETDESCFIELDW = dba.SQL_API_SQLGETDESCFIELDW;
exports.SQL_API_SQLGETDESCREC = dba.SQL_API_SQLGETDESCREC;
exports.SQL_API_SQLGETDESCRECW = dba.SQL_API_SQLGETDESCRECW;
exports.SQL_API_SQLGETDIAGFIELD = dba.SQL_API_SQLGETDIAGFIELD;
exports.SQL_API_SQLGETDIAGFIELDW = dba.SQL_API_SQLGETDIAGFIELDW;
exports.SQL_API_SQLGETDIAGREC = dba.SQL_API_SQLGETDIAGREC;
exports.SQL_API_SQLGETDIAGRECW = dba.SQL_API_SQLGETDIAGRECW;
exports.SQL_API_SQLGETENVATTR = dba.SQL_API_SQLGETENVATTR;
exports.SQL_API_SQLGETFUNCTIONS = dba.SQL_API_SQLGETFUNCTIONS;
exports.SQL_API_SQLGETINFO = dba.SQL_API_SQLGETINFO;
exports.SQL_API_SQLGETINFOW = dba.SQL_API_SQLGETINFOW;
exports.SQL_API_SQLGETLENGTH = dba.SQL_API_SQLGETLENGTH;
exports.SQL_API_SQLGETPOSITION = dba.SQL_API_SQLGETPOSITION;
exports.SQL_API_SQLGETPOSITIONW = dba.SQL_API_SQLGETPOSITIONW;
exports.SQL_API_SQLGETSTMTATTR = dba.SQL_API_SQLGETSTMTATTR;
exports.SQL_API_SQLGETSTMTATTRW = dba.SQL_API_SQLGETSTMTATTRW;
exports.SQL_API_SQLGETSTMTOPTION = dba.SQL_API_SQLGETSTMTOPTION;
exports.SQL_API_SQLGETSTMTOPTIONW = dba.SQL_API_SQLGETSTMTOPTIONW;
exports.SQL_API_SQLGETSUBSTRING = dba.SQL_API_SQLGETSUBSTRING;
exports.SQL_API_SQLGETSUBSTRINGW = dba.SQL_API_SQLGETSUBSTRINGW;
exports.SQL_API_SQLGETTYPEINFO = dba.SQL_API_SQLGETTYPEINFO;
exports.SQL_API_SQLGETTYPEINFOW = dba.SQL_API_SQLGETTYPEINFOW;
exports.SQL_API_SQLLANGUAGES = dba.SQL_API_SQLLANGUAGES;
exports.SQL_API_SQLMORERESULTS = dba.SQL_API_SQLMORERESULTS;
exports.SQL_API_SQLNATIVESQL = dba.SQL_API_SQLNATIVESQL;
exports.SQL_API_SQLNATIVESQLW = dba.SQL_API_SQLNATIVESQLW;
exports.SQL_API_SQLNEXTRESULT = dba.SQL_API_SQLNEXTRESULT;
exports.SQL_API_SQLNUMPARAMS = dba.SQL_API_SQLNUMPARAMS;
exports.SQL_API_SQLNUMRESULTCOLS = dba.SQL_API_SQLNUMRESULTCOLS;
exports.SQL_API_SQLPARAMDATA = dba.SQL_API_SQLPARAMDATA;
exports.SQL_API_SQLPARAMOPTIONS = dba.SQL_API_SQLPARAMOPTIONS;
exports.SQL_API_SQLPREPARE = dba.SQL_API_SQLPREPARE;
exports.SQL_API_SQLPREPAREW = dba.SQL_API_SQLPREPAREW;
exports.SQL_API_SQLPRIMARYKEYS = dba.SQL_API_SQLPRIMARYKEYS;
exports.SQL_API_SQLPRIMARYKEYSW = dba.SQL_API_SQLPRIMARYKEYSW;
exports.SQL_API_SQLPROCEDURECOLUMNS = dba.SQL_API_SQLPROCEDURECOLUMNS;
exports.SQL_API_SQLPROCEDURECOLUMNSW = dba.SQL_API_SQLPROCEDURECOLUMNSW;
exports.SQL_API_SQLPROCEDURES = dba.SQL_API_SQLPROCEDURES;
exports.SQL_API_SQLPROCEDURESW = dba.SQL_API_SQLPROCEDURESW;
exports.SQL_API_SQLPUTDATA = dba.SQL_API_SQLPUTDATA;
exports.SQL_API_SQLRELEASEENV = dba.SQL_API_SQLRELEASEENV;
exports.SQL_API_SQLROWCOUNT = dba.SQL_API_SQLROWCOUNT;
exports.SQL_API_SQLSETCONNECTATTR = dba.SQL_API_SQLSETCONNECTATTR;
exports.SQL_API_SQLSETCONNECTATTRW = dba.SQL_API_SQLSETCONNECTATTRW;
exports.SQL_API_SQLSETCONNECTOPTION = dba.SQL_API_SQLSETCONNECTOPTION;
exports.SQL_API_SQLSETCONNECTOPTIONW = dba.SQL_API_SQLSETCONNECTOPTIONW;
exports.SQL_API_SQLSETCURSORNAME = dba.SQL_API_SQLSETCURSORNAME;
exports.SQL_API_SQLSETCURSORNAMEW = dba.SQL_API_SQLSETCURSORNAMEW;
exports.SQL_API_SQLSETDESCFIELD = dba.SQL_API_SQLSETDESCFIELD;
exports.SQL_API_SQLSETDESCFIELDW = dba.SQL_API_SQLSETDESCFIELDW;
exports.SQL_API_SQLSETDESCREC = dba.SQL_API_SQLSETDESCREC;
exports.SQL_API_SQLSETENVATTR = dba.SQL_API_SQLSETENVATTR;
exports.SQL_API_SQLSETPARAM = dba.SQL_API_SQLSETPARAM;
exports.SQL_API_SQLSETSTMTATTR = dba.SQL_API_SQLSETSTMTATTR;
exports.SQL_API_SQLSETSTMTATTRW = dba.SQL_API_SQLSETSTMTATTRW;
exports.SQL_API_SQLSETSTMTOPTION = dba.SQL_API_SQLSETSTMTOPTION;
exports.SQL_API_SQLSETSTMTOPTIONW = dba.SQL_API_SQLSETSTMTOPTIONW;
exports.SQL_API_SQLSPECIALCOLUMNS = dba.SQL_API_SQLSPECIALCOLUMNS;
exports.SQL_API_SQLSPECIALCOLUMNSW = dba.SQL_API_SQLSPECIALCOLUMNSW;
exports.SQL_API_SQLSTARTTRAN = dba.SQL_API_SQLSTARTTRAN;
exports.SQL_API_SQLSTATISTICS = dba.SQL_API_SQLSTATISTICS;
exports.SQL_API_SQLSTATISTICSW = dba.SQL_API_SQLSTATISTICSW;
exports.SQL_API_SQLTABLEPRIVILEGES = dba.SQL_API_SQLTABLEPRIVILEGES;
exports.SQL_API_SQLTABLEPRIVILEGESW = dba.SQL_API_SQLTABLEPRIVILEGESW;
exports.SQL_API_SQLTABLES = dba.SQL_API_SQLTABLES;
exports.SQL_API_SQLTABLESW = dba.SQL_API_SQLTABLESW;
exports.SQL_API_SQLTRANSACT = dba.SQL_API_SQLTRANSACT;
exports.SQL_API_SQLSETPOS = dba.SQL_API_SQLSETPOS;

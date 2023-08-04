// Copyright contributors to the nodejs-idb-pconnector project
// SPDX-License-Identifier: MIT

/* eslint-disable import/no-unresolved */
const {
  dbstmt, SQL_SUCCESS, SQL_NO_DATA_FOUND, SQL_SUCCESS_WITH_INFO,
} = require('idb-connector');

const deprecate = require('depd')('Statement');

/**
 * This function is for internal use within Statement constructor.
 * When a connection object is not provided one will be created.
 * This behavior is a bit unorthodox and should be deprecated in a later release
 * Furthermore the require statement for connection is tucked away in this function \
 * to avoid a circular dependency between connection and statement.
 * Another reason why this behavior should be removed in a later release.
 * Once deprecated this function can simply be removed.
 */
function createConnection() {
  // eslint-disable-next-line global-require
  const Connection = require('./connection');
  return new Connection({ url: '*LOCAL' });
}

/**
 * @class Statement
 * @constructor
 * @param {Object} [connection] - A Connection Object to initialize the Statement
 * If a connection is not provided one will be initialized for the statement
 */
class Statement {
  constructor(connection) {
    if (!connection) {
      deprecate('implicitly creating a connection within the constructor. You should pass a Connection object instead.');
      // eslint-disable-next-line no-param-reassign
      connection = createConnection();
    }
    this.dbc = connection.dbconn;
    // eslint-disable-next-line new-cap
    this.stmt = new dbstmt(this.dbc);
  }

  /**
   * @private
   * @description
   * Internal wrapper to call bindParam
   * Associates parameter markers in an SQL statement to app variables
   * @param {Array} params - the parameter list
   * Each parameter element will also be an Array with 3 values (Value, In/out Type, Indicator)
   * @returns {Promise} - Promise object represents the execution of bindParam()
   * @memberof Statement
   */
  async bindParamWrapper(params) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.bindParam(params, (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * @description
   * Associates parameter markers in an SQL statement to app variables
   * @param {Array} params - the parameter list
   * Each parameter element will also be an Array with 3 values (Value, In/out Type, Indicator)
   * @returns {Promise} - Promise object represents the execution of bindParam()
   * @memberof Statement
   */
  async bindParam(params) {
    deprecate('As of 1.1.0, bindParam() is deprecated and you should use bindParameters() instead.');
    await this.bindParamWrapper(params);
  }

  /**
   * Shorthand for bindParam
   * @param {Array} params - the parameter list
   * See `bindParam` for additional documentation
   * @memberof Statement
   */
  async bind(params) {
    deprecate('As of 1.1.0, bind() is deprecated and you should use bindParameters() instead.');
    await this.bindParamWrapper(params);
  }

  /**
   * @description
   * Associates parameter markers in an SQL statement to app variables
   * @param {Array} params - the parameter list of values to bind
   * @returns {Promise} - Promise object represents the execution of bindParameters()
   * @memberof Statement
   */
  async bindParameters(params) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.bindParameters(params, (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Ends and frees the statement object
   * @returns {Promise} - resolves to true indicating success
   * @memberof Statement
   */
  async close() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.close());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Closes the cursor associated with the dbstmt object and discards any pending results
   * @returns {Promise} - resolves to true indicating success
   * @memberof Statement
   */
  async closeCursor() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.closeCursor());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Adds all changes to the database that have been made on the connection since connect time
   * @returns {Promise} - resolves to true indicating success
   * @memberof Statement
   */
  async commit() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.commit());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * Performs action of given SQL String
   * The exec() method does not work with stored procedure calls use execute() instead
   * @param {string} sqlString
   * @returns {Promise} resolves to array result set or null
   * @memberof Statement
   */
  async exec(sqlString) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.exec(sqlString, (result, error) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * @description
   * Runs a statement that was successfully prepared using prepare()
   * Use execute() for stored procedure calls
   * @returns {Promise} resolves to an array of output params or null
   * @memberof Statement
   */
  async execute() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.execute((result, error) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * @description
   * If a result exists, retrieve a row from the result set
   * @returns {Promise | null} - resolves to the row object or null indicating end of data
   * when no data is found null is returned , indicating there ws nothing to return from fetch call
   * @memberof Statement
   */
  async fetch() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.fetch((result, rc) => {
        if (rc === SQL_SUCCESS || rc === SQL_SUCCESS_WITH_INFO) { // SQL_SUCCESS == 0
          resolve(result);
        } else if (rc === SQL_NO_DATA_FOUND) {
          resolve(null); // Indicates the end of the Data Set
        }
        reject(new Error('Unable to fetch result'));
      });
    });
  }

  /**
   * @description
   * If a result set exists, retrieve all the rows of data from the result set
   * @returns {Promise} - resolves to an array containing the result set
   * from the execution of fetchAll()
   * @memberof Statement
   */
  async fetchAll() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.fetchAll((result, error) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * @description
   * Helper function to simplify function bodies like fieldName or fieldNullable
   * Requires an int index parameter
   * @param suffix The suffix of the function name to call
   * @param {number} index - The position of the field within the table, It is 0 based
   * @memberof Statement
   */
  field(suffix, index) {
    const { stmt } = this;
    let response;

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
        reject(new Error('Index must be an Integer'));
      }
    });
  }

  /**
   * @description
   * Requires an int index parameter
   * If a valid index is provided, returns the name of the indicated field
   * @param {number} index - The position of the field within the table It is 0 based
   * @returns {Promise} - resolves to the String retrieved from the execution of fieldName()
   * @memberof Statement
   */
  async fieldName(index) {
    const result = await this.field('Name', index);
    return result;
  }

  /**
   * Requires an int index parameter
   * If a valid index is provided, returns t/f if the indicated field can be Null
   * @param {number} index - The position of the field within the table, it is 0 based
   * @returns {Promise} - resolves to the boolean retrieved from the execution of fieldNullable()
   * @memberof Statement
   */
  async fieldNullable(index) {
    const result = await this.field('Nullable', index);
    return result;
  }

  /**
   * @description
   * Requires an int index parameter
   * If a valid index is provided, returns the precision of the indicated field
   * @param {number} index - The position of the field within the table, it is 0 based
   * @returns {Promise} - resolves to the Number retrieved from the execution of fieldPrecise()
   * @memberof Statement
   */
  async fieldPrecise(index) {
    const result = await this.field('Precise', index);
    return result;
  }

  /**
   * @description
   * Requires an int index parameter
   * If a valid index is provided, returns the scale of the indicated column
   * @param {number} index - The position of the field within the table, it is 0 based
   * @returns {Promise} - resolves to the Number retrieved from the execution of fieldScale()
   * @memberof Statement
   */
  async fieldScale(index) {
    const result = await this.field('Scale', index);
    return result;
  }

  /**
   * @description
   * Requires an int index parameter
   * If a valid index is provided, returns the data type of the indicated field
   * @param {number} index - the position of the field within the table, it is 0 based
   * @returns {Promise} - resolves to the Number retrieved from the execution of fieldType()
   * @memberof Statement
   */
  async fieldType(index) {
    const result = await this.field('Type', index);
    return result;
  }

  /**
   * @description
   * Requires an int index parameter
   * If a valid index is provided, returns the field width of the indicated field
   * @param {number} index - the position of the field within the table, it is 0 based
   * @returns {Promise} - resolves to the Number retrieved from the execution of fieldWidth()
   * @memberof Statement
   */
  async fieldWidth(index) {
    const result = await this.field('Width', index);
    return result;
  }

  /**
   * @description
   * If a valid Statment attribute is provided,
   * returns the current settings for the specified Statement attribute
   * Refer to the link below for valid Statement Attributes
   * Further Documentation {@link https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsstma.htm HERE}
   * @param {number} attribute - the statement attribute to get
   * @returns {Promise} resolves to String | Number value retrieved
   * that was retrieved from the execution of getStmtAttr()
   * @memberof Statement
   */
  async getStmtAttr(attribute) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.getStmtAttr(attribute));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * Determines whether there is more information available on the statement
   * @returns {Promise} - Promise object represents the execution of nextResult()
   * @memberof Statement
   */
  async nextResult() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.nextResult());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * If a result is available, retrieve number of fields contained in result
   * @returns {Promise} - resolves to the Number returned from the execution of numFields()
   * @memberof Statement
   */
  async numFields() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.numFields());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * if a query was performed ,retrieves number of rows that were effected by a query
   * @returns {Promise} - resolves to the Number returned from the execution of numRows()
   * @memberof Statement
   */
  async numRows() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.numRows());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * If valid SQL is provided, prepare SQL and send it to the DBMS
   * @param {string} sqlString - The SQL string to be prepared
   * @returns {Promise} - Promise object represents the the execution of prepare()
   * @example - View the examples located at the execute() method
   * @memberof Statement
   */
  async prepare(sqlString) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      stmt.prepare(sqlString, (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * @description
   * Reverts changes to the database that have been made on the connection
   * since connect time or the previous call to commit()
   * @memberof Statement
   */
  async rollback() {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      try {
        resolve(stmt.rollback());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * If a valid attribute and value is provided, set StmtAttr indicate Attribute
   * Refer to the example @getStmtAttr for a list of valid Statement Attributes
   * @param {number} attribute - must be an int
   * @param {string | number}
   * @returns {Promise} - resolves to true indicating success
   * @memberof Statement
   */
  async setStmtAttr(attribute, value) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      if (attribute && Number.isInteger(attribute)) {
        try {
          resolve(stmt.setStmtAttr(attribute, value));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Attribute must be an Integer'));
      }
    });
  }

  /**
  * Returns the diagnostic information associated with the most recently called function
  * for a particular statement, connection, or environment handler
  * @param {number} hType - Indicates the handler type of diagnostic information
  * @example hType can be following values:
  * SQL_HANDLE_ENV:Retrieve the environment diagnostic information
  * SQL_HANDLE_DBC:Retrieve the connection diagnostic information
  * SQL_HANDLE_STMT:Retrieve the statement diagnostic information
  * @param {number} index - Indicates which error should be retrieved index is 1 based
  * @returns {Promise} - resolves to Number retrieved from the execution of stmtError()
  * @memberof Statement
  */
  async stmtError(hType, index) {
    const { stmt } = this;

    return new Promise((resolve, reject) => {
      if (!Number.isInteger(index) || index < 1) {
        reject(new Error('Index must be at least 1'));
      } else {
        stmt.stmtError(hType, index, (result, error) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            resolve(result);
          }
        });
      }
    });
  }

  /**
   * @description
   * Configuration option to return numeric types as a Number instead of a String.
   * When set to true numeric types will be returned as a Number instead of a String.
   * @param {boolean} flag - option to return numeric types as a Number instead of a String
   * @returns {boolean} - resolves to true/false indicating the state of the flag
   * @memberof Statement
   */
  enableNumericTypeConversion(flag) {
    const { stmt } = this;
    if (typeof flag === 'undefined') {
      return stmt.asNumber();
    }
    return stmt.asNumber(flag);
  }
}

module.exports = Statement;

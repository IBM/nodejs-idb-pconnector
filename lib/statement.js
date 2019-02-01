const {dbstmt} = require('idb-connector');
const Connection = require('./Connection');
/**
 * @class Statement
 * @constructor
 * @param {Object} [connection] - A Connection Object to initialize the Statement. If a connection is not provided one will be initialized for the statement.
 */
class Statement {
  constructor(connection = new Connection().connect()) {
    let me = this;

    me.dbc = connection.dbconn;
    me.stmt = new idb.dbstmt(me.dbc);
  }

  /**
       * Associates parameter markers in an SQL statement to app variables.
       * @param {Array} params - An Array of the parameter list. Each parameter element will also be an Array with 3 values (Value, In/out Type, Indicator).
       * @returns {Promise} - Promise object represents the execution of bindParam().
       * @memberof Statement
       */
  async bindParam(params) {
    let stmt = this.stmt;

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
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
       * Runs a statement that was successfully prepared using prepare().
       * Use execute() for stored procedure calls.
       * @returns {Promise} - Promise object represents the execution of execute().
       * @memberof Statement
       */
  async execute() {
    let stmt = this.stmt;

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
        reject(new Error('Unable to fetch result'));
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
          reject(new Error(error.message));
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
          reject(new Error(error.message));
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
        reject(new Error('Index must be at least 1.'));
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
}

exports = Statement;

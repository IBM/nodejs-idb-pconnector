# **API Documentation**

# Class: Connection

## Constructor: Connection()
The Connection constructor accepts an optional `db` parameter which can be used to connect to the database. If `db` is not provided make sure to use the `connect()` before performing any other methods.

**Parameters**:
- **db**: `Object` includes the properties `url` location of the database, use '*LOCAL' for a local database, `username` for the database user, `password` for the databse user. If connecting using '*LOCAL' it is not required to pass the `username` & `password` but ensure that the the object contains `url: '*LOCAL'`.

## Connection.connect(url, username, password)

Establishes a Connection to the database.

**Parameters**:

- **url**: `String` the url of the database to connect to. If a url is not specified, it defaults to "*LOCAL".

- **username**: `String` the username for the database user.

- **password**: `String` the password for the database user.

**Returns**: `Object` the Connection object with an established connection.

## Connection.getStatement()

Returns a Statement Object initialized to the current Connection. Ensure that the Connection object is connected first before attempting to  get a Statement. The [isConnected](#markdown-header-connectionisconnected) method can be used to check if the Connection object is currently connected

**Returns**: `Object` a new Statement initialized with the current Connection.

## Connection.close()

Closes the Connection to the DB and frees the connection object.

**Returns**: `Promise` when resolved will return `true` indicating successful closure, or the promise will be rejected.

## Connection.disconn()

Disconnects an existing connection to the database.

**Returns**: `Promise` when resolved will return `true` indicating successful disconnection, or the promise will be rejected.

## Connection.debug(choice)

Prints verbose detailed info to the console if choice is set `true`. Can be turned off by setting choice = false.

**Parameters**:

- **choice**: `boolean` the option either true or false to turn debug on/off.

**Returns**: `Promise` when resolved will return `true | false` indicating the current state of debug, or the promise will be rejected.

## Connection.getConnAttr(attribute)

If the `attribute` exists will return the current value of the attribute.

**Parameters**:

- **attribute**: `Number` the attribute to retrieve the current value from.

**Returns**: `Promise` when resolved  will return the specified connection attribute settings either `Number | String`, or the promise will be rejected.

**Link**:
[Connection Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw\_ibm\_i_73/cli/rzadpfnsconx.htm)

## Connection.isConnected()

Checks if the Connection object is currentl connected to the database.

**Returns**: `true` or `false` indicating if the Connection object is currently connected.

## Connection.setConnAttr(attribute, value)

Sets the the value for a given `attribute`.

**Parameters**:

- **attribute**: `Number` the attribute to be set.

- **value**: `string | number` the value to set the attribute to.

**Returns**: `Promise` when resolved will return `true` indicating success or the promise will be rejected.

## Connection.validStmt(sql)

Checks if the given SQL is valid and interprets vendor escape clauses.

**Parameters**:

- **sql**: `String`, the sql string to be validated.

**Returns**: `Promise` when resolved will return the transformed sql string that is seen by the data source, or the promise will be rejected.


# Class: Statement

## Constructor: Statement(connection)

**Parameters**:

- **connection**: optional `dbconn` Object for the connection to use. If you don't pass a `connection` one will be implicitly created and used for the statement.

## Statement.bindParam(params)

Associates parameter markers in an sql statement to application variables.

**Parameters**:

- **params**: `Array` the parameter list in order corresponding to the parameter markers. Each parameter element will also be an Array with 3 values ( value, in/out type ,indicator ).


```
       IN/OUT TYPE CAN BE:
          - SQL_PARAM_INPUT or PARAM_INPUT
          - SQL_PARAM_OUTPUT or PARAM_OUTOUT
          - SQL_PARAM_INPUT_OUTPUT or INPUT_OUTPUT
          
       INDICATORS CAN BE:
           - SQL_BIND_CHAR or BIND_STRING
           - SQL_BIND_INT or BIND_INT
           - SQL_BIND_NUMERIC or BIND_NUMERIC
           - SQL_BIND_BINARY or BIND_BINARY
           - SQL_BIND_BLOB or BIND_BINARY
           - SQL_BIND_CLOB or BIND_CLOB
           - SQL_BIND_BOOLEAN or BIND_BOOLEAN
           - SQL_BIND_NULL_DATA or BIND_NULL
      
```
These values are constants which are attached to object returned when you `const idbp = require('idb-pconnector')`.

You can access said values like so : `idbp.PARAM_INPUT`

**Returns**: `Promise` when resolved there is no return value but if an error occurred the promise will be rejected.

**Example**: [Here](#markdown-header-prepare-bind-execute)

## Statement.bind(params)

Shorthand equivalent of bindParam(params) above.


## Statement.close()

Ends and frees the statement object.

**Returns**: `Promise` when resolved will return true indicating successful closure, or the promise will be rejected.

## Statement.closeCursor()

Closes the cursor associated with the Statement object and discards any pending results.

**Returns**: `Promise` when resolved will return true indicating successful closure, or the promise will be rejected.

## Statement.commit()

Adds all changes to the database that have been made on the connection since connect time.

**Returns**: `Promise` when resolved will return true indicating successful commit, or the promise will be rejected.

## Statement.exec(sql)

Directly executes a given sql String. The exec() method does not work with stored procedure use execute() method instead.

**Parameters**:

- **sql**: `String` the sql command to execute.

**Returns**: `Promise` when resolved if available will return the result set as an `Array` , or the promise will be rejected.

**Example**: [Here](#markdown-header-exec)

## Statement.execute()

Runs a statement that was successfully prepared using prepare(). Used to call stored procedure calls. Important to note that execute() will return output parameters and not a result set. If available you can retrieve the result set by either running fetch() or fetchAll().

**Returns**: `Promise` when resolved if available will return output parameters as an `Array`, or the promise will be rejected.

**Example**: [Here](#markdown-header-prepare-bind-execute)

## Statement.fetch()

If a result set exists, fetch() will retrieve a row from the result set. The row is an `Object`. Fetch can be continuously run until there is no data. If there is no data to be fetched null will be returned indicating the end of the result set.

**Returns**: `Promise` when resolved will return an `Object` representing the row that was retrieved. If there is no data remaining to be fetched in the result set `null` will be returned indicating the end of the result set. Or if there was never a result set to be fetched the promise will be rejected.

**Example Fetching a result set until there is no more data to fetch**:

```javascript
const {Connection} = require('idb-pconnector');

async function fetch(){
  try {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    connection = new Connection();

    connection.debug(true);
    let statement = connection.connect().getStatement();

    await statement.prepare(sql);
    await statement.execute();
    let result = await statement.fetch();

    while (result !== null ){
      console.log(`Fetch result:\n ${JSON.stringify(result)}`);
      result = await statement.fetch();
    }
  } catch(error){
    	console.log(error.stack);
      }
}

fetch();

```

## Statement.fetchAll()

If a result set exists , fetchAll() retrieves all the rows from the result set.

**Returns**: `Promise` when resolved will return an `Array` of `Objects` representing the result set if its available, or the promise will be rejected.

## Statement.fieldName(index)

If a valid index is provided, returns the name of the indicated field.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return `String` name of the field or the promise will be rejected.

## Statement.fieldNullable(index)

If a valid index is provided, returns `true | false` if the indicated field can be set to `null`.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return `true | false` or the promise will be rejected.

## Statement.fieldPrecise(index)

If a valid index is provided, returns the precision of the indicated field

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return `Number` or the promise will be rejected.

## Statement.fieldScale(index)

If a valid index is provided, returns the scale of the indicated column.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return a `Number` or the promise will be rejected.

## Statement.fieldType(index)

If a valid index is provided, returns the data type of the indicated field.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return a `Number` or the promise will be rejected.

## Statement.fieldWidth(index)

If a valid index is provided, returns the field width of the indicated field

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise`, when resolved will return a `Number` or the promise will be rejected.

## Statement.getStmtAttr(attribute)

If a valid Statement attribute is provided , returns the current settings for the specified Statement attribute.
Refer to the list below for valid Statement Attributes.

**Parameters**:

- **attribute**: `Number`the attribute to retrieve the current value from.

**Returns**: `Promise`, when resolved will return the specified connection attribute settings as a `Number | String`, or the promise will be rejected.

**Link**: [Statement Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsstma.htm)

## Statement.nextResult()

Determines whether there is more information available on the statement handle that has been associated with a stored procedure that is returning result sets.

After completely processing the first result set, the application can call nextResult() to determine if another result set is available. If the current result set has unfetched rows, nextResult() discards them by closing the cursor.

**Returns**: `Promise` when resolve `true` will be returned indicating there is another result set or `null` is returned indicating there was not another result set. If an error occurred while processing the promise is rejected.

## Statement.numFields()

If a result set is available , numFields() retrieves number of fields contained in the result set.

**Returns**: `Promise` when resolved `Number` is returned or the promise is rejected.

## Statement.numRows()

If a query was performed, retrieves the number of rows that were affected by a query.

**Returns**: `Promise` when resolved will return a `Number` or the promise is rejected.

## Statement.prepare(sql)

If valid sql is provided . prepares the sql and sends it to the DBMS, if the input sql Statement cannot be prepared error is thrown.

**Parameters**:

- **sql**: `String`, the SQL string to be prepared.

**Returns**: `Promise` when resolved no value is returned but if an error occurred the promise is rejected.

**Example**: [Here](#markdown-header-prepare-bind-execute)

## Statement.rollback()

Reverts changes to the database that have been made on the connection since connect time or the previous call to commit().

**Returns**: `Promise` when resolved  `true` is returned or promise is rejected.


## Statement.setStmtAttr(attribute, value)

Sets the the value for a given attribute.

**Parameters**:

- **attribute**: `Number` the attribute to be set.

- **value**: `string | number` the value to set the attribute to.

- **Returns**: `Promise` when resolved will return `true` indicating success or the promise will be rejected..

## Statement.stmtError(hType, recno)

Returns the diagnostic information associated with the most recently called function for a particular statement, connection, or environment handler.

**Parameters**:

- **hType**: `Number`, indicates the handler type of diagnostic information.

- **recno**: `Number`, indicates which error should be retrieved. The first error record is number 1.

```
hType can be following values:
 	 SQL_HANDLE_ENV:  Retrieve the environment diagnostic information
	 SQL_HANDLE_DBC:  Retrieve the connection diagnostic information
     SQL_HANDLE_STMT: Retrieve the statement diagnostic information
```

**Returns**: `Promise` when resolved returns `String` or the promise is rejected.
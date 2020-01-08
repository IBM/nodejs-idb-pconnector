# **API Documentation**
<!-- TOC -->
- [**API Documentation**](#api-documentation)
- [**Class: Connection**](#class-connection)
  - [**Constructor: Connection(database)**](#constructor-connectiondatabase)
  - [**Connection.connect(url, username, password)**](#connectionconnecturl-username-password)
  - [**Connection.getStatement()**](#connectiongetstatement)
  - [**Connection.close()**](#connectionclose)
  - [**Connection.disconn()**](#connectiondisconn)
  - [**Connection.debug(choice)**](#connectiondebugchoice)
  - [**Connection.getConnAttr(attribute)**](#connectiongetconnattrattribute)
  - [**Connection.isConnected()**](#connectionisconnected)
  - [**Connection.setConnAttr(attribute, value)**](#connectionsetconnattrattribute-value)
  - [**Connection.validStmt(sql)**](#connectionvalidstmtsql)
  - [**Connection.setLibraryList(list)**](#connectionsetlibrarylistlist)
- [**Class: Statement**](#class-statement)
  - [**Constructor: Statement(connection)**](#constructor-statementconnection)
  - [**Statement.bindParam(params)**](#statementbindparamparams-options)
  - [**Statement.bind(params)**](#statementbindparams-options)
  - [**Statement.close()**](#statementclose)
  - [**Statement.closeCursor()**](#statementclosecursor)
  - [**Statement.commit()**](#statementcommit)
  - [**Statement.exec(sql)**](#statementexecsql)
  - [**Statement.execute()**](#statementexecute)
  - [**Statement.fetch()**](#statementfetch)
  - [**Statement.fetchAll()**](#statementfetchall)
  - [**Statement.fieldName(index)**](#statementfieldnameindex)
  - [**Statement.fieldNullable(index)**](#statementfieldnullableindex)
  - [**Statement.fieldPrecise(index)**](#statementfieldpreciseindex)
  - [**Statement.fieldScale(index)**](#statementfieldscaleindex)
  - [**Statement.fieldType(index)**](#statementfieldtypeindex)
  - [**Statement.fieldWidth(index)**](#statementfieldwidthindex)
  - [**Statement.getStmtAttr(attribute)**](#statementgetstmtattrattribute)
  - [**Statement.nextResult()**](#statementnextresult)
  - [**Statement.numFields()**](#statementnumfields)
  - [**Statement.numRows()**](#statementnumrows)
  - [**Statement.prepare(sql)**](#statementpreparesql)
  - [**Statement.rollback()**](#statementrollback)
  - [**Statement.setStmtAttr(attribute, value)**](#statementsetstmtattrattribute-value)
  - [**Statement.stmtError(hType, recno)**](#statementstmterrorhtype-recno)
- [**Class: DBPool**](#class-dbpool)
  - [**Constructor: DBPool(database , config)**](#constructor-dbpooldatabase--config)
  - [**DBPool.createConnection(index)**](#dbpoolcreateconnectionindex)
  - [**DBPool.detachAll()**](#dbpooldetachall)
  - [**DBPool.retireAll()**](#dbpoolretireall)
  - [**DBPool.detach(connection)**](#dbpooldetachconnection)
  - [**DBPool.retire(connection)**](#dbpoolretireconnection)
  - [**DBPool.attach()**](#dbpoolattach)
  - [**DBPool.runSql(sql)**](#dbpoolrunsqlsql)
  - [**DBPool.prepareExecute(sql, params, options)**](#dbpoolprepareexecutesql-params-options)
  - [**DBPool.setConnectionAttribute(attribute)**](#dbpoolsetconnectionattributeattribute)
  <!-- /TOC -->

# **Class: Connection**

## **Constructor: Connection(database)**
The Connection constructor accepts an optional `database` parameter which can be used to connect to the database. 

If `database` is not provided make sure to use the `connect()` before performing any other methods.

**Parameters**:  

- **database**: `Object` includes the properties:  
    - **url** `String` location of the database, use `*LOCAL` for a local database.  
    
    - **username** `String` for the database user.
    
    - **password** `String` for the database user.  

***NOTE***: if connecting using `*LOCAL`, the `username` & `password` can be undefined but ensure that `database` contains:
- `url: '*LOCAL'`

## **Connection.connect(url, username, password)**

Establishes a Connection to the database.

**Parameters**:

- **url**: `String` the url of the database to connect to. If a url is not specified, it defaults to `*LOCAL`.

- **username**: `String` the username for the database user.

- **password**: `String` the password for the database user.

**Returns**: `Object` the Connection object with an established connection.

## **Connection.getStatement()**

Returns a Statement Object initialized to the current Connection. Ensure that the Connection object is connected first before attempting to  get a Statement. 

The [isConnected](#connectionisconnected) method can be used to check if the Connection object is currently connected.

**Returns**: `Object` a new Statement object initialized with the current Connection.

## **Connection.close()**

Closes the Connection to the DB and frees the connection object.

**Returns**: `Promise` when resolved will return `true` indicating successful closure, or the promise will be rejected.

## **Connection.disconn()**

Disconnects an existing connection to the database.

**Returns**: `Promise` when resolved will return `true` indicating successful disconnection, or the promise will be rejected.

## **Connection.debug(choice)**

Prints verbose detailed info to the console if `choice` is set `true`. Can be turned off by setting `choice = false`.

**Parameters**:

- **choice**: `boolean` the option either true or false to turn debug on/off.

**Returns**: `Promise` when resolved will return `true | false` indicating the current state of debug, or the promise will be rejected.

## **Connection.getConnAttr(attribute)**

Returns the current value of a connection attribute, if the `attribute` exists.

**Parameters**:

- **attribute**: `Number` the attribute to retrieve the current value from.

**Returns**: `Promise` when resolved  will return the specified connection attribute settings either `Number | String`, or the promise will be rejected.

**Link**:
[Connection Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw\_ibm\_i_73/cli/rzadpfnsconx.htm)

## **Connection.isConnected()**

Checks if the Connection object is currently connected to the database.

**Returns**: `true` or `false` indicating if the Connection object is currently connected.

## **Connection.setConnAttr(attribute, value)**

Sets a connection `attribute` to a provided valid `value`.

**Parameters**:

- **attribute**: `Number` the attribute to be set.

- **value**: `string | number` the value to set the attribute to.

**Returns**: `Promise` when resolved will return `true` indicating success, or the promise will be rejected.

## **Connection.validStmt(sql)**

Checks if the given SQL is valid and interprets vendor escape clauses.

**Parameters**:

- **sql**: `String`, the sql string to be validated.

**Returns**: `Promise` when resolved will return the transformed sql string that is seen by the data source, or the promise will be rejected.

## **Connection.setLibraryList(list)**

Change to system naming and set the library list (using `CHGLIBL`) of the connection.

**Parameters**:

- **list**: `Array` of strings where each element in the array is a library.

# **Class: Statement**

## **Constructor: Statement(connection)**

**Parameters**:

- **connection**: optional `Connection Object` for the Statement to use. 

***NOTE***: If you don't pass a `Connection Object` one will be implicitly created and will attempt to connect to `*LOCAL`.


## **Statement.bindParam(params, options)**

Associates parameter markers in an sql statement to application variables.

**Parameters**:

- **params**: `Array` the parameter list in order corresponding to the parameter markers. Each parameter element will also be an Array with 3 values [`value`, `io`, `indicator`].


`io` can be:

 - IN
 - OUT
 - INOUT

`indicator` can be:

   - CHAR
   - INT
   - NUMERIC
   - BINARY
   - BLOB
   - CLOB
   - BOOLEAN
   - NULL


These values are constants which are attached to object returned when you `const idbp = require('idb-pconnector')`.

You can access the constants like so : `idbp.IN`

- **options**: `Object` optional configuration object for `bindParam()`.
    - `setupParams`: `boolean` Allows `params` to be an array of values and will format the parameters for you.
       When set to `true` it allows `params` to behave as documented in [prepareExecute](#dbpoolprepareexecutesql-params-options)

**Returns**: `Promise` when resolved there is no return value but if an error occurred the promise will be rejected.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#prepare-bind-execute)

## **Statement.bind(params, options)**

Shorthand equivalent of `bindParam(params, options)` above.


## **Statement.close()**

Ends and frees the statement object.

**Returns**: `Promise` when resolved will return true indicating successful closure, or the promise will be rejected.

## **Statement.closeCursor()**

Closes the cursor associated with the Statement object and discards any pending results.

**Returns**: `Promise` when resolved will return true indicating successful closure, or the promise will be rejected.

## **Statement.commit()**

Adds all changes to the database that have been made on the connection since connect time.

**Returns**: `Promise` when resolved will return true indicating successful commit, or the promise will be rejected.

## **Statement.exec(sql)**

Directly executes a given sql String. The exec() method does not work with stored procedure use execute() method instead.

**Parameters**:

- **sql**: `String` the sql command to execute.

**Returns**: 

- `Promise` when resolved if available will return the result set as an `Array`.  
- If no result set was available the `Promise` will resolve to `null`  
- If the `sql` statement could not be directly executed the `Promise` will be rejected.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#exec)

## **Statement.execute()**

Runs a statement that was successfully prepared using prepare(). Used to call stored procedure calls. 

**Returns**: `

- Promise` when resolved if available will return output parameters as an `Array`.  
- If no output parameters were available the `Promise` will resolve to `null`.  
- If the prepared statement could not be executed the `Promise` will be rejected.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#prepare-bind-execute)

***NOTE***: that execute() will return output parameters and not a result set. 

If available you can retrieve the result set by either running `fetch()` or `fetchAll()` after `execute()` has been called.

## **Statement.fetch()**

If a result set exists, fetch() will retrieve a row from the result set. The row is an `Object`. 

Fetch can be continuously run until there is no data. If there is no data to be fetched `null` will be returned indicating the end of the result set.

**Returns**:

- `Promise` when resolved will return an `Object` representing the row that was retrieved. 
- If there is no data remaining to be fetched in the result set `null` will be returned. 
- If there was never a result set to be fetched the `Promise` will be rejected.

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

## **Statement.fetchAll()**

If a result set exists , `fetchAll()` retrieves all the rows from the result set.

**Returns**: `Promise` when resolved will return an `Array` of `Objects` representing the result set or the promise will be rejected.

## **Statement.fieldName(index)**

If a valid index is provided, `fieldName()` returns the name of the indicated field.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return `String` name of the field or the promise will be rejected.

## **Statement.fieldNullable(index)**

If a valid index is provided, `fieldNullable` returns `true | false` indicating if field can be set to `null`.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return `true | false` or the promise will be rejected.

## **Statement.fieldPrecise(index)**

If a valid index is provided, `fieldPrecise` returns the precision of the indicated field.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return `Number` or the promise will be rejected.

## **Statement.fieldScale(index)**

If a valid index is provided, `fieldScale` returns the scale of the indicated column.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return a `Number` or the promise will be rejected.

## **Statement.fieldType(index)**

If a valid index is provided, `fieldType` returns the data type of the indicated field.

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise` when resolved will return a `Number` or the promise will be rejected.

## **Statement.fieldWidth(index)**

If a valid index is provided, `fieldWidth` returns the field width of the indicated field

**Parameters**:

- **index**: `Number` the position of the field within the table. It is 0 based.

**Returns**: `Promise`, when resolved will return a `Number` or the promise will be rejected.

## **Statement.getStmtAttr(attribute)**

If a valid Statement attribute is provided , `getStmtAttr` returns the current settings for the specified `attribute`.

**Parameters**:

- **attribute**: `Number`the attribute to retrieve the current value from.

**Returns**: `Promise`, when resolved will return the specified connection attribute settings as a `Number | String`, or the promise will be rejected.

Refer to the list below for valid Statement Attributes.

**Link**: [Statement Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsstma.htm)

## **Statement.nextResult()**

Determines whether there is more information available on the statement handle that has been associated with a stored procedure that is returning result sets.

After completely processing the first result set, the application can call nextResult() to determine if another result set is available. 

If the current result set has unfetched rows, nextResult() discards them by closing the cursor.

**Returns**:

- `Promise` when resolve `true` will be returned indicating there is another result set or `null` is returned indicating there was not another result set. 
- If an error occurred while processing the promise is rejected.

## **Statement.numFields()**

If a result set is available , `numFields` retrieves number of fields contained in the result set.

**Returns**: `Promise` when resolved `Number` is returned or the promise is rejected.

## **Statement.numRows()**

If a query was performed, `numRows`retrieves the number of rows that were affected by a query.

**Returns**: `Promise` when resolved will return a `Number` or the promise is rejected.

## **Statement.prepare(sql)**

If valid `sql` is provided , `prepare` prepares the `sql` statement and sends it to the DBMS.

**Parameters**:

- **sql**: `String` the SQL string to be prepared.

**Returns**: `Promise` when resolved no value is returned but if an error occurred the promise is rejected.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#prepare-bind-execute)

## **Statement.rollback()**

Reverts changes to the database that have been made on the connection since connect time or the previous call to `commit()`.

**Returns**: `Promise` when resolved  `true` is returned or promise is rejected.


## **Statement.setStmtAttr(attribute, value)**

Sets a statement `attribute` to a provided valid `value`.

**Parameters**:

- **attribute**: `Number` the attribute to be set.

- **value**: `string | number` the value to set the attribute to.

- **Returns**: `Promise` when resolved will return `true` indicating success or the promise will be rejected.

## **Statement.stmtError(hType, recno)**

Returns the diagnostic information associated with the most recently called function for a particular statement, connection, or environment handler.

**Parameters**:

- **hType**: `Number`, indicates the handler type of diagnostic information.
    - `SQL_HANDLE_ENV`: Retrieve the environment diagnostic information

    - `SQL_HANDLE_DBC`: Retrieve the connection diagnostic information

    - `SQL_HANDLE_STMT`: Retrieve the statement diagnostic information

- **recno**: `Number`, indicates which error should be retrieved. The first error record is number 1.


**Returns**: `Promise` when resolved returns `String` or the promise is rejected.

# **Class: DBPool**

Manages a list of DBPoolConnection instances.


## **Constructor: DBPool(database , config)**

Constructor to instantiate a new instance of a DBPool class given the `database` and `config`.


**Parameters**:

- **database**: `Object` with the properties: 
    - `url`: `String` location of the database, use `*LOCAL` for a local database.
    - `username`: `String` for the database user.
    - `password`: `String` for the database user.

- **config**: `Object` with the properties: 
    - `incrementSize`: `Number` is an integer that sets the desired size of the `DBPool`, defaults to 8 connections.
    - `debug`: `boolean` setting it to true will display verbose output to the console, defaults to false.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#dbpool)


## **DBPool.createConnection(index)**

Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
Assumes the database of the pool when establishing the connection.

**Parameters**:

**index**: `Number` an optional identifier to id the connection for debug purposes.


## **DBPool.detachAll()**

Frees all connections in the pool (Sets availability back to `true` for all) and cleans up statements on the connection.

**Returns**:`Promise` when resolved returns `true` if all were detached successfully, or the promise is rejected.

## **DBPool.retireAll()**

Retires (Removes) all connections from being used again

**Returns**: `Promise` when resolved returns `true` if all were retired successfully, or the promise is rejected.

## **DBPool.detach(connection)**

Frees a connection (Sets availability back to true) cleans up statements on the connection.

**Parameters**:

- **connection**: `DBPoolConnection`, Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.


**Returns**: `Promise` when resolved returns `true` if detached successfully, or the promise is rejected.

## **DBPool.retire(connection)**

Retires a connection from being used and removes it from the pool.

**Parameters**:

- **connection**: `DBPoolConnection`, Retires a connection from being used and removes it from the pool

**Returns**: `Promise` when resolved returns `true` if retired successfully, or the promise is rejected.

## **DBPool.attach()**

Finds and returns the first available Connection. 

If no available connection is found, connections will be incremented by the `incrementSize`, which defaults to 8.

**Returns**: `DBPoolConnection` connection from the `DBPool`.



## **DBPool.runSql(sql)**

An aggregate to run an sql statement, just provide the `sql` to run. 

***NOTE***: that Stored Procedures should use the prepareExecute() aggregate instead.

**Parameters**:

- **sql**: `String` the sql statement to run.

**Returns**: 

- `Array` if the sql returns a result set it is returned as an `Array` of `Objects`.

- If no result set is available `null` is returned.

***NOTE***: Caller should check if `null` is returned.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#runsql)


## **DBPool.prepareExecute(sql, params, options)**

Aggregate to prepare, bind, and execute. Just provide the `sql` and the optional `params` as an array.

`options` object can now be used for global configuration. This is used to set options on all the parameters within the `params` Array. 

Currently, the input output indicator `io` is the only available option to set. This will override the default which is `'both'`.

**Example**: `prepareExecute(sql, parrams, {io: 'in'})`

Also parameters can be customized at an individual level by passing an object within the `params` Array.

The object format: 
- `value`: `String | Number | Buffer | boolean | null`
-  `io`: `in | out | both`
-  `asClob`: `true | false`

`value` is the only ***required*** property others will fall back to defaults if undefined.

If you want to bind a string as a clob you can add `asClob: true` property to the object.

**Example**: `{value: 'your string', asClob: true, io: 'in'}`

**Parameters**:

- **sql**: `string` the sql to prepare , include parameter markers (?, ?, ...)

- **params**: `Array` an optional array of values to bind. order of the values in the array must match the order of the desired parameter marker in the sql string.
- **options**: `Object` with config options to set for all parameters. The Object can contain: 
- **io**: `String`set to either the `'in'`, `'out'`, or `'both'`. Indicating that the parameter is an input, output, or inout parameter.

**Returns**:

- `Object` in the format: `{resultSet: [], outputParams: []}` if the Prepared SQL returns result set & output parameters.
- `Object` in the format: `{resultSet: []}` if the Prepared SQL returns result set but no output parameters.
- `Object` in the format: `{outputParams: []}` if the Prepared SQL output parameters but no result set.

- If neither were available `null` will be returned indicating that there is no result set or output parameters. 

***NOTE***: Caller should check if `null` is returned.

**Example**: [Here](https://github.com/ibm/nodejs-idb-pconnector#prepareexecute)

## **DBPool.setConnectionAttribute(attribute)**

Sets the connection attribute for each Connection in the pool.

**Parameters**:

- **attribute**: `Object` that contains: 
    - ***attribute***: `Number` the attribute to set.
	- ***value***: `Number | String` the value to set the attribute to

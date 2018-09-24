# **idb-pconnector - promised based DB2 Connector for IBM i**
**Project Status**: (production-ready as a "technology preview")

The objective of this project is to provide a promise based database connector API for DB2 on IBM i. 
This project is a wrapper over the [`idb-connector`](https://bitbucket.org/litmis/nodejs-idb-connector) project but returning promises instead of using callbacks.

Connection Pooling is supported giving you better control.
The `DBPool` class includes integrated aggregates (prepareExecute, runSql), which make it easier to Prepare & Execute & directly Execute SQL. When using the aggregates opening and closing of statements will be handled by the pool.

Using Node version ^8.X.X you can take advantage of async & await to simplifying your code.
Remember to use the `await` keyword your code must be wrapped within an `async function`.

Please refer to the documentation below for installation and usage of the `idb-pconnector`.

[TOC]

# **Install**
This project is a Node.js module available through npm (node package manager).

Once you have Node.js installed, you can run the following command: 

`npm install idb-pconnector`

# **Examples**

### exec
Using Async & Await, to run a select statement & displaying the result set:


```javascript
const {Connection} = require('idb-pconnector');

async function execExample() {
  try {
    let statement =  new Connection().connect().getStatement();

    let result = await statement.exec('SELECT * FROM MYSCHEMA.TABLE');
    
    console.log(`Select results: \n${JSON.stringify(result)}`);

  } catch(error) {
       console.error(`Error was: \n${error.stack}`);
    }
}

execExample();

```
### prepare bind execute
Using Async & Await, to prepare, bind, and execute an insert statement:

```javascript
const idbp = require('idb-pconnector');
const Connection = idbp.Connection;

async function pbeExample() {
  try {
    let statement =  new Connection().connect().getStatement();

    await statement.prepare('INSERT INTO MYSCHEMA.TABLE VALUES (?,?)');

    await statement.bind([
      [2018, idbp.PARAM_INPUT, idbp.BIND_INT],
      ['example', idbp.PARAM_INPUT, idbp.BIND_STRING]
    ]);
    await statement.execute();

  } catch(error) {
       console.error(`Error was: \n${error.stack}`);
    }
}

pbeExample();

```
### DBPool

Using DBPool to attach a connection , execute a stored procedure , and finally detach the connection.

```javascript
const {DBPool} = require('idb-pconnector');
const pool = new DBPool();

async function poolExample(){
 //attach() returns an available connection from the pool.
 let connection = pool.attach(),
   statement = connection.getStatement(),
   results = null;

 try {
   await statement.prepare("CALL QIWS.GET_MEMBERS('QIWS','QCUSTCDT')");
   await statement.execute();
   results = await statement.fetchAll();

   if (results !== null){
     console.log(`\n\nResults: \n${JSON.stringify(results)}`);
   }
   //closes statements makes the Connection available for reuse.
   await pool.detach(connection);

 } catch (error){
   console.log(`Error was: \n\n${error.stack}`);
   pool.retire(connection);
 }
}

poolExample();


```
### prepareExecute

Example Using DBPool prepareExecute(sql,params,options) method to Prepare and Execute a statement.
If you want to bind variables pass an array of values as the second parameter.

```javascript
const {DBPool} = require('idb-pconnector');
const pool = new DBPool();

async function prepareExecuteExample(){
 //Prepare and execute an SQL statement.
 try {
   /*
   * Params are passed as an array values.
   * The order of the params indexed in the array should map to the order of the parameter markers(i.e. '?').
   */
   let sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE',
     params = [4949, 'Johnson', 'T J', '452 Broadway', 'MSP', 'MN', 9810, 2000, 1, 250, 0.00],
     data = await pool.prepareExecute(sql, params);

   if (data !== null){
     let {resultSet} = data;
     console.log(`\n\n${JSON.stringify(resultSet)}\n\n`);
   }

 } catch (error){
   console.log(`Error was: ${error.stack}`);
 }
}

prepareExecuteExample();

```
### runSql

Example Using DBPool runSql(sql) method to directly run an sql statement.
NOTE: This method will not work with stored procedures use prepareExecute() instead.

```javascript
const {DBPool} = require('idb-pconnector');
const pool = new DBPool();

async function runSqlExample(){
  /*
  * Directly execute a statement by providing the SQL to the runSql() function.
  * NOTE: Stored Procedures must use the prepareExecute() method instead.
  */
 try {

   let result = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');

    if (result !== null) {
     console.log(`\n${JSON.stringify(result)}`);
   }

 } catch (error){
   console.log(`Error was: ${error.stack}`);
 }
}

runSqlExample();

```

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



# Class: DBPool

Manages a list of DBPoolConnection instances.
Constructor to instantiate a new instance of a DBPool class given the `database` and `config`.


## Constructor: DBPool(database , config)

**Parameters**:

- **database**: `object` includes the `url` defaults to "*LOCAL", `username`, and `password`. Username & password is optional when connecting to "*LOCAL".

- **config**: `object` with the properties: `incrementSize` and `debug`. IncrementSize is a integer `Number` that sets the desired size of the DBPool defaults to 8 connections. Debug is a `boolean` setting it to true will display verbose output to the console, defaults to false.

**Example**: [Here](#markdown-header-dbpool)


## DBPool.createConnection(index)

Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
Assumes the database of the pool when establishing the connection.

**Parameters**:

**index**: `Number` an optional identifier to id the connection for debug purposes.


## DBPool.detachAll()

Frees all connections in the pool (Sets "Available" back to true for all)
closes any statements and gets a new statement.

**Returns**: `true` if all were detached successfully or will return `String` error message if an error occurred.

## DBPool.retireAll()

Retires (Removes) all connections from being used again

**Returns**: `true` if all were retired successfully, or will return `String` error message if an error occurred.

## DBPool.detach(connection)

Frees a connection (Returns the connection "Available" back to true) closes any statements and gets a new statement.

**Parameters**:

- **connection**: `DBPoolConnection`, Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.


**Returns**: `String` error message if an error occurred.

## DBPool.retire(connection)

Retires a connection from being used and removes it from the pool.

**Parameters**:

- **connection**: `DBPoolConnection`, Retires a connection from being used and removes it from the pool

**Returns**: `String` error message if an error occurred.

## DBPool.attach()

Finds and returns the first available Connection.

**Returns**: `DBPoolConnection` connection from the `DBPool`.



## DBPool.runSql(sql)

An aggregate to run an sql statement, just provide the sql to run. Note that Stored Procedures should use the prepareExecute() aggregate instead.

**Parameters**:

- **sql**: `String`, the sql statement to execute.

**Returns**: 
- `Array` if the sql returns a result set it is returned as an `Array` of `Objects`.

- If no result set is available `null` is returned. Caller should check if `null` is returned.

**Example**: [Here](#markdown-header-runsql)


## DBPool.prepareExecute(sql, params, options)

Aggregate to prepare, bind, and execute. Just provide the sql and the optional params as an array.

An `options` object can now be used for global configuration. This is used to set options on all the parameters within the `params` Array. Currently, the input output indicator `io` is the only available option to set. This will override the default which is `'both'`.

**Example**: `prepareExecute(sql, parrams, {io: 'in'})`

Also parameters can be customized at an individual level by passing an object within the parameter list.

The object format: `{value: "string | Number | boolean | null" , io: "in | out | both" , asClob: "true | false"}`

`value` is the only required property others will fallback to defaults.

If you want to bind a string as a clob you can add `asClob: true` property to the object.

**Example**: `{value: 'your string', asClob: true, io: 'in'}`

**Parameters**::

- **sql**: `string`, the sql to prepare , include parameter markers (?, ?, ...)

- **params**: `array`, an optional array of values to bind. order of the values in the array must match the order of the desired parameter marker in the sql string.
- **options**: `Object` with config options to set for all parameters. The format can be: `{io: 'in' | 'out' | 'both'}` where `io` can be set to either the `String` `'in'`, `'out'`, or `'both'`. Indicating that the parameter is an input, output, or inout parameter.

**Returns**: `Object` in the format: `{resultSet: [], outputParams: []}` if the Prepared SQL returns result set it is returned as an array of objects or if the Prepared SQL returns output parameters it is returned as an array of objects. 

- If neither were available `null` will be returned indicating that there is no result set or output parameters. Caller should check if `null` is returned.

**Example**: [Here](#markdown-header-prepareexecute)

## DBPool.setConnectionAttribute(attribute)

Sets the connection attribute for each a Connection in the pool.

**Parameters**:

- **attribute**: `Object` in the format {attribute: Number (integer), value: Number (integer) | String}

# **License**
MIT. View [LICENSE](LICENSE)

# **Contributing**
If you would like to contribute please issue a pull request. No document signing is necessary for this project.



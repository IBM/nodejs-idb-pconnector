# idb-pconnector

Promised-based Db2 Connector for IBM i (production-ready as a "technology preview")
The objective of this project is to provide a database connector for Db2 on i that enables usage of the "await" keyword.
As Well As Providing Connection Pooling Support. The `DBPool` has integrated aggregates that make it easier to Prepare & Execute, Prepare, Bind, & Execute, and Quickly Execute SQL. 
## Examples
Simple example of using a prepared statement to insert some values into a table, then querying all contents of that table:

```javascript
const idbp = require('idb-pconnector');
async function runInsertAndSelect() {
   try {
       let statement =  new idbp.Connection().connect().getStatement();
       await statement.prepare('INSERT INTO MYSCHEMA.TABLE VALUES (?,?)');
       await statement.bind([ [2018,idbp.SQL_PARAM_INPUT, idbp.SQL_BIND_NUMERIC],
                           ['Dog' ,idbp.SQL_PARAM_INPUT, idbp.SQL_BIND_CHAR]
       ]);
       await statement.execute();
       let result = await statement.exec('SELECT * FROM MYSCHEMA.TABLE');
       console.log(`Select results: \n${JSON.stringify(result)}`);
   } catch(err) {
       console.log(`Error was: \n${err.stack}`);
   }
}

runInsertAndSelect();

```

Example Using DBPool to attach a connection , execute a stored procedure , and executing a simple select statement. Finally detach the connection.

```javascript
const {DBPool} = require('idb-pconnector');
//set the debug to true to view verbose output call
const pool = new DBPool({}, {debug: true});
//remember to use await you must wrap within async Function.
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

 } catch (err){
   console.log(`Error was: \n\n${err.stack}`);
   pool.retire(connection);
 }
};

poolExample();


```
Example Using DBPool aggregates to Prepare & Execute , Prepare Bind Execute , and Execute a statement.

```javascript
const {DBPool} = require('idb-pconnector');
//optional to set the debug to true to view verbose output call
const pool = new DBPool({}, {debug: true});
//remember to use await you must wrap within async Function.
async function aggregatesRun(){
 //Prepare and execute an SQL statement.
 try {
   console.log('\Prepare and Execute\n');
   let results = await pool.prepareExecute("CALL QIWS.GET_MEMBERS('QIWS','QCUSTCDT')");
    if (results !== null) {
     console.log(`\n\n${JSON.stringify(results)}\n\n`);
   }
   /*
   Params are passed as an array values.
   The order of the params indexed in the array should map to the order of the parameter markers(i.e. '?').
 */
   console.log('\nPrepare Bind & Execute\n');
   let sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE',
     params = [4949, 'Johnson', 'T J', '452 Broadway', 'MSP', 'MN', 9810, 2000, 1, 250, 0.00],
     results2 = await pool.prepareExecute(sql, params);

   if (results2 !== null){
     console.log(`\n\n${JSON.stringify(results2)}\n\n`);
   }
   /*
   Quickly execute a statement by providing the SQL to the runSql() function
   NOTE: Stored Procedures should use the prepareExecute() method instead.
 */
   console.log('\nRun a Query\n');
   let results3 = await pool.runSql(`SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ${params[0]}`);
    if (results3 !== null) {
     console.log(`\n${JSON.stringify(results3)}`);
   }
   console.log('\nDone');

 } catch (err){
   console.log(`Error was: ${err.stack}`);
 }
}
aggregatesRun();


```


# API

# Class: Connection


## Connection.connect(dbname)

Establishes a Connection to the database.

**Parameters**

**dbname**: `string`, the name of the database to connect to. If a name is not specified, the dbname is defaulted to "*LOCAL".

**Returns**: `object`, - the dbConn Object with an established connection.

## Connection.getStatement()

returns a Statement Object initialized to the current dbConn Connection.

**Returns**: `object`, - a new Statement initialized with the current dbconn.

## Connection.close()

closes the Connection to the DB and frees the connection object.

**Returns**: `Promise`, - Promise object represents the closure of the Connection.

## Connection.disconn()

disconnects an existing connection to the database.

**Returns**: `Promise`, - Promise object represents the disconnect of the Connection.

## Connection.debug(choice)

prints more detailed info if choice = true. Turned off by setting choice = false.

**Parameters**

**choice**: `boolean`, the option either true or false to turn on debugging.

**Returns**: `Promise`, - Promise object represents the debug method being set to the choice specified.

## Connection.getConnAttr(attribute)

if connection attribute exists should return type String or Int depending on the attribute type

**Parameters**

**attribute**: `number`, if connection attribute exists should return type String or Int depending on the attribute type

**Returns**: `Promise`, - Promise object represents the the current settings for the specified connection attribute.

**Link**:
[Further Documentation ON Connection Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw\_ibm\_i_73/cli/rzadpfnsconx.htm)
## Connection.setConnAttr(attribute, value)

Sets the ConnAttr , Attribute should be INT.

**Parameters**

**attribute**: `number`, the attribute to be set refer to the getConAttr example to view available attributes.

**value**: `string | number`, the value to set the attribute to. Can be String or Int depending the attribute.

**Returns**: `Promise`, - Promise object represents the execution of the setConnAttr().

### Connection.validStmt(sql)

Checks if the given SQL is valid and interprets vendor escape clauses.

**Parameters**

**sql**: `string`, the sql string to be validated.

**Returns**: `Promise`, - Promise object represents the transformed SQL string that is seen by the data source.

- - -
# Class: Statement


## Statement.bindParam(params)

associates parameter markers in an SQL statement to app variables.

**Parameters**

**params**: `Array`, this should be an Array of the parameter list. Each parameter element will also be an Array with 3 values ( Value, In/out Type ,Indicator ).

**Returns**: `Promise`, - Promise object represents the execution of bindParam().

**Example**:
```js
statement.bindParam([
       [2099, dba.SQL_PARAM_INPUT, dba.SQL_BIND_NUMERIC],
       ['Node.Js', dba.SQL_PARAM_INPUT,dba.SQL_BIND_CHAR]
        ]);
        
       IN/OUT TYPE CAN BE:
           1.SQL_PARAM_INPUT  
           2.SQL_PARAM_OUTPUT
           3.SQL_PARAM_INPUT_OUTPUT
       INDICATORS CAN BE:
           1. SQL_BIND_CLOB
           2. SQL_BIND_CHAR
           3. SQL_BIND_NUMERIC
           4. SQL_BIND_NULL_DATA
```

## Statement.bind(params)

Shorthand for bindParam

**Parameters**

**params**: `Array`, this should be an Array of the parameter list. Each parameter element will also be an Array with 3 values ( Value, In/Out Type ,Indicator ).


## Statement.close()

Ends and frees the statement object.

**Returns**: `Promise`, - Promise object represents the execution of close().

## Statement.closeCursor()

closes the cursor associated with the dbstmt object and discards any pending results.

**Returns**: `Promise`, - Promise object represents the execution of closeCursor().

## Statement.commit()

adds all changes to the database that have been made on the connection since connect time.

**Returns**: `Promise`, - Promise object represents the execution of Commit().

## Statement.exec(sqlString)

performs action of given SQL String. The exec() method does not work with stored procedure calls use execute() instead.

**Parameters**

**sqlString**: `string`, performs action of given SQL String. The exec() method does not work with stored procedure calls use execute() instead.

**Returns**: , the result set as an array.
**Returns**: `Promise`, - Promise object represents the result set from the execution of exec().

## Statement.execute()

Runs a statement that was successfully prepared using prepare().
Use execute() for stored procedure calls.

**Returns**: `Promise`, - Promise object represents the execution of execute().

**Example**:
```js
- Calling a stored Procedure that returns a result set with execute() & displaying the result set.
       
	  try{
    	let idbp = require('idb-pconnector');

    	// note that that calling the new Statement() without the DbConn as a parameter
    	// creates a new connection implicitly and uses that for the Statement.
    	let statement = new idbp.Statement(),
     	  sql = 'CALL MYSCHEMA.SAMPLEPROC';
     	 
    	await statement.prepare(sql);
      await statement.execute();
      //if a result set exists you can fetch it
    	let result = await statement.fetchAll();
    	console.log(`Result is\n: ${JSON.stringify(result)}`);
       }
       catch(error){
    	console.log(error.stack);
        }

- Insert Example With Prepare , Binding Parameter , and Execution
	
	 try {
    	let idbp = require('idb-pconnector');
  
    	// note that that calling the new Statement() without the DbConn as a parameter
    	// creates a new connection implicitly and uses that for the Statement.
     	let statement = new idbp.Statement();
     	
    	await statement.prepare('INSERT INTO MYSCHEMA.MYTABLE VALUES (?,?)');
    	await statement.bind([ [2018,idbp.SQL_PARAM_INPUT,idbp.SQL_BIND_NUMERIC], [null ,idbp.PARM_TYPE_INPUT, idbp.SQL_BIND_NULL_DATA ] ]);
     	await statement.execute();

    	let result = await statement.exec('SELECT * FROM MYSCHEMA.MYTABLE');
    	console.log(`Select results: \nJSON.stringify(result)`);
       }
       catch (error) {
    	console.log(error.stack);
       }
```

## Statement.fetch()

if a result exists , retrieves a row from the result set

**Returns**: `Promise`, - Promise object represents the row that was retrieved from the execution of fetch(). If there is no data to be fetched null will be returned indicating the end of the result set.

```

Example Fetching a result set until there is no more data to fetch.

```javascript
async function fetch(){
  let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    dbConn = new dba.Connection();

  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();

  await dbStmt.prepare(sql);
  await dbStmt.execute();
  let result = await dbStmt.fetch();

  while (result !== null ){
    console.log(`Fetch result:\n ${JSON.stringify(result)}`);
    result = await dbStmt.fetch();
  }
}

fetch();

```

## Statement.fetchAll()

if a result set exists , retrieves all the rows of data from the result set.

**Returns**: `Promise`, - Promise object represents the the an array containing the result that was retrieved from the execution of fetchAll().

## Statement.fieldName(index)

requires an int index parameter. If a valid index is provided, returns the name of the indicated field.

**Parameters**

**index**: `number`, the position of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the String that was retrieved from the execution of fieldName().

## Statement.fieldNullable(index)

requires an int index parameter. If a valid index is provided, returns t/f if the indicated field can be Null

**Parameters**

**index**: `number`, the position of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the boolean that was retrieved from the execution of fieldNullable().

## Statement.fieldPrecise(index)

requires an int index parameter. If a valid index is provided, returns the precision of the indicated field

**Parameters**

**index**: `number`, the position of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldPrecisie().

## Statement.fieldScale(index)

requires an int index parameter. If a valid index is provided, returns the scale of the indicated column

**Parameters**

**index**: `number`, the position of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldScale().

## Statement.fieldType(index)

requires an int index parameter. If a valid index is provided, returns the data type of the indicated field

**Parameters**

**index**: `number`, the position of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldType().

## Statement.fieldWidth(index)

requires an int index parameter. If a valid index is provided, returns the field width of the indicated field

**Parameters**

**index**: `number`, the position of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldWidth().

## Statement.getStmtAttr(attribute)

If a valid Statement attribute is provided , returns the current settings for the specified Statement attribute.
Refer to the list below for valid Statement Attributes.

**Parameters**

**attribute**: `number`, the statement attribute to get

**Returns**: `Promise`, Promise object represents the the String | Number that was retrieved from the execution of getStmtAttr().

**Link**:
[Further Documentaion On Statement Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsstma.htm)
## Statement.nextResult()

Determines whether there is more information available on the statement

**Returns**: `Promise`, - Promise object represents the execution of nextResult().

## Statement.numFields()

if a result is available , retrieves number of fields contained in result.

**Returns**: `Promise`, - Promise object represents the Number returned from the execution of numFields().

## Statement.numRows()

if a query was performed ,retrieves number of rows that were affected by a query

**Returns**: `Promise`, - Promise object represents the Number returned from the execution of numRows().

## Statement.prepare(sqlString)

If valid SQL is provided . prepares SQL and sends it to the DBMS, if the input SQL Statement cannot be prepared error is thrown.

**Parameters**

**sqlString**: `string`, the SQL string to be prepared.

**Returns**: `Promise`, - Promise object represents the the execution of prepare().

**Example**:
```js
- view the examples located at the execute() method.
```

## Statement.rollback()

Reverts changes to the database that have been made on the connection since connect time or the previous call to commit().


## Statement.setStmtAttr(attribute, value)

if a valid attribute and value is provided , sets StmtAttr indicate Attribute. Refer to the example @getStmtAttr for a list of valid Statement Attributes.

**Parameters**

**attribute**: `number`, must be an int INT.

**value**: `string | number`, can String or Int depending on the attribute

**Returns**: `Promise`, - Promise object represents the execution of setStmtAttr().

## Statement.stmtError(hType, recno)

Returns the diagnostic information associated with the most recently called function for a particular statement, connection, or environment handler.

**Parameters**

**hType**: `number`, indicates the handler type of diagnostic information.

**recno**: `number`, indicates which error should be retrieved. The first error record is number 1.

**Returns**: `Promise`, - Promise object represents Number retrieved from the execution of stmtError().

**Example**:
```js
hType can be following values:
 	 SQL_HANDLE_ENV:  Retrieve the environment diagnostic information
	 SQL_HANDLE_DBC:  Retrieve the connection diagnostic information
     SQL_HANDLE_STMT: Retrieve the statement diagnostic information
```

# DBPool API



# Class: DBPool
Manages a list of DBPoolConnection instances.
Constructor to instantiate a new instance of a DBPool class given the `database` and `config`


## Constructor: DBPool(database , config)

**Parameters**

**database**: `object`, Object includes the `url`(database name) defaults to *LOCAL, `username`, and `password`. `username` and `password` assumed blank if not specified with non-local URL.

**config**: `object` , Object includes the `incrementSize` and `debug`. IncrementSize sets the desired size of the DBPool. If none specified, defaults to 8 connections. Setting debug = true will display message logs.


### DBPool.createConnection(index)

Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
Assumes the database of the pool when establishing the connection.

**Parameters**

**index**: `number`, An identifier to id the connection for debug purposes.


### DBPool.detachAll()

Frees all connections in the pool (Sets "Available" back to true for all)
closes any statements and gets a new statement.

**Returns**: `boolean`, - true if all were detached successfully

### DBPool.retireAll()

Retires (Removes) all connections from being used again

**Returns**: `boolean`, - true if all were retired successfully

### DBPool.detach(connection)

Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.

**Parameters**

**connection**: `DBPoolConnection`, Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.


### DBPool.retire(connection)

Retires a connection from being used and removes it from the pool

**Parameters**

**connection**: `DBPoolConnection`, Retires a connection from being used and removes it from the pool


### DBPool.attach()

Finds and returns the first available Connection.

**Returns**: `DBPoolConnection`, - one connection from the DBPool.



### DBPool.runSql(sql)

Shorthand to exec a statement , just provide the sql to run.

**Parameters**

**sql**: `string`, the sql statement to execute.

**Returns**: `array`, - if the SQL returns a result set it is returned as an array of objects.
else if no result set is available null is returned. caller should check if null is returned.

### DBPool.prepareExecute(sql, params)

Shortcut to prepare ,bind, and execute. Just provide the sql and the params as an array.

**Parameters**

**sql**: `string`, the sql to prepare , include parameter markers (?, ?, ...)

**params**: `array`, an optional array of values to bind. order of the values in the array must match the
order of the desired parameter marker in the sql string.

**Returns**: `array`, - if the Prepared SQL returns result set it is returned as an array of objects.
else null will be returned indicating that there is no result set.


* * *
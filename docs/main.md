
# Global

### Global.makeBool(data) 

helper method to convert 0 or 1 recieved from idb-connector to javascript boolean.

**Parameters**

**data**: `any`, the input data to be checked before returning.

**Returns**: , - false if the input data was 0 , true if the input data is 1 , if the data was something else return the data.

### Global.isInt(data) 

helper mthod to determine if the type of data is an integer.

**Parameters**

**data**: `any`, the input data to be tested.

**Returns**: `boolean`, - true if the data is of type number otherwise returns false.




* * *

# Class: Connection


## Connection.connect(dbname) 

Establishes a Connection to the database.

**Parameters**

**dbname**: `string`, the name of the database to connect to. If a name is not specified, the dbname is defaulted to "*LOCAL".

**Returns**: `object`, - the dbConn Object with an established connection.

## Connection.getStatement() 

returns a Statment Object intialized to the current dbConn Conection.

**Returns**: `object`, - a new Statement intialized with the current dbconn.

## Connection.close() 

closes the Connection to the DB and frees the connection object.

**Returns**: `Promise`, - Promise object represents the closure of the Connection.

## Connection.disconn() 

disconnects an exsisting connection to the datbase.

**Returns**: `Promise`, - Promise object represents the disconnect of the Connection.

## Connection.debug(choice) 

prints more detailed info if choice = true. Turned off by setting choice = false.

**Parameters**

**choice**: `boolean`, the option either true or false to turn on debugging.

**Returns**: `Promise`, - Promise object represents the debug method being set to the choice specified.

## Connection.getConnAttr(attribute) 

if connection attribute exsits should return type String or Int depending on the attribute type

**Parameters**

**attribute**: `number`, if connection attribute exsits should return type String or Int depending on the attribute type

**Returns**: `Promise`, - Promise object represents the the current settings for the specified connection attribute.

**Example**:
```js
Available Set & Get Connection Attributes:
		SQL_ATTR_2ND_LEVEL_TEXT
		SQL_ATTR_AUTOCOMMIT
		SQL_ATTR_CONCURRENT_ACCESS_RESOLUTION
		SQL_ATTR_CONN_SORT_SEQUENCE 
		SQL_ATTR_COMMIT
		SQL_ATTR_DBC_DEFAULT_LIB
		SQL_ATTR_DECFLOAT_ROUNDING_MODE
		SQL_ATTR_DECIMAL_SEP
		SQL_ATTR_EXTENDED_COL_INFO
		SQL_ATTR_EXTENDED_INDICATORS
		SQL_ATTR_FREE_LOCATORS
		SQL_ATTR_HEX_LITERALS
		SQL_ATTR_INFO_ACCTSTR
		SQL_ATTR_INFO_APPLNAME
		SQL_ATTR_INFO_PROGRAMID
		SQL_ATTR_INFO_USERID
		SQL_ATTR_INFO_WRKSTNNAME
		SQL_ATTR_MAX_PRECISION
		SQL_ATTR_MAX_SCALE
		SQL_ATTR_MIN_DIVIDE_SCALE
		SQL_ATTR_OLD_MTADTA_BEHAVIOR
		SQL_ATTR_NULLT_ARRAY_RESULTS
		SQL_ATTR_NULLT_OUTPUT_PARMS
		SQL_ATTR_QUERY_OPTIMIZE_GOAL
		SQL_ATTR_SAVEPOINT_NAME
		SQL_ATTR_TIME_FMT
		SQL_ATTR_TIME_SEP
		SQL_ATTR_TIMESTAMP_PREC
		SQL_ATTR_TXN_EXTERNAL
		SQL_ATTR_TXN_INFO
		SQL_ATTR_UCS2	
```
[Further Documentaion ON Connection Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw\_ibm\_i_73/cli/rzadpfnsconx.htm)
## Connection.setConnAttr(attribute, value) 

Sets the ConnAttr , Attrubte should be INT.

**Parameters**

**attribute**: `number`, the attribute to be set refer to the getConAttr example to view available attributes.

**value**: `string | number`, the value to set the attribute to. Can be String or Int depending the attribute.

**Returns**: `Promise`, - Promise object represents the execution of the setConnAttr().

### Connection.validStmt(sql) 

Checks if the given SQL is valid and nterprets vendor escape clauses.

**Parameters**

**sql**: `string`, the sql string to be validated.

**Returns**: `Promise`, - Promise object represents the transformed SQL string that is seen by the data source.


# Class: Statement


## Statement.bindParam(params) 

associates parameter markers in an SQL statement to app variables.

**Parameters**

**params**: `Array`, this should be an Array of the parameter list. Each parameter element will also be an Array with 3 values ( Value, In/out Type ,Indicator ).

**Returns**: `Promise`, - Promise object represents the execution of bindParam().

**Example**:
```js
bStmt.bindParam([
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
**Returns**: `Promise`, - Promise object represents the result set from the exection of exec().

## Statement.execute() 

Runs a statement that was successfully prepared using prepare().
Use execute() for stored procedure calls.

**Returns**: `Promise`, - Promise object represents the execution of execute().

**Example**:
```js
- Calling a stored Procedure that returns a result set with execute() & displaying the result set.
		 
	 	try{
		  var dba = require("idb-pconnector");

		  // note that that calling the new Statement() without the DbConn as a parameter 
		  // creates a new connection automatically and uses that for the Statment.
		  var dbStmt = new dba.Statement();
		  var sql = "call QIWS.sampleProc";
		  await dbStmt.prepare(sql);
		  await dbStmt.execute();
		  var res = await dbStmt.fetchAll();
		  console.log(`Result is\n: ${JSON.stringify(res)}`);
		}
		catch(dbError){
		  console.log(dbError.stack);
		},- Insert Example With Prepare , Binding Parameter , and Execution
	   
	   try {
		  var dba = require("idb-pconnector");
	
		  // note that that calling the new Statement() without the DbConn as a parameter 
		  // creates a new connection automatically and uses that for the Statment. 
		  var dbStmt = new dba.Statement();
		  await dbStmt.prepare("INSERT INTO AMUSSE.TABLE1 VALUES (?,?)");
		  await dbStmt.bind([ [2018,dba.SQL_PARAM_INPUT,dba.SQL_BIND_NUMERIC], [ ,dba.PARM_TYPE_INPUT, dba.SQL_BIND_NULL_DATA ] ]);
		  await dbStmt.execute();
		  var res = await dbStmt.exec("SELECT * FROM AMUSSE.TABLE1");
		  console.log("Select results: "+JSON.stringify(res));
		} 
		catch (dbError) {
		  console.log("Error is " + dbError);
		  console.log(error.stack);
		}
```

**Example**:
```js
- Calling a stored Procedure that returns a result set with execute() & displaying the result set.
		 
	 	try{
		  var dba = require("idb-pconnector");

		  // note that that calling the new Statement() without the DbConn as a parameter 
		  // creates a new connection automatically and uses that for the Statment.
		  var dbStmt = new dba.Statement();
		  var sql = "call QIWS.sampleProc";
		  await dbStmt.prepare(sql);
		  await dbStmt.execute();
		  var res = await dbStmt.fetchAll();
		  console.log(`Result is\n: ${JSON.stringify(res)}`);
		}
		catch(dbError){
		  console.log(dbError.stack);
		},- Insert Example With Prepare , Binding Parameter , and Execution
	   
	   try {
		  var dba = require("idb-pconnector");
	
		  // note that that calling the new Statement() without the DbConn as a parameter 
		  // creates a new connection automatically and uses that for the Statment. 
		  var dbStmt = new dba.Statement();
		  await dbStmt.prepare("INSERT INTO AMUSSE.TABLE1 VALUES (?,?)");
		  await dbStmt.bind([ [2018,dba.SQL_PARAM_INPUT,dba.SQL_BIND_NUMERIC], [ ,dba.PARM_TYPE_INPUT, dba.SQL_BIND_NULL_DATA ] ]);
		  await dbStmt.execute();
		  var res = await dbStmt.exec("SELECT * FROM AMUSSE.TABLE1");
		  console.log("Select results: "+JSON.stringify(res));
		} 
		catch (dbError) {
		  console.log("Error is " + dbError);
		  console.log(error.stack);
		}
```

## Statement.fetch() 

if a result exsits , retrieves a row from the result set

**Returns**: `Promise`, - Promise object represents the row that was retrieved from the execution of fetch().

## Statement.fetchAll() 

if a result set exsits , retrieves all the rows of data from the result set.

**Returns**: `Promise`, - Promise object represents the the an array containing the result that was retrieved from the execution of fetchAll().

## Statement.fieldName(index) 

requires an int index parameter. If a valid index is provided, returns the name of the indicated field.

**Parameters**

**index**: `number`, the postion of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the String that was retrieved from the execution of fieldName().

## Statement.fieldNullable(index) 

requires an int index parameter. If a valid index is provided, returns t/f if the indicated field can be Null

**Parameters**

**index**: `number`, the postion of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the boolean that was retrieved from the execution of fieldNullable().

## Statement.fieldPrecise(index) 

requires an int index parameter. If a valid index is provided, returns the precision of the indicated field

**Parameters**

**index**: `number`, the postion of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldPrecisie().

## Statement.fieldScale(index) 

requires an int index parameter. If a valid index is provided, returns the scale of the indicated column

**Parameters**

**index**: `number`, the postion of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldScale().

## Statement.fieldType(index) 

requires an int index parameter. If a valid index is provided, returns the data type of the indicated field

**Parameters**

**index**: `number`, the postion of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldType().

## Statement.fieldWidth(index) 

requires an int index parameter. If a valid index is provided, returns the field width of the indicated field

**Parameters**

**index**: `number`, the postion of the field within the table. It is 0 based.

**Returns**: `Promise`, - Promise object represents the the Number that was retrieved from the execution of fieldWidth().

## Statement.getStmtAttr(attribute) 

If a valid Statment attribute is provided , returns the current settings for the specified Statement attribute.
Refer to the list below for valid Statement Attributes.

**Parameters**

**attribute**: `number`, the statement attribute to get

**Returns**: `Promise`, Promise object represents the the String | Number that was retrieved from the execution of getStmtAttr().

**Example**:
```js
Available Set & Get Statement Attributes
	 	SQL_ATTR_APP_PARAM_DESC
	   	SQL_ATTR_APP_ROW_DESC
		SQL_ATTR_BIND_TYPE
		SQL_ATTR_CURSOR_HOLD
		SQL_ATTR_CURSOR_SCROLLABLE
		SQL_ATTR_CURSOR_SENSITIVITY 
		SQL_ATTR_CURSOR_TYPE
		SQL_ATTR_EXTENDED_COL_INFO
		SQL_ATTR_FOR_FETCH_ONLY
		SQL_ATTR_FULL_OPEN
		SQL_ATTR_NUMBER_RESULTSET_ROWS_PTR
		SQL_ATTR_PARAM_BIND_TYPE
		SQL_ATTR_PARAM_STATUS_PTR
		SQL_ATTR_PARAMS_PROCESSED_PTR
		SQL_ATTR_PARAMSET_SIZE
		SQL_ATTR_ROW_BIND_TYPE
		SQL_ATTR_ROW_STATUS_PTR
		SQL_ATTR_ROWS_FETCHED_PTR
		SQL_ATTR_ROWSET_SIZE
```
[Further Documentaion On Statement Attributes](https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_73/cli/rzadpfnsstma.htm)
## Statement.nextResult() 

Determines whether there is more information available on the statement

**Returns**: `Promise`, - Promise object represents the execution of nextResult().

## Statement.numFields() 

if a result is available , retrieves number of fields contained in result.

**Returns**: `Promise`, - Promise object represents the Number returned from the execution of numFields().

## Statement.numRows() 

if a query was performed ,retrieves number of rows that were effected by a query

**Returns**: `Promise`, - Promise object represents the Number returned from the execution of numRows().

## Statement.prepare(sqlString) 

If valid SQL is provided . prepares SQL and sends it to the DBMS, if the input SQL Statement cannot be prepared error is thrown.

**Parameters**

**sqlString**: `string`, the SQL string to be prepared.

**Returns**: `Promise`, - Promise object represents the the execution of prepare().

**Example**:
```js
- view the examples located at the excute() method.
```

## Statement.rollback() 

Reverts changes to the database that have been made on the connection since connect time or the previous call to commit().


## Statement.setStmtAttr(attribute, value) 

if a valid attribute and value is providied , sets StmtAttr indicate Attrubte. Refer to the example @getStmtAttr for a list of valid Statement Attributes.

**Parameters**

**attribute**: `number`, musbt be an int INT.

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
SQL_HANDLE_ENV:Retrieve the environment diagnostic information
	   SQL_HANDLE_DBC:Retrieve the connection diagnostic information
       SQL_HANDLE_STMT:Retrieve the statement diagnostic information 
```

* * *











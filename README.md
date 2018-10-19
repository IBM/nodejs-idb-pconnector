# **idb-pconnector - Promise based DB2 Connector for IBM i**

**Project Status**: (production-ready as a "technology preview")

The objective of this project is to provide a promise based database connector API for DB2 on IBM i.


This project is a wrapper over the [`idb-connector`](https://bitbucket.org/litmis/nodejs-idb-connector) project but returning promises instead of using callbacks.


Connection Pooling is supported by using the `DBPool` class giving you better control.


The `DBPool` class includes integrated aggregates (prepareExecute, runSql), which make it easier to Prepare & Execute & directly Execute SQL. 


Using Node version ^8.X.X you can take advantage of `async` & `await` keywords when working with `promises`. 


***NOTE***: to use the `await` keyword your code must be wrapped within an `async function`.


# **Install**
This project is a Node.js module available through npm (node package manager).

Once you have Node.js installed, you can run the following command: 

`npm install idb-pconnector`

***NOTE***: `idb-pconnector` currently only supports IBM i installation

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
const {Connection} = idbp;

async function pbeExample() {
  try {
    let statement =  new Connection().connect().getStatement();

    await statement.prepare('INSERT INTO MYSCHEMA.TABLE VALUES (?,?)');

    await statement.bindParam([
      [2018, idbp.IN, idbp.INT],
      ['example', idbp.IN, idbp.CHAR]
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

***NOTE***: This method will not work with stored procedures use prepareExecute() instead.


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

Please refer to the [documentation](https://bitbucket.org/litmis/nodejs-idb-pconnector/src/master/docs/README.md) for usage of the `idb-pconnector`.

# **License**
MIT. View [LICENSE](https://bitbucket.org/litmis/nodejs-idb-pconnector/src/master/LICENSE)

# **Contributing**
If you would like to contribute please append your **name** and **email** to the `AUTHORS.md` file along with your PR.

No document signing is necessary for this project.

# **idb-pconnector - Promise based DB2 Connector for IBM i** <!-- omit in toc -->

**Project Status**: (production ready as a "technology preview")

**Objective**: provide a promise based database connector for DB2 on IBM i.


This project is a promise based wrapper over the [`idb-connector`](https://bitbucket.org/litmis/nodejs-idb-connector) project.


Connection Pooling is supported by using the `DBPool` class.

The `DBPool` class includes integrated aggregates (runSql and prepareExecute),

which make it easier to directly execute a query or prepare, bind, and execute.

# **Table of Contents** <!-- omit in toc -->
- [**Install**](#install)
- [**Examples**](#examples)
    - [exec](#exec)
    - [prepare bind execute](#prepare-bind-execute)
    - [DBPool](#dbpool)
    - [prepareExecute](#prepareexecute)
    - [runSql](#runsql)
- [**Documentation**](#documentation)
- [**License**](#license)
- [**Contributing**](#contributing)


# **Install**
This project is a Node.js module available through npm (node package manager).

`npm install idb-pconnector`

***NOTE*** 

`idb-pconnector` currently only supports IBM i installation

# **Examples**

### exec
Using Async & Await, to run a select statement & displaying the result set:


```javascript
const { Connection, Statement, } = require('idb-pconnector');

async function execExample() {
  const connection = new Connection({ url: '*LOCAL' });
  const statement = new Statement(connection);

  const results = await statement.exec('SELECT * FROM QIWS.QCUSTCDT');

  console.log(`results:\n ${JSON.stringify(results)}`);
}

execExample().catch((error) => {
  console.error(error);
});

```
### prepare bind execute
Using Async & Await, to prepare, bind, and execute an insert statement:

```javascript
const {
  Connection, Statement, IN, NUMERIC, CHAR,
} = require('idb-pconnector');

async function pbeExample() {
  const connection = new Connection({ url: '*LOCAL' });

  const statement = new Statement(connection);

  const sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';

  await statement.prepare(sql);

  await statement.bindParam([
    [9997, IN, NUMERIC],
    ['Johnson', IN, CHAR],
    ['A J', IN, CHAR],
    ['453 Example', IN, CHAR],
    ['Fort', IN, CHAR],
    ['TN', IN, CHAR],
    [37211, IN, NUMERIC],
    [1000, IN, NUMERIC],
    [1, IN, NUMERIC],
    [150, IN, NUMERIC],
    [0.00, IN, NUMERIC],
  ]);

  await statement.execute();
}

pbeExample().catch((error) => {
  console.error(error);
});

```
### DBPool

Using DBPool to attach a connection , execute a stored procedure , and finally detach the connection.

```javascript
const { DBPool } = require('idb-pconnector');

async function poolExample() {
  const pool = new DBPool({ url: '*LOCAL' });
  const connection = pool.attach();
  const statement = connection.getStatement();

  await statement.prepare('CALL QSYS2.TCPIP_INFO()');
  await statement.execute();

  const results = await statement.fetchAll();

  if (results) {
    console.log(`results:\n ${JSON.stringify(results)}`);
  }
  await pool.detach(connection);
}

poolExample().catch((error) => {
  console.error(error);
});

```
### prepareExecute

Example Using DBPool prepareExecute(sql,params,options) method to Prepare and Execute a statement.

If you want to bind variables pass an array of values as the second parameter.


```javascript
const { DBPool } = require('idb-pconnector');

async function prepareExecuteExample() {
  /*
   * Prepare and execute an SQL statement.
   * Params are passed as an array values.
   * The order of the params indexed in the array
   * should map to the order of the parameter markers
   */
  const pool = new DBPool({ url: '*LOCAL' });

  const sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';

  const params = [4949, 'Johnson', 'T J', '452 Broadway', 'MSP', 'MN',
    9810, 2000, 1, 250, 0.00];

  await pool.prepareExecute(sql, params);
}

prepareExecuteExample().catch((error) => {
  console.error(error);
});
```
### runSql

Example Using DBPool runSql(sql) method to directly run an sql statement.

***NOTE*** This method will not work with stored procedures use prepareExecute() instead.


```javascript
const { DBPool } = require('idb-pconnector');

async function runSqlExample() {
  /*
   * Directly execute a statement by providing the SQL to the runSql() function.
   */
  const pool = new DBPool({ url: '*LOCAL' });

  const results = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');

  if (results) {
    console.log(`results:\n ${JSON.stringify(results)}`);
  }
}

runSqlExample().catch((error) => {
  console.error(error);
});

```

# **Documentation**

Please refer to [docs](https://github.com/IBM/nodejs-idb-pconnector/blob/master/docs/README.md) for usage.

# **License**
MIT - View [LICENSE](https://github.com/IBM/nodejs-idb-pconnector/blob/master/LICENSE)

# **Contributing**
Please read the [contribution guidelines](https://github.com/IBM/nodejs-idb-pconnector/blob/master/CONTRIBUTING.md).



# **idb-pconnector - Promise-based DB2 Connector for IBM i** <!-- omit in toc -->

**Project Status**: (production ready as a "technology preview")

**Objective**: provide a promise-based database connector for DB2 on IBM i.

This project is a promise-based wrapper over the [`idb-connector`](https://github.com/IBM/nodejs-idb-connector) project that enables the use of modern JavaScript's [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax.

Connection Pooling is supported by using the `DBPool` class.

The `DBPool` class includes integrated aggregates (runSql and prepareExecute) to simplify your code.

# **Table of Contents** <!-- omit in toc -->
- [**Install**](#install)
- [**Examples**](#examples)
    - [exec](#exec)
    - [prepare bind execute](#prepare-bind-execute)
    - [DBPool](#dbpool)
    - [prepareExecute](#prepareexecute)
    - [runSql](#runsql)
    - [setLibraryList](#setlibrarylist)
- [**Documentation**](#documentation)
- [**License**](#license)
- [**Contributing**](#contributing)


# **Install**

`npm install idb-pconnector`

**NOTE**

This package only installs on IBM i systems.

# **Examples**

### exec
Using `exec` method to run a select statement and return the result set:

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
Using `prepare`, `bind`, and `execute` methods to insert data:

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

Using `DBPool` to return a connection then call a stored procedure:

```javascript
const { DBPool } = require('idb-pconnector');

async function poolExample() {
  const pool = new DBPool();

  const connection = pool.attach();

  const statement = connection.getStatement();

  const sql = `CALL QSYS2.SET_PASE_SHELL_INFO('*CURRENT', '/QOpenSys/pkgs/bin/bash')`

  await statement.prepare(sql);
  await statement.execute();

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

Using `prepareExecute` method to insert data:

```javascript
const { DBPool } = require('idb-pconnector');

async function prepareExecuteExample() {
  /*
   * Prepare and execute an SQL statement.
   * Params are passed as an array values.
   * The order of the params indexed in the array
   * should map to the order of the parameter markers
   */
  const pool = new DBPool();

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

Using `runSql` method to directly execute a select statement:

**NOTE**

This method will not work with stored procedures use prepareExecute() instead.


```javascript
const { DBPool } = require('idb-pconnector');

async function runSqlExample() {
  /*
   * Directly execute a statement by providing the SQL to the runSql() function.
   */
  const pool = new DBPool();

  const results = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');

  if (results) {
    console.log(`results:\n ${JSON.stringify(results)}`);
  }
}

runSqlExample().catch((error) => {
  console.error(error);
});

```

### setLibraryList

Change to system naming and set the library list (using `CHGLIBL`) of the connection.

```javascript
async function execExample() {
  const connection = new Connection({ url: '*LOCAL' });

  await connection.setLibraryList(['QIWS']);

  const statement = connection.getStatement();
  const results = await statement.exec('SELECT * FROM QCUSTCDT');
  console.log(`results:\n ${JSON.stringify(results)}`);

  await statement.close();
}
```

# **Documentation**

Please read the [docs](https://github.com/IBM/nodejs-idb-pconnector/blob/master/docs/README.md).

# **License**
[MIT](https://github.com/IBM/nodejs-idb-pconnector/blob/master/LICENSE)
# **Contributing**
Please read the [contribution guidelines](https://github.com/IBM/nodejs-idb-pconnector/blob/master/CONTRIBUTING.md).



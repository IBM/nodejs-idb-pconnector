[![npm](https://img.shields.io/npm/v/idb-pconnector?logo=npm)](https://www.npmjs.com/package/idb-pconnector)
[![ryver-chat](https://img.shields.io/badge/Ryver-Chat-blue)](https://ibmioss.ryver.com/index.html#forums/1000127)
[![ryver-signup](https://img.shields.io/badge/Ryver-Signup-blue)](https://ibmioss.ryver.com/application/signup/members/9tJsXDG7_iSSi1Q)
[![docs](https://img.shields.io/badge/-Docs-blue)](https://github.com/IBM/nodejs-idb-pconnector/blob/master/docs/README.md)

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
      - [insert example](#insert-example)
      - [select example](#select-example)
    - [DBPool](#dbpool)
    - [prepareExecute](#prepareexecute)
    - [runSql](#runsql)
    - [setLibraryList](#setlibrarylist)
- [**Documentation**](#documentation)
- [**License**](#license)
- [**Contributing**](#contributing)
- [**Release**](#release)


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

#### insert example
```javascript
const {
  Connection, Statement, IN, NUMERIC, CHAR,
} = require('idb-pconnector');

async function pbeExample() {
  const connection = new Connection({ url: '*LOCAL' });
  const statement = new Statement(connection);
  const sql = 'INSERT INTO US_STATES(id, name, abbr, region) VALUES (?,?,?,?)';

  await statement.prepare(sql);
  await statement.bindParameters([1, 'Alabama', 'AL' ,'south']);
  await statement.execute();
}

pbeExample().catch((error) => {
  console.error(error);
});

```

#### select example
```javascript
const {
  Connection, Statement, IN, CHAR,
} = require('idb-pconnector');

async function pbeExample() {
  const connection = new Connection({ url: '*LOCAL' });
  const statement = new Statement(connection);
  const sql = 'SELECT * FROM QIWS.QCUSTCDT WHERE CITY = ? AND STATE = ?';

  await statement.prepare(sql);
  await statement.bindParameters(['Dallas','TX']);
  await statement.execute();
  
  let resultSet = await statement.fetchAll();
  
  console.log(resultSet) // array with response
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
const { Connection } = require('idb-pconnector');

async function setLibListExample() {
  const connection = new Connection({ url: '*LOCAL' });

  await connection.setLibraryList(['QIWS', 'QXMLSERV']);

  const statement = connection.getStatement();
  const results = await statement.exec('SELECT * FROM QCUSTCDT');
  console.log(`results:\n ${JSON.stringify(results)}`);
  await statement.close();
}

setLibListExample().catch((error) => {
  console.error(error);
});
```

# **Documentation**

Please read the [docs](https://github.com/IBM/nodejs-idb-pconnector/blob/master/docs/README.md).

# **License**
[MIT](https://github.com/IBM/nodejs-idb-pconnector/blob/master/LICENSE)
# **Contributing**
Please read the [contribution guidelines](https://github.com/IBM/nodejs-idb-pconnector/blob/master/CONTRIBUTING.md).


# **Release**

To generate a release use one of the npm scripts:

- patch release `npm run release`
- minor version release `npm run release-minor`
- major version release `npm run release-major`

These scripts will bump the version number, make a release commit, and tag the release.

Once the tag is created, create a github release manually using the appropriate tag.

After the release is published the [publish action](https://github.com/IBM/nodejs-idb-pconnector/blob/a4154bacf8e327e242c2d44e312079aea0690d8f/.github/workflows/publish.yml#L1) will publish to npm. 


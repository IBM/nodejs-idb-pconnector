/**
 * Temporary sanity tests to verify operations perform as desired.
 * Was created Because Mocha was reporting that the Async Tests within
 * statementTest.js were taking longer than 2000ms
 * These test cases were made to check the actual time taken.
 * All were took less than 2000 ms.
 * see mocha-issue.txt for more info.
 * Comment out the function calls and run node to try for yourself.
*/

const dba = require('../lib/idb-pconnector');
const idbp = require('../lib/idb-pconnector');
const connPool = new idbp.DBPool();
const expect = require('chai').expect;

async function exec() {
  let sql = 'SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = 938472',
    dbConn = new dba.Connection();

  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();

  console.time('exec');
  let result = await dbStmt.exec(sql);
  console.timeEnd('exec');

  expect(result).to.be.an('array');
  expect(result.length).to.be.greaterThan(0);
  console.log(`Exec results: ${JSON.stringify(result)}`);

}

//exec();

async function execute(){
  let sql = 'CALL AMUSSE.MAXBAL(?)',
    dbConn = new dba.Connection(),
    bal = 0;

  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();
  console.time('execute');
  await dbStmt.prepare(sql);
  await dbStmt.bind([[bal, dba.SQL_PARAM_OUT, dba.SQL_NUMERIC]]);
  let result = await dbStmt.execute();
  console.timeEnd('execute');

  expect(result).to.be.a('array');
  expect(result.length).to.be.greaterThan(0);

  console.log(`ExecuteAsync results:\n ${JSON.stringify(result)}`);
  console.log(`Length of results: ${result.length}`);

}

//execute();

async function fetchAll(){
  console.log('\nFetchAll Test Case\n');
  let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    dbConn = new dba.Connection();

  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();
  console.time('fetchAll');
  await dbStmt.prepare(sql);
  await dbStmt.execute();
  let result = await dbStmt.fetchAll();
  console.timeEnd('fetchAll');

  expect(result).to.be.a('array');
  expect(result.length).to.be.greaterThan(0);

  console.log(`Fetch All results:\n ${JSON.stringify(result)}`);
  console.log(`Size of the returned array: ${result.length}`);
}
//fetchAll();

async function fetch(){
  let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    dbConn = new dba.Connection();
  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();

  console.time('fetch');
  await dbStmt.prepare(sql);
  await dbStmt.execute();
  let result = await dbStmt.fetch();
  console.timeEnd('fetch');
  expect(result).to.be.a('object');

  while (result !== null ){
    console.log(`Fetch result:\n ${JSON.stringify(result)}`);
    result = await dbStmt.fetch();
  }
}

//fetch();


//////////////////////////////////////
///        DBPool Test             ///
//////////////////////////////////////

async function prepareExecute(){
  console.time('prepareExecute');
  let cusNum = 938472,
    results = await connPool.prepareExecute('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [cusNum]);

  console.timeEnd('prepareExecute');
  expect(results).to.be.an('array');
  expect(results.length).to.be.gt(0);
  console.log(`PrepareExecute Results: \n${JSON.stringify(results)}`);
}
//prepareExecute();

async function runSql(){
  console.time('runSql');
  let results = await connPool.runSql('SELECT * FROM QIWS.QCUSTCDT');

  console.timeEnd('runSql');
  console.log(`RunSQL Results: \n${JSON.stringify(results)}`);
  expect(results).to.be.an('array');
  expect(results.length).to.be.gt(0);
}
//runSql();

async function detach(){
  //get the conn
  let conn =  await connPool.attach();
  //perform some stmts
  await conn.getStatement().exec('SELECT * FROM QIWS.QCUSTCDT');
  console.log(`\n${JSON.stringify(conn)}`);

  let stmtBefore = conn.statement,
    id = conn.poolIndex;
  await conn.detach();

  let detached = connPool.connections[id],
    stmtAfter = detached.statement;

  //after being detached available should be true again
  expect(detached.available).to.be.true;
  //make sure the statement was cleared
  expect(stmtBefore).to.not.equal(stmtAfter);
  await connPool.detach(conn);
}
//detach();



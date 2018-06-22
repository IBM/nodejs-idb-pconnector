/**
 * A temporary sanity tests to make sure operations perform as desired.
 * Was created Because Mocha was reporting that the Async Tests within 
 * statementTest.js were taking longer than 2000ms
 * These test cases were made to check the actual time taken.
 * All were took less than 2000 ms.
 * Comment out the function calls and run node to try for yourself.
*/

const dba = require('../lib/idb-pconnector');
const idbp = require('../lib/idb-pconnector');
const connPool = new idbp.DBPool({}, {debug: true});
const DBPoolConnection = require('../lib/dbPool.js').DBPoolConnection;
const expect = require('chai').expect;

async function exec() {
  let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    dbConn = new dba.Connection();

  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();

  console.time('exec');
  let res = await dbStmt.exec(sql);

  console.log('Type of Res = ' + typeof res);
  console.log('Select results: ' + JSON.stringify(res));
  console.timeEnd('exec');
}

// exec();

async function fetchAll(){
  console.log('\nFetchAll Test Case\n');
  let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    dbConn = new dba.Connection();
  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement();
  dbStmt.dbc.debug(true);
  let bal = 0;
  try {
    console.time('fetchAll');
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let result = await dbStmt.fetchAll();
    console.timeEnd('fetchAll');
    console.log(`Fetch All results:\n ${JSON.stringify(result)}`);
    console.log(`Size of the returned array: ${result.length}`);
  } catch (error){
    console.error(error.stack);
  }
}
// fetchAll();

async function fetch(){
  console.log('\n**********************************************************\n');
  console.log('\nFetch Test Case\n');
  let sql = 'SELECT * FROM QIWS.QCUSTCDT',
    dbConn = new dba.Connection();
  dbConn.debug(true);
  let dbStmt = dbConn.connect().getStatement(),
    bal = 0;
  dbStmt.dbc.debug(true);

  try {
    console.time('fetch');
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let result = await dbStmt.fetch();
    console.timeEnd('fetch');
    console.log(`Fetch result:\n ${JSON.stringify(result)}`);
    console.log(`Size of the returned array: ${result.length}`);
  } catch (error){
    console.error(error.stack);
  }
}

// fetch();


async function execute(){
  console.log('\nExecute Test Case\n');
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

  console.log(`ExecuteAsync results:\n ${JSON.stringify(result)}`);
  console.log(`TypeOf ExecuteAsync results: ${typeof (result)}`);
  console.log(`Length of results: ${result.length}`);
}
//////////////////////////////////////
///        DBPool Test             ///
//////////////////////////////////////

async function prepareExecute(){
  console.time('prepareExecute');
  let cusNum = 938472,
    results = await connPool.prepareExecute('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [cusNum]);
  console.timeEnd('prepareExecute');
  console.log(results);
  expect(results).to.be.an('array') && expect(results.length).to.be.gt(0) || expect(result).to.be.null;
}
prepareExecute();

async function runSql(){
  console.time('runSql');
  let results = await connPool.runSql('SELECT * FROM QIWS.QCUSTCDT');
  console.timeEnd('runSql');
  expect(results).to.be.an('array') && expect(results.length).to.be.gt(0) || expect(result.to.be.null);
}

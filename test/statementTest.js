/*
* This is the test case document for the idb-pconnector
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -- --grep name_of_test

* Update 6-21-18 Methods such as: Exec, Prepare, Bind, Execute, Fetch , FetchAll
* were adjusted from Sync to Async.
* Figuring out The way Mocha handles Async Promises Test Cases are still a work in progress.

* When using async/await & not wrapping the test code in a new Promises timeouts would occur,
* Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.
* This Error is false because Tests in manualTest.js show that time taken by each test case <2000 ms.

* When wrapping the test code in a new promise, Assertion Errors Are not being passed up to actually Fail
* the tests , therefore a Falsly Passing Test may occur.
* On Node version 8 an Unhandled Promise Rejection is printed to the console.
* See mocha-issue.txt for more detailed information.
*
*/
const assert = require('chai').assert;
const expect = require('chai').expect;
const dba = require('../lib/idb-pconnector');
const util = require('util');

//Test Statement Class

// //if successful returns undefined
describe('prepare', () => {
  it('Prepares valid SQL and sends it to the DBMS, if the input SQL Statement cannot be prepared error is returned. ', async (done) =>{
    new Promise(async function(resolve, reject){
      dbConn = new dba.Connection();
      dbConn.debug(true);
      let dbStmt = dbConn.connect().getStatement(),
        sql = 'SELECT * FROM QIWS.QCUSTCDT';

      result = await dbStmt.prepare(sql);
      console.log(`Result is: ${result}`);
      expect(result).to.be.a('undefined');
    });
    done();
  });
});

//if successful returns undefined.
describe('bindParams', () => {
  it('associate parameter markers in an SQL statement to app variables', async (done) => {
    new Promise(async (resolve, reject) => {
      let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ',
        dbStmt = new dba.Connection().connect().getStatement(),
        dbStmt2 = new dba.Connection().connect().getStatement();

      let countResult = await dbStmt2.exec('SELECT COUNT(CUSNUM) AS COUNT FROM QIWS.QCUSTCDT'),
        rowsBeforeCount = Number.parseInt(countResult[0].COUNT);

      await dbStmt.prepare(sql);
      await dbStmt.bindParam([
        [9997, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CUSNUM
        ['Doe', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //LASTNAME
        ['J D', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //INITIAL
        ['123 Broadway', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //ADDRESS
        ['Hope', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //CITY
        ['WA', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //STATE
        [98101, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //ZIP
        [2000, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CREDIT LIMIT
        [1, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], // change
        [250, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //BAL DUE
        [0.00, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC] //CREDIT DUE
      ]);
      await dbStmt.execute();

      let countResult2 = await dbStmt.exec('SELECT COUNT(CUSNUM) AS COUNT FROM QIWS.QCUSTCDT'),
        rowsBeforeCount2 = Number.parseInt(countResult2[0].COUNT);
      expect(rowsBeforeCount2).to.equal(rowsBeforeCount + 1);
    });
    done();
  });
});

//would be the exact same test as BindParam
// describe('bind', () => {
//   it('shorthand for the bindParams()', async () => {
//   });
// });

//if successful returns undefined
describe('close', () => {
  it('frees the statement object. ', async (done) => {
    new Promise( async (resolve, reject) =>{
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.exec(sql);
      let result = await dbStmt.close();
      expect(result).to.be.a('undefined');
    });
    done();
  });
});

//if successful returns undefined
//TODO: Ensure This a correct unit test for how closecursor may be used.
describe('closeCursor', () => {
  it('closes any cursor associated with the dbstmt object and discards any pending results. ', async (done) => {
    new Promise(async (resolve, reject) => {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.exec(sql);
      let result = await dbStmt.closeCursor();
      expect(result).to.be.a('undefined');
    });
    done();
  });
});

//if successful returns undefined
describe('commit', () => {
  it('adds all changes to the database that have been made on the connection since connect time ', async (done) => {
    new Promise( async (resolve, reject) => {
      let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.bindParam([
        [9997, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CUSNUM
        ['Johnson', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //LASTNAME
        ['A J', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //INITIAL
        ['453 Example', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //ADDRESS
        ['Fort', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //CITY
        ['TN', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //STATE
        [37211, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //ZIP
        [1000, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CREDIT LIMIT
        [1, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], // change
        [150, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //BAL DUE
        [0.00, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC] //CREDIT DUE
      ]);
      await dbStmt.execute();
      let result = await dbStmt.commit();
      expect(result).to.be.a('undefined');
    });
    done();
  });
});

//if successful returns an array. of Type of objects
describe('exec', () => {
  it('performs action of given SQL String', async (done) => {
    new Promise(async (resolve, reject) => {
      let dbConn = new dba.Connection();
      dbConn.debug(true);
      let dbStmt = dbConn.connect().getStatement(),
        sql = 'SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = 938472';

      let result =  await dbStmt.exec(sql);

      console.log(`Exec results: ${JSON.stringify(result)}`);
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
    });
    done();
  });
});

//if successful returns an array of length 0?. Why,even return it if size === 0?
describe('execute', () => {
  it('retrieves results from execute function:', async (done) =>{
    new Promise(async (resolve, reject) => {
      let sql = 'CALL AMUSSE.MAXBAL(?)',
        dbConn = new dba.Connection();

      dbConn.debug(true);
      let dbStmt = dbConn.connect().getStatement(),
        bal = 0;
      await dbStmt.prepare(sql);
      await dbStmt.bind([[bal, dba.SQL_PARAM_OUT, dba.SQL_NUMERIC]]);
      let result = await dbStmt.execute();

      console.log(`ExecuteAsync results:\n ${JSON.stringify(result)}`);
      console.log(`Length of results: ${result.length}`);
      expect(result).to.be.a('array');
      expect(result.length).to.be.greaterThan(0);
    });
    done();
  });
});

//if successful returns an array. of Type of objects
describe('fetchAll', () => {
  it('retrieves results from execute function:', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbConn = new dba.Connection();

      dbConn.debug(true);
      let dbStmt = dbConn.connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();
      let result = await dbStmt.fetchAll();

      console.log(`Fetch All results:\n ${JSON.stringify(result)}`);
      console.log(`Size of the returned array: ${result.length}`);
      expect(result).to.be.a('array');
      expect(result.length).to.be.greaterThan(0);
    });
    done();
  });
});

//if successful returns an Object of Row
//kind of weird because FetchAll returns an Array(of objects? )
describe('fetch', () => {
  it('retrieves results from execute function:', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbConn = new dba.Connection();
      dbConn.debug(true);
      let dbStmt = dbConn.connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();
      let result = await dbStmt.fetch();

      console.log(`Fetch result:\n ${JSON.stringify(result)}`);
      expect(result).to.be.a('object');
    });
    done();
  });
});

//if successful returns an Int
describe('numFields', () => {
  it('retrieves number of fields contained in result', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();
      let fields = await dbStmt.numFields();

      console.log(`Number of Fields: ${fields}`);
      expect(fields).to.be.a('number');
    });
    done();
  });
});

//if successful returns an Int
describe('numRows', () => {
  it('retrieves number of rows that were effected by a Querry', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();
      let rows = await dbStmt.numRows();

      console.log(`Number of Rows: ${rows}`);
      expect(rows).to.be.a('number');
    });
    done();
  });
});

//if successful returns an Int
describe('fieldType', () => {
  it('requires an int index parameter. If a valid index is provided, returns the data type of the indicated column', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();

      let col1 = await dbStmt.fieldType(0),
        col2 = await dbStmt.fieldType(1);

      console.log(`column 1 fieldType = ${col1}`);
      console.log(`column 2 fieldType = ${col2}`);
      expect(col1).to.be.a('number');
      expect(col2).to.be.a('number');
    });
    done();
  });
});

//if successful returns an Int
describe('fieldWidth', () => {
  it('requires an int index parameter. If a valid index is provided, returns the field width of the indicated column', async (done) => {
    new Promise(async (resolve, reject) => {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();

      let col1 = await dbStmt.fieldWidth(0),
        col2 = await dbStmt.fieldWidth(1);

      console.log(`column 1 fieldWidth = ${col1}`);
      console.log(`column 2 fieldWidth = ${col2}`);
      expect(col1).to.be.a('number');
      expect(col2).to.be.a('number');
    });
    done();
  });
});

//if successful returns an Int but should return boolean based on doc , UPDATE 3-6-18 added logic to return the boolean. (makeBool method in idb-p)
describe('fieldNullable', () => {
  it('requires an int index parameter. If a valid index is provided, returns t/f if the indicated column can be Null', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();

      let col1 = await dbStmt.fieldNullable(0),
        col2 = await dbStmt.fieldNullable(1);

      console.log(`column 1 Nullable? = ${col1}`);
      console.log(`column 2 Nullable? = ${col2}`);
      //****Documnetation says it should return a boolean
      expect(col1).to.equal(false);
      expect(col2).to.equal(false);
    });
    done();
  });
});

//if successful returns an String
describe('fieldName', () => {
  it('requires an int index parameter. If a valid index is provided,returns name of the indicated column ', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();

      let col1 = await dbStmt.fieldName(0),
        col2 = await dbStmt.fieldName(1);

      console.log(`column 1 Name = ${col1}`);
      console.log(`column 2 Name = ${col2}`);
      expect(col1).to.be.a('string');
      expect(col2).to.be.a('string');
    });
    done();
  });
});

//if successful returns an Int
describe('fieldPrecise', () => {
  it('requires an int index parameter. If a valid index is provided, returns the precision of the indicated column', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();

      let col1 = await dbStmt.fieldPrecise(0),
        col2 = await dbStmt.fieldPrecise(1);

      console.log('column 1 fieldPrecision = : ' + col1);
      console.log('column 2 fieldPrecision = : ' + col2);
      expect(col1).to.be.a('number');
      expect(col2).to.be.a('number');
    });
    done();
  });
});

//if successful returns an Int

describe('fieldScale', () => {
  it('requires an int index parameter. If a valid index is provided, returns the scale of the indicated column', async function(done){
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();

      await dbStmt.prepare(sql);
      await dbStmt.execute();

      let col1 = await dbStmt.fieldScale(0),
        col2 = await dbStmt.fieldScale(1);

      console.log(`column 1 fieldScale = ${col1}`);
      console.log(`column 2 fieldScale = ${col2}`);
      expect(col1).to.be.a('number');
      expect(col2).to.be.a('number');
    });
    done();
  });
});

//if successful returns undefined
describe('setStmtAttr', () => {
  it('sets StmtAttr Attrubte should be INT. Value can String or Int depending on the attribute', async () => {
    let attr = dba.SQL_ATTR_FOR_FETCH_ONLY,
      value = 1,
      dbStmt = new dba.Connection().connect().getStatement();

    let result = await dbStmt.setStmtAttr(attr, value);
    expect(result).to.be.a('undefined');
  });
});

//if successful returns String or Int depending on attribute
describe('getStmtAttr', () => {
  it('if statement attribute exsits should return type String or Int depending on the attribute type', async () => {
    let attr = dba.SQL_ATTR_FOR_FETCH_ONLY;
    let dbStmt = new dba.Connection().connect().getStatement();
    let result = await dbStmt.getStmtAttr(attr);
    console.log(`Stmt Attr: ${result}`);
    expect(result).to.satisfy(function(result){
      return result === 'string' || typeof result === 'number';
    });
  });
});

// whats the passing use case for next Result?
// describe('nextResult', () => {
// 	it('Determines whether there is more information available on the statement', async () => {
// 		let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 		let dbStmt = new dba.Connection().connect().getStatement();
// 		await dbStmt.prepare(sql);
// 		await dbStmt.execute();
// 		let result = await dbStmt.nextResult();
// 		expect(res).to.be.a('object');
// 	});
// })

//if successful returns undefined
describe('rollback', () => {
  it('Rollback all changes to the database that have been made on the connection', async (done) => {
    new Promise(async function(resolve, reject) {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT',
        dbStmt = new dba.Connection().connect().getStatement();
      await dbStmt.prepare(sql);
      await dbStmt.execute();
      let result = await dbStmt.rollback();
      expect(result).to.be.a('undefined');
    });
    done();
  });
});


//how to test this?
// describe('stmtError' , () => {

// 	it('Returns the diagnostic information ', async () =>{
// 			let dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.stmtError(hType, recno);

// 	});
// })

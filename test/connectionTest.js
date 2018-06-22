const assert = require('chai').assert;
const expect = require('chai').expect;
const dba = require('../lib/idb-pconnector');


// Test Connection Class

describe('connect', () => {
  it('should return a newly connected dbconn object', async () => {
    let dbConn = new dba.Connection();
    console.log(dbConn);
    let connReturned = dbConn.connect();
    console.log(connReturned);
    expect(connReturned.dbconn).to.be.a('dbconn');
  });
});


describe('getStatement', () => {
  it('should return a new statemetnt intiialized with the the dbconn', async () => {
    let dbConn = new dba.Connection().connect();
    console.log(dbConn);
    let stmtReturned = dbConn.getStatement();
    console.log(stmtReturned);
    expect(stmtReturned.stmt).to.be.a('dbstmt');
  });
});

//if successful returns String
describe('validStmt', () => {
  it('if the SQL is valid, validStmt , should return type String', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.validStmt(sql);
    console.log('Valid Stmt output: ' + res);
    expect(res).to.be.a('string');

  });
});

//if successful returns String or Int depending on attribute
describe('getConnAttr', () => {
  it('if connection attribute exsits should return type String or Int depending on the attribute type', async () => {
    let attr = 0;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.getConnAttr(attr);
    console.log('Attrubte: ' + res);
    expect(res).to.satisfy(function(res){
      return res === 'string' || typeof res === 'number';
    });

  });
});

//if successful returns undefined
describe('setConnAttr', () => {
  it('sets the ConnAttr. Attrubte should be INT. Value can String or Int depending on the attribute', async () => {
    let attr = 0;
    let value = 2;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.setConnAttr(attr, value);
    expect(res).to.be.a('undefined');
  });
});

//if successful returns undefined
describe('debug', () => {
  it('prints more detailed info if choice = true. Turned off by setting choice = false.', async () => {
    let choice = true;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.debug(choice);
    expect(res).to.be.a('undefined');
  });
});

//if successful returns undefined
describe('disconn', () => {
  it('disconnects an exsisting connection to the datbase. ', async () => {
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.disconn();
    expect(res).to.be.a('undefined');
  });
});



//if successful returns undefined
describe('close', () => {
  it('frees the connection object. ', async () => {
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.close();
    expect(res).to.be.a('undefined');
  });
});
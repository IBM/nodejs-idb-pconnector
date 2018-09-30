/*
* Test case for the idb-pconnector DBPool Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/

const assert = require('chai').assert;
const expect = require('chai').expect;
const {Connection} = require('../lib/idb-pconnector');


// Test Connection Class

describe('Connection constructor connect', () => {
  it('should attempt to connect if the db object parameter is provided', async () => {
    let dbConn = new Connection({url: '*LOCAL'});

    expect(dbConn.isConnected()).to.be.true;
  });
});

describe('Connection constructor connect', () => {
  it('should attempt to connect if the db object parameter is provided', async () => {
    let dbConn = new Connection({url: '*LOCAL', username: process.env.USERID, password: process.env.PASSWD});

    expect(dbConn.isConnected()).to.be.true;
  });
});

describe('connect', () => {
  it('should return a newly connected dbconn object', async () => {
    let dbConn = new Connection(),
      connReturned = dbConn.connect();

    expect(connReturned.isConnected()).to.be.true;
    expect(connReturned.dbconn).to.be.a('dbconn');
  });
});

describe('connect with user & password', () => {
  it('should return a newly connected dbconn object', async () => {
    let dbConn = new Connection(),
      connReturned = dbConn.connect('*LOCAL', process.env.USERID, process.env.PASSWD);

    expect(connReturned.isConnected()).to.be.true;
    expect(connReturned.dbconn).to.be.a('dbconn');
  });
});

describe('getStatement', () => {
  it('should return a new statemetnt intiialized with the the dbconn', async () => {
    let dbConn = new Connection().connect(),
      stmtReturned = dbConn.getStatement();

    expect(stmtReturned.stmt).to.be.a('dbstmt');
  });
});

//if successful returns String
describe('validStmt', () => {
  it('if the SQL is valid, validStmt , should return type String', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT',
      dbConn = new Connection().connect(),
      res = await dbConn.validStmt(sql);

    expect(res).to.be.a('string');
  });
});

//if successful returns String or Int depending on attribute
describe('getConnAttr', () => {
  it('if connection attribute exsits should return type String or Int depending on the attribute type', async () => {
    let attr = 0,
      dbConn = new Connection().connect(),
      res = await dbConn.getConnAttr(attr);

    expect(res).to.satisfy(function(res){
      return res === 'string' || typeof res === 'number';
    });

  });
});

//if successful returns undefined
describe('setConnAttr', () => {
  it('sets the ConnAttr. Attrubte should be INT. Value can String or Int depending on the attribute', async () => {
    let attr = 0,
      value = 2,
      dbConn = new Connection().connect(),
      res = await dbConn.setConnAttr(attr, value);

    expect(res).to.be.true;
  });
});

//if successful returns undefined
describe('debug', () => {
  it('prints more detailed info if choice = true. Turned off by setting choice = false.', async () => {
    let choice = true,
      dbConn = new Connection().connect(),
      res = await dbConn.debug(choice);

    expect(res).to.be.true;
  });
});

//if successful returns undefined
describe('disconn', () => {
  it('disconnects an exsisting connection to the datbase. ', async () => {
    let dbConn = new Connection().connect(),
      res = await dbConn.disconn();

    expect(res).to.be.true;
  });
});

//if successful returns undefined
describe('close', () => {
  it('frees the connection object. ', async () => {
    let dbConn = new Connection().connect();

    await dbConn.disconn();

    let res = await dbConn.close();

    expect(res).to.be.true;
  });
});

describe('isConnected', () => {
  it('returns true/false if Connection object is connected ', async () => {
    let dbConn = new Connection(),
      before = dbConn.isConnected();
    expect(before).to.be.false;

    dbConn.connect();

    let after = dbConn.isConnected();

    expect(after).to.be.true;

    await dbConn.disconn();

    let last = dbConn.isConnected();
    expect(last).to.be.false;
  });
});
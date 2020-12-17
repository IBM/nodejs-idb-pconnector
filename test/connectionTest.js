/*
* Test case for the idb-pconnector DBPool Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/

/* eslint-env mocha */

const { expect } = require('chai');
const { Connection } = require('../lib/idb-pconnector');

describe('Connection Class Tests', function () {
  describe('constructor', function () {
    it('creates Connection object and connects to *LOCAL as current user', async function () {
      const dbConn = new Connection({ url: '*LOCAL' });

      expect(dbConn.isConnected()).to.equal(true);
    });

    it('creates Connection object and connects to specified db as specified user', async function () {
      if (!process.env.DBUSER || !process.env.DBPASS) {
        throw new Error('Must specify DBUSER DBPASS environment variables');
      }
      const dbConn = new Connection({
        url: '*LOCAL',
        username: process.env.DBUSER,
        password: process.env.DBPASS,
      });

      expect(dbConn.isConnected()).to.equal(true);
    });
  });

  describe('connect', function () {
    it('connects to *LOCAL when no params passed', async function () {
      const dbConn = new Connection();

      const connReturned = dbConn.connect();

      expect(connReturned.isConnected()).to.equal(true);
      expect(connReturned.dbconn).to.be.a('dbconn');
    });

    it('connects with passed db, user, password params', async function () {
      if (!process.env.DBUSER || !process.env.DBPASS) {
        throw new Error('Must specify DBUSER DBPASS environment variables');
      }
      const dbConn = new Connection();
      const connReturned = dbConn.connect('*LOCAL', process.env.DBUSER, process.env.DBPASS);

      expect(connReturned.isConnected()).to.equal(true);
      expect(connReturned.dbconn).to.be.a('dbconn');
    });
  });

  describe('getStatement', function () {
    it('should return a new statement initialized with the the dbconn', async function () {
      const dbConn = new Connection().connect();
      const stmtReturned = dbConn.getStatement();

      expect(stmtReturned.stmt).to.be.a('dbstmt');
    });
  });

  describe('validStmt', function () {
    it('checks of a given sql is valid', async function () {
      const sql = 'SELECT * FROM QIWS.QCUSTCDT';
      const dbConn = new Connection().connect();
      const res = await dbConn.validStmt(sql);

      expect(res).to.be.equal(sql);
    });
  });

  describe('getConnAttr', function () {
    it('returns the value of specified connection attribute', async function () {
      const attr = 0;
      const dbConn = new Connection().connect();
      const returnValue = await dbConn.getConnAttr(attr);

      expect(returnValue).to.equal(2);
    });
  });

  describe('setConnAttr', function () {
    it('sets the value of specified connection attribute', async function () {
      const attr = 0;
      const value = 2;
      const dbConn = new Connection().connect();
      const res = await dbConn.setConnAttr(attr, value);

      expect(res).to.equal(true);
    });
  });

  describe('debug', function () {
    it('prints more detailed info if choice = true', async function () {
      const choice = true;
      const dbConn = new Connection().connect();
      const res = await dbConn.debug(choice);

      expect(res).to.equal(true);
    });
  });

  describe('disconn', function () {
    it('disconnects an existing connection to the database', async function () {
      const dbConn = new Connection().connect();
      const res = await dbConn.disconn();

      expect(res).to.equal(true);
    });
  });

  describe('close', function () {
    it('frees the connection object', async function () {
      const dbConn = new Connection().connect();

      await dbConn.disconn();

      const res = await dbConn.close();

      expect(res).to.equal(true);
    });
  });

  describe('isConnected', function () {
    it('returns true/false if Connection object is connected', async function () {
      const dbConn = new Connection();
      const before = dbConn.isConnected();
      expect(before).to.equal(false);

      dbConn.connect();

      const after = dbConn.isConnected();

      expect(after).to.equal(true);

      await dbConn.disconn();

      const last = dbConn.isConnected();
      expect(last).to.equal(false);
    });
  });

  describe('setLibraryList', function () {
    it('sets the user portion of the library list for the current connection', async function () {
      const dbConn = new Connection({ url: '*LOCAL' });
      const statement = dbConn.getStatement();

      await dbConn.setLibraryList(['QIWS', 'QXMLSERV']);
      const after = await statement.exec("SELECT * from qsys2.library_list_info WHERE TYPE = 'USER'");
      expect(after).to.be.a('array');
      expect(after.length).to.equal(2);
      expect(after[0]).to.be.a('object');
      expect(after[0].SCHEMA_NAME).to.equal('QIWS');
      expect(after[1]).to.be.a('object');
      expect(after[1].SCHEMA_NAME).to.equal('QXMLSERV');
    });
  });
});

/*
* Test case for the idb-pconnector DBPool Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/

/* eslint-env mocha */

const { expect } = require('chai');
const idbp = require('../lib/idb-pconnector');

const { DBPool } = idbp;
const DBPoolConnection = require('../lib/dbPoolConnection');

describe('DBPool Class Tests', function () {
  describe('createConnection', function () {
    it('creates a new instance of DBConnection with an index and appends it to the pool', async function () {
      const pool = new DBPool({ url: '*LOCAL' });

      const lenBefore = pool.connections.length;

      pool.createConnection();
      // verify the connection was added by checking the new length
      expect(pool.connections.length).to.be.equal(lenBefore + 1);
    });
  });

  describe('attach', function () {
    it('finds an available connection and returns it', async function () {
      const pool = new DBPool({ url: '*LOCAL' });

      const conn = await pool.attach();

      // verify that the conn returned is of type DBPoolConnection
      expect(conn).to.be.an.instanceOf(DBPoolConnection);

      // verify that it is set to unavailable in the Pool
      expect(conn.available).to.equal(false);
    // pool.detach(conn);
    });
  });

  // could give assertion error (red herring?) , see detach test in manualTest.js
  describe('detach', function () {
    it('resets connection to be used again', async function () {
      const pool = new DBPool({ url: '*LOCAL' });
      // get the conn
      const conn = pool.attach();
      // perform some statements
      await conn.getStatement().exec('SELECT * FROM QIWS.QCUSTCDT');

      const stmtBefore = conn.statement;
      const id = conn.poolIndex;
      await conn.detach();

      const detached = pool.connections[id];
      const stmtAfter = detached.statement;

      // after being detached available should be true again
      expect(detached.available).to.equal(true);
      // make sure the statement was cleared
      expect(stmtBefore).to.not.equal(stmtAfter);
      await pool.detach(conn);
    });
  });

  describe('detachAll', function () {
    it('returns all connections back to available', async function () {
      const pool = new DBPool({ url: '*LOCAL' });

      const { connections } = pool;
      // ensure all connections reset before attaching all
      // await pool.detachAll();

      // make all of the connections unavailable
      connections.forEach(() => {
      // make all of the connections unavailable
        pool.attach();
      });

      connections.forEach((connection) => {
      // all of the connections should be unavailable
        expect(connection.available).to.equal(false);
      });

      // now call detach all
      await pool.detachAll();

      // make sure that are now available again.
      connections.forEach((connection) => {
      // all of the connections should be available
        expect(connection.available).to.equal(true);
      });
    });
  });

  describe('retire', function () {
    it('removes a connection from the pool', async function () {
      const pool = new DBPool({ url: '*LOCAL' });
      const { connections } = pool;
      const conn = pool.attach();
      const id = conn.poolIndex;
      const lenBefore = connections.length;

      await pool.retire(conn);
      // verify that conn was removed
      expect(connections.length).to.be.equal(lenBefore - 1);

      connections.forEach((connection) => {
        expect(connection.poolIndex).to.not.equal(id);
      });
    });
  });

  describe('retireAll', function () {
    it('removes all connections from the pool', async function () {
      const pool = new DBPool({ url: '*LOCAL' });

      expect(pool.connections.length).to.equal(8);

      await pool.retireAll();

      expect(pool.connections.length).to.equal(0);
    });
  });

  describe('runSql', function () {
    it('executes SELECT statment and returns result set', async function () {
      const pool = new DBPool({ url: '*LOCAL' });

      const results = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');
      expect(results).to.be.an('array');
      expect(results.length).to.be.gt(0);
    });

    it('executes INSERT statement and returns null', async function () {
      const pool = new DBPool({ url: '*LOCAL' });

      // eslint-disable-next-line quotes
      const sql = `INSERT INTO QIWS.QCUSTCDT VALUES (6754,'Smith','A S','323 Main','Test','CA',52501,3500,2,500.99,0.98) with NONE`;
      const results = await pool.runSql(sql);

      expect(results).to.equal(null);
    });
  });

  describe('prepareExecute', function () {
    it('prepares, binds, and executes statement, returns output params & result set',
      async function () {
        const pool = new DBPool({ url: '*LOCAL' });

        const cusNum = 938472;
        const results = await pool.prepareExecute('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [cusNum]);
        const { resultSet, outputParams } = results;

        expect(results).to.be.an('object');
        expect(resultSet).to.be.an('array');
        expect(resultSet.length).to.be.gt(0);
        expect(outputParams).to.be.an('array');
        expect(outputParams.length).to.equal(1);
      });

    it('prepares, binds, and executes statement returns null (no output or result set)',
      async function () {
        const pool = new DBPool({ url: '*LOCAL' });

        const sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';

        const params = [
          5469, // CUSNUM
          'David', // LASTNAME
          'E D', // INITIAL
          '456 enter', // ADDRESS
          'Hill', // CITY
          'SC', // STATE
          54786, // ZIP
          7000, // CREDIT LIMIT
          2, // change
          478.32, // BAL DUE
          0.25, // CREDIT DUE
        ];

        const results = await pool.prepareExecute(sql, params, { io: 'in' });

        expect(results).to.equal(null);
      });

    it('prepares and executes INSERT returns result set only',
      async function () {
        const pool = new DBPool({ url: '*LOCAL' });

        const sql = 'SELECT * FROM QIWS.QCUSTCDT';

        const results = await pool.prepareExecute(sql);

        expect(results.outputParams).to.equal(undefined);
        expect(results.resultSet).to.be.a('array');
        expect(results.resultSet.length).to.be.gt(0);
      });
  });

  describe('setConnectionAttribute', function () {
    it('sets connection attribute for all connections in the pool.',
      async function () {
        const db = { url: '*LOCAL' };

        const attribute = { attribute: idbp.SQL_ATTR_DBC_SYS_NAMING, value: idbp.SQL_FALSE };

        const config = { incrementSize: 3 };

        const testPool = new DBPool(db, config);

        await testPool.setConnectionAttribute(attribute).catch((error) => {
          throw error;
        });
      });
  });
});

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

describe('DBPool Class Tests', () => {
  describe('createConnection', async () => {
    it('creates a new instance of DBConnection with an index and appends it to the pool', async () => {
      const pool = new DBPool({ url: '*LOCAL' });

      const lenBefore = pool.connections.length;

      pool.createConnection();
      // verify the connection was added by checking the new length
      expect(pool.connections.length).to.be.equal(lenBefore + 1);
    });
  });

  describe('attach', async () => {
    it('finds an available connection and returns it', async () => {
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
  describe('detach', async () => {
    it('resets connection to be used again', async () => {
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

  describe('detachAll', async () => {
    it('returns all connections back to available', async () => {
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

  describe('retire', async () => {
    it('removes a connection from the pool', async () => {
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

  describe('retireAll', async () => {
    it('removes all connections from the pool', async () => {
      const pool = new DBPool({ url: '*LOCAL' });

      expect(pool.connections.length).to.equal(8);

      await pool.retireAll();

      expect(pool.connections.length).to.equal(0);
    });
  });

  describe('runSql', async () => {
    it('executes SELECT statment and returns result set', async () => {
      const pool = new DBPool({ url: '*LOCAL' });

      const results = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');
      expect(results).to.be.an('array');
      expect(results.length).to.be.gt(0);
    });

    it('executes INSERT statement and returns null', async () => {
      const pool = new DBPool({ url: '*LOCAL' });

      // eslint-disable-next-line quotes
      const sql = `INSERT INTO QIWS.QCUSTCDT VALUES (6754,'Smith','A S','323 Main','Test','CA',52501,3500,2,500.99,0.98) with NONE`;
      const results = await pool.runSql(sql);

      expect(results).to.equal(null);
    });
  });

  describe('prepareExecute', async () => {
    it(
      'prepares, binds, and executes statement, returns output params & result set',
      async () => {
        const pool = new DBPool({ url: '*LOCAL' });

        const cusNum = 938472;
        const results = await pool.prepareExecute('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [cusNum]);
        const { resultSet, outputParams } = results;

        expect(results).to.be.an('object');
        expect(resultSet).to.be.an('array');
        expect(resultSet.length).to.be.gt(0);
        expect(outputParams).to.be.an('array');
        expect(outputParams.length).to.equal(1);
      },
    );

    it(
      'prepares, binds, and executes statement returns null (no output or result set)',
      async () => {
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
      },
    );

    it(
      'prepares and executes INSERT returns result set only',
      async () => {
        const pool = new DBPool({ url: '*LOCAL' });

        const sql = 'SELECT * FROM QIWS.QCUSTCDT';

        const results = await pool.prepareExecute(sql);

        expect(results.outputParams).to.equal(undefined);
        expect(results.resultSet).to.be.a('array');
        expect(results.resultSet.length).to.be.gt(0);
      },
    );
  });

  describe('setConnectionAttribute', async () => {
    it(
      'sets connection attribute for all connections in the pool.',
      async () => {
        const db = { url: '*LOCAL' };

        const attribute = { attribute: idbp.SQL_ATTR_DBC_SYS_NAMING, value: idbp.SQL_FALSE };

        const config = { incrementSize: 3 };

        const testPool = new DBPool(db, config);

        await testPool.setConnectionAttribute(attribute).catch((error) => {
          throw error;
        });
      },
    );
  });

  describe('enableNumericTypeConversion', () => {
    it('should default to false', async () => {
      const pool = new DBPool({ url: '*LOCAL' });
      expect(pool.enableNumericTypeConversion).to.equal(false);
    });

    it('runSql should default to return numeric data as strings', async () => {
      const sql = `select cast(-32768 as SMALLINT) MIN_SMALLINT,
      cast(+32767 as SMALLINT) MAX_SMALLINT
      from sysibm.sysdummy1`;

      const pool = new DBPool({ url: '*LOCAL' });
      const result = await pool.runSql(sql);
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result).to.eql([{ MIN_SMALLINT: '-32768', MAX_SMALLINT: '32767' }]);
    });

    it('prepareExecute should default to return numeric data as strings', async () => {
      const sql = `select cast(-32768 as SMALLINT) MIN_SMALLINT,
      cast(+32767 as SMALLINT) MAX_SMALLINT
      from sysibm.sysdummy1`;

      const pool = new DBPool({ url: '*LOCAL' });
      const result = await pool.prepareExecute(sql);
      const { resultSet } = result;
      expect(resultSet).to.be.an('array');
      expect(resultSet.length).to.be.greaterThan(0);
      expect(resultSet).to.eql([{ MIN_SMALLINT: '-32768', MAX_SMALLINT: '32767' }]);
    });

    it('if set runSql should return numeric data as Number when safe to do so', async () => {
      const sql = `select 
        cast(-32768 as SMALLINT) MIN_SMALLINT,
        cast(+32767 as SMALLINT) MAX_SMALLINT,
        cast(-2147483648 as INT) MIN_INT,
        cast(+2147483647 as INT) MAX_INT,
        cast(999999999999999 as DECIMAL(15,0)) as DEC_SAFE_15_0,
        cast(.999999999999999 as DECIMAL(15,15)) as DEC_SAFE_15_15,
        --these values do not fit in a javascript number datatype
        cast(-9223372036854775808 as BIGINT) MIN_BIGINT,
        cast(+9223372036854775807 as BIGINT) MAX_BIGINT,
        cast(9999999999999999 as DECIMAL(16,0)) as DEC_NOT_SAFE_16_0
         from sysibm.sysdummy1`;

      const pool = new DBPool({ url: '*LOCAL' }, { enableNumericTypeConversion: true });
      expect(pool.enableNumericTypeConversion).to.equal(true);
      const result = await pool.runSql(sql);
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result).to.eql([{
        MIN_SMALLINT: -32768,
        MAX_SMALLINT: 32767,
        MIN_INT: -2147483648,
        MAX_INT: 2147483647,
        DEC_SAFE_15_0: 999999999999999,
        DEC_SAFE_15_15: 0.999999999999999,
        MIN_BIGINT: '-9223372036854775808',
        MAX_BIGINT: '9223372036854775807',
        DEC_NOT_SAFE_16_0: '9999999999999999',
      }]);
    });

    it('if set prepareExecute should return numeric data as Number when safe to do so', async () => {
      const sql = `select 
        cast(-32768 as SMALLINT) MIN_SMALLINT,
        cast(+32767 as SMALLINT) MAX_SMALLINT,
        cast(-2147483648 as INT) MIN_INT,
        cast(+2147483647 as INT) MAX_INT,
        cast(999999999999999 as DECIMAL(15,0)) as DEC_SAFE_15_0,
        cast(.999999999999999 as DECIMAL(15,15)) as DEC_SAFE_15_15,
        --these values do not fit in a javascript number datatype
        cast(-9223372036854775808 as BIGINT) MIN_BIGINT,
        cast(+9223372036854775807 as BIGINT) MAX_BIGINT,
        cast(9999999999999999 as DECIMAL(16,0)) as DEC_NOT_SAFE_16_0
         from sysibm.sysdummy1`;

      const pool = new DBPool({ url: '*LOCAL' }, { enableNumericTypeConversion: true });
      expect(pool.enableNumericTypeConversion).to.equal(true);
      const result = await pool.prepareExecute(sql);
      const { resultSet } = result;
      expect(resultSet).to.be.an('array');
      expect(resultSet.length).to.be.greaterThan(0);
      expect(resultSet).to.eql([{
        MIN_SMALLINT: -32768,
        MAX_SMALLINT: 32767,
        MIN_INT: -2147483648,
        MAX_INT: 2147483647,
        DEC_SAFE_15_0: 999999999999999,
        DEC_SAFE_15_15: 0.999999999999999,
        MIN_BIGINT: '-9223372036854775808',
        MAX_BIGINT: '9223372036854775807',
        DEC_NOT_SAFE_16_0: '9999999999999999',
      }]);
    });
  });
});

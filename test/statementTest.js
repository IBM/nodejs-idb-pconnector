/*
* Test case for the idb-pconnector Statement Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/
/* eslint-env mocha */

const { expect } = require('chai');

const {
  Connection, Statement, IN, OUT, NUMERIC, INT, CHAR, SQL_ATTR_FOR_FETCH_ONLY, NULL,
} = require('../lib/idb-pconnector');

const schema = 'IDBPTEST';
const table = 'SCORES';
const procedure = 'MAXBAL';

describe('Statement Class Tests', () => {
  before('setup schema for tests', async () => {
    const connection = new Connection({ url: '*LOCAL' });
    const statement = connection.getStatement();

    const schemaResult = await statement.exec(`SELECT SCHEMA_NAME FROM qsys2.sysschemas WHERE SCHEMA_NAME = '${schema}'`);
    await statement.closeCursor();

    if (!schemaResult.length) {
      await statement.exec(`CREATE SCHEMA ${schema}`);
    }

    await statement.exec(`CREATE OR REPLACE TABLE ${schema}.${table}(team VARCHAR(100), score INTEGER);`);
  });

  describe('constructor with connection parameter', () => {
    it('creates a new Statement object by passing a connection object', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);

      const results = await statement.exec('SELECT * FROM QIWS.QCUSTCDT');

      expect(results).to.be.a('array');
      expect(results.length).to.be.gt(0);

      results.forEach((row) => {
        expect(row).to.be.an('object');
        expect(row).to.haveOwnProperty('CUSNUM');
        expect(row).to.haveOwnProperty('LSTNAM');
        expect(row).to.haveOwnProperty('INIT');
        expect(row).to.haveOwnProperty('STREET');
        expect(row).to.haveOwnProperty('CITY');
        expect(row).to.haveOwnProperty('STATE');
        expect(row).to.haveOwnProperty('ZIPCOD');
        expect(row).to.haveOwnProperty('CDTLMT');
        expect(row).to.haveOwnProperty('CDTLMT');
        expect(row).to.haveOwnProperty('CHGCOD');
        expect(row).to.haveOwnProperty('BALDUE');
        expect(row).to.haveOwnProperty('CDTDUE');
      });
    });
  });

  describe('constructor without connection parameter', () => {
    it('creates a new Statement object with implicit connection object connected to *LOCAL',
      async () => {
        const statement = new Statement();

        const results = await statement.exec('SELECT * FROM QIWS.QCUSTCDT');

        expect(results).to.be.a('array');
        expect(results.length).to.be.gt(0);

        results.forEach((row) => {
          expect(row).to.be.an('object');
          expect(row).to.haveOwnProperty('CUSNUM');
          expect(row).to.haveOwnProperty('LSTNAM');
          expect(row).to.haveOwnProperty('INIT');
          expect(row).to.haveOwnProperty('STREET');
          expect(row).to.haveOwnProperty('CITY');
          expect(row).to.haveOwnProperty('STATE');
          expect(row).to.haveOwnProperty('ZIPCOD');
          expect(row).to.haveOwnProperty('CDTLMT');
          expect(row).to.haveOwnProperty('CDTLMT');
          expect(row).to.haveOwnProperty('CHGCOD');
          expect(row).to.haveOwnProperty('BALDUE');
          expect(row).to.haveOwnProperty('CDTDUE');
        });
      });
  });

  describe('prepare', () => {
    it('prepares an sql statement', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      const result = await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      expect(result).to.be.a('undefined');
    });
  });

  describe('bindParams', () => {
    afterEach(async () => {
      // runs after all tests in this block
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      await statement.exec(`DELETE FROM ${schema}.${table}`);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });

    it('associate parameter markers in an SQL to app variables', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      const params = [
        ['Tigers', IN, CHAR],
        [35, IN, INT],
      ];

      await statement.prepare(`INSERT INTO ${schema}.${table}(TEAM, SCORE) VALUES (?,?)`);
      await statement.bindParam(params);
      await statement.execute();

      const result = await statement.exec(`SELECT COUNT(TEAM) AS COUNT FROM  ${schema}.${table}`);

      const count = Number.parseInt(result[0].COUNT, 10);
      expect(count).to.equal(1);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });

    it('binds a null value, tests issue #40', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      const params = [
        ['EXAMPLE', IN, CHAR],
        [null, IN, NULL],
      ];

      await statement.prepare(`INSERT INTO ${schema}.${table}(TEAM, SCORE) VALUES (?,?)`);
      await statement.bindParam(params);
      await statement.execute();
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('close', () => {
    it('frees the statement object. ', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.exec('SELECT * FROM QIWS.QCUSTCDT');
      const result = await statement.close();
      expect(result).to.equal(true);
      await connection.disconn();
      await connection.close();
    });
  });

  // TODO: Ensure This a correct test for how closeCursor() may be used.
  describe('closeCursor', () => {
    it('discards any pending results', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.exec('SELECT * FROM QIWS.QCUSTCDT');
      const result = await statement.closeCursor();
      expect(result).to.equal(true);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('commit', () => {
    after(async () => {
      // runs after all tests in this block
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      await statement.exec(`DELETE FROM ${schema}.${table}`);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
    it('adds changes to the database', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      const params = [
        ['Lions', IN, CHAR],
        [13, IN, INT],
      ];

      await statement.prepare(`INSERT INTO ${schema}.${table}(TEAM, SCORE) VALUES (?,?)`);
      await statement.bindParam(params);
      await statement.execute();
      const result = await statement.commit();
      await statement.close();
      await connection.disconn();
      await connection.close();
      expect(result).to.equal(true);
    });
  });

  describe('exec', () => {
    it('directly executes a given SQL String', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      const result = await statement.exec('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = 938472');

      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
    });
  });

  describe('execute', () => {
    before('create stored procedure for test', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);
      const createSP = `CREATE OR REPLACE PROCEDURE ${schema}.${procedure} (OUT OUTPUT DECIMAL(6,2))
                        BEGIN
                        DECLARE MAXBAL NUMERIC ( 6 , 2 ) ;
                        SELECT MAX ( BALDUE ) INTO ${procedure} FROM QIWS.QCUSTCDT;
                        SET OUTPUT = MAXBAL;
                        END`;
      await statement.exec(createSP);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });

    it('executes a stored procedure and returns output parameter', async () => {
      const connection = new Connection({ url: '*LOCAL' });

      const statement = connection.getStatement();
      const bal = 0;

      await statement.prepare(`CALL ${schema}.${procedure}(?)`);
      await statement.bind([[bal, OUT, NUMERIC]]);
      const result = await statement.execute();
      await connection.disconn();
      await connection.close();

      expect(result).to.be.a('array');
      expect(result.length).to.equal(1);
      expect(result[0]).to.be.a('number');
    });
  });

  describe('fetchAll', () => {
    it('fetches All rows from the result set', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const results = await statement.fetchAll();
      await statement.close();
      await connection.disconn();
      await connection.close();

      expect(results).to.be.a('array');
      expect(results.length).to.be.greaterThan(0);

      results.forEach((row) => {
        expect(row).to.be.an('object');
        expect(row).to.haveOwnProperty('CUSNUM');
        expect(row).to.haveOwnProperty('LSTNAM');
        expect(row).to.haveOwnProperty('INIT');
        expect(row).to.haveOwnProperty('STREET');
        expect(row).to.haveOwnProperty('CITY');
        expect(row).to.haveOwnProperty('STATE');
        expect(row).to.haveOwnProperty('ZIPCOD');
        expect(row).to.haveOwnProperty('CDTLMT');
        expect(row).to.haveOwnProperty('CDTLMT');
        expect(row).to.haveOwnProperty('CHGCOD');
        expect(row).to.haveOwnProperty('BALDUE');
        expect(row).to.haveOwnProperty('CDTDUE');
      });
    });
  });

  describe('fetch', () => {
    it('fetches one row from the result set', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const result = await statement.fetch();
      await statement.close();
      await connection.disconn();
      await connection.close();

      expect(result).to.be.a('object');
      expect(result).to.haveOwnProperty('CUSNUM');
      expect(result).to.haveOwnProperty('LSTNAM');
      expect(result).to.haveOwnProperty('INIT');
      expect(result).to.haveOwnProperty('STREET');
      expect(result).to.haveOwnProperty('CITY');
      expect(result).to.haveOwnProperty('STATE');
      expect(result).to.haveOwnProperty('ZIPCOD');
      expect(result).to.haveOwnProperty('CDTLMT');
      expect(result).to.haveOwnProperty('CDTLMT');
      expect(result).to.haveOwnProperty('CHGCOD');
      expect(result).to.haveOwnProperty('BALDUE');
      expect(result).to.haveOwnProperty('CDTDUE');
    });
  });

  describe('numFields', () => {
    it('returns number of fields contained in result', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const fields = await statement.numFields();
      expect(fields).to.be.a('number').to.equal(11);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('numRows', () => {
    after(async () => {
      // runs after all tests in this block
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      await statement.exec(`DELETE FROM ${schema}.${table}`);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
    it('returns number of rows that were effected by a query', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      const params = [
        ['Jaguars', IN, CHAR],
        [20, IN, INT],
      ];

      await statement.prepare(`INSERT INTO ${schema}.${table}(TEAM, SCORE) VALUES (?,?)`);
      await statement.bindParam(params);
      await statement.execute();
      const rows = await statement.numRows();
      expect(rows).to.be.a('number').and.to.equal(1);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('fieldType', () => {
    it('returns the data type of the indicated column', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();

      const type = await statement.fieldType(0);
      expect(type).to.be.a('number').and.to.equal(2);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('fieldWidth', () => {
    it('returns the field width of the indicated column', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const width = await statement.fieldWidth(0);
      expect(width).to.to.equal(7);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('fieldNullable', () => {
    it('returns t/f if the indicated column is nullable', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const nullable = await statement.fieldNullable(0);
      expect(nullable).to.equal(false);
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('fieldName', () => {
    it('returns name of the indicated column ', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const name = await statement.fieldName(0);
      expect(name).to.equal('CUSNUM');
      await statement.close();
      await connection.disconn();
      await connection.close();
    });
  });

  describe('fieldPrecise', () => {
    it('returns the precision of the indicated column', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();

      const precision = await statement.fieldPrecise(0);
      await statement.close();
      await connection.disconn();
      await connection.close();

      expect(precision).to.equal(6);
    });
  });

  describe('fieldScale', () => {
    it('returns the scale of the indicated column', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const scale = await statement.fieldScale(0);
      await statement.close();
      await connection.disconn();
      await connection.close();

      expect(scale).to.equal(0);
    });
  });

  describe('setStmtAttr', () => {
    it('sets the value of a specified statement attribute', async () => {
      const attr = SQL_ATTR_FOR_FETCH_ONLY;
      const value = 1;

      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      const result = await statement.setStmtAttr(attr, value);
      await statement.close();
      await connection.disconn();
      await connection.close();
      expect(result).to.equal(true);
    });
  });

  describe('getStmtAttr', () => {
    it('returns the value of specified attribute', async () => {
      const attr = SQL_ATTR_FOR_FETCH_ONLY;
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      const result = await statement.getStmtAttr(attr);
      await statement.close();
      await connection.disconn();
      await connection.close();

      expect(result).to.equal(0);
    });
  });

  describe('rollback', () => {
    it('rollback changes made on the connection', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const result = await statement.rollback();
      await statement.close();
      await connection.disconn();
      await connection.close();

      expect(result).to.equal(true);
    });
  });

  describe('enableNumericTypeConversion', () => {
    it('should default to false', async () => {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      expect(statement.enableNumericTypeConversion()).to.equal(false);
    });

    it('should return numeric data as strings when false', async () => {
      const sql = `select cast(-32768 as SMALLINT) MIN_SMALLINT,
      cast(+32767 as SMALLINT) MAX_SMALLINT
      from sysibm.sysdummy1`;

      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      const result = await statement.exec(sql);
      await statement.close();
      await connection.disconn();
      await connection.close();
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result).to.eql([{ MIN_SMALLINT: '-32768', MAX_SMALLINT: '32767' }]);
    });

    it('should return numeric data as Number when safe to do so', async () => {
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

      const connection = new Connection({ url: '*LOCAL' });
      const statement = connection.getStatement();
      expect(statement.enableNumericTypeConversion(true)).to.equal(true);
      const result = await statement.exec(sql);
      await statement.close();
      await connection.disconn();
      await connection.close();
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
  });

  // TODO
  describe.skip('stmtError', () => {
    it('Returns the diagnostic information ', async () => {

    });
  });

  // TODO
  describe.skip('nextResult', () => {
    it('Determines whether there is another result set', async () => {

    });
  });
});

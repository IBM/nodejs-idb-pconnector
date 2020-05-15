/*
* Test case for the idb-pconnector Statement Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/
/* eslint-env mocha */

const { expect } = require('chai');

const {
  Connection, Statement, DBPool, IN, OUT, NUMERIC, CHAR, SQL_ATTR_FOR_FETCH_ONLY, NULL,
} = require('../lib/idb-pconnector');

const schema = 'IDBPTEST';

describe('Statement Class Tests', () => {
  before('setup schema for tests', async () => {
    const pool = new DBPool({ url: '*LOCAL' }, { incrementSize: 2 });
    const createSchema = `CREATE SCHEMA ${schema}`;
    const findSchema = `SELECT SCHEMA_NAME FROM qsys2.sysschemas WHERE SCHEMA_NAME = '${schema}'`;

    const schemaResult = await pool.runSql(findSchema);

    if (!schemaResult.length) {
      await pool.runSql(createSchema).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`UNABLE TO CREATE ${schema} SCHEMA!`);
        throw error;
      });
      // eslint-disable-next-line no-console
      console.log(`before hook: CREATED ${schema}`);
    }
  });

  describe('constructor with connection parameter', () => {
    it('creates a new Statement object by passing a connection object', async () => {
      const connection = new Connection().connect();
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
      const connection = new Connection();
      const statement = connection.connect().getStatement();

      const result = await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      expect(result).to.be.a('undefined');
    });
  });

  describe('bindParams', () => {
    before('create table for test', async () => {
      const pool = new DBPool({ url: '*LOCAL' }, { incrementSize: 2 });
      const createTable = `CREATE TABLE ${schema}.SCORES(team VARCHAR(100) ALLOCATE(20), score INTEGER)`;
      const findTable = `SELECT OBJLONGNAME FROM TABLE (QSYS2.OBJECT_STATISTICS('${schema}', '*FILE')) AS X WHERE OBJLONGNAME = 'SCORES'`;

      const tableResult = await pool.runSql(findTable);

      if (!tableResult.length) {
        await pool.runSql(createTable).catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Unable to create SCORES table');
          throw error;
        });
        // eslint-disable-next-line no-console
        console.log('before hook: CREATED SCORES TABLE');
      }
    });

    it('associate parameter markers in an SQL to app variables', async () => {
      const sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';

      const statement = new Statement();
      const statement2 = new Statement();

      const params = [
        [9997, IN, NUMERIC], // CUSNUM
        ['Doe', IN, CHAR], // LASTNAME
        ['J D', IN, CHAR], // INITIAL
        ['123 Broadway', IN, CHAR], // ADDRESS
        ['Hope', IN, CHAR], // CITY
        ['WA', IN, CHAR], // STATE
        [98101, IN, NUMERIC], // ZIP
        [2000, IN, NUMERIC], // CREDIT LIMIT
        [1, IN, NUMERIC], // change
        [250.99, IN, NUMERIC], // BAL DUE
        [0.78, IN, NUMERIC], // CREDIT DUE
      ];

      const countResult = await statement2.exec('SELECT COUNT(CUSNUM) AS COUNT FROM QIWS.QCUSTCDT');

      const rowsBeforeCount = Number.parseInt(countResult[0].COUNT, 10);
      await statement.prepare(sql);
      await statement.bindParam(params);
      await statement.execute();

      const countResultAgain = await statement.exec('SELECT COUNT(CUSNUM) AS COUNT FROM QIWS.QCUSTCDT');

      const rowsAfterCount = Number.parseInt(countResultAgain[0].COUNT, 10);

      expect(rowsAfterCount).to.equal(rowsBeforeCount + 1);
    });

    it('binds a null value, tests issue #40', async () => {
      const sql = `INSERT INTO ${schema}.SCORES(TEAM, SCORE) VALUES (?,?)`;

      const statement = new Statement();

      const params = [
        ['EXAMPLE', IN, CHAR], // TEAM
        [null, IN, NULL], // SCORE
      ];

      await statement.prepare(sql);
      await statement.bindParam(params);
      await statement.execute();
    });
  });

  describe('bindParameters', () => {
    before('create table for test', async () => {
      const pool = new DBPool({ url: '*LOCAL' }, { incrementSize: 2 });
      const createTable = `CREATE TABLE ${schema}.SCORES(team VARCHAR(100) ALLOCATE(20), score INTEGER)`;
      const findTable = `SELECT OBJLONGNAME FROM TABLE (QSYS2.OBJECT_STATISTICS('${schema}', '*FILE')) AS X WHERE OBJLONGNAME = 'SCORES'`;

      const tableResult = await pool.runSql(findTable);

      if (!tableResult.length) {
        await pool.runSql(createTable).catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Unable to create SCORES table');
          throw error;
        });
        // eslint-disable-next-line no-console
        console.log('before hook: CREATED SCORES TABLE');
      }
    });

    it('binds an array of values', async () => {
      const sql = `INSERT INTO ${schema}.SCORES(TEAM, SCORE) VALUES (?,?)`;

      const statement = new Statement();
      await statement.prepare(sql);
      await statement.bindParameters(['Rockets', 105]);
      await statement.execute();
    });

    it('binds a null value, tests issue #40', async () => {
      const sql = `INSERT INTO ${schema}.SCORES(TEAM, SCORE) VALUES (?,?)`;

      const statement = new Statement();
      await statement.prepare(sql);
      await statement.bindParameters(['Bulls', null]);
      await statement.execute();
    });
  });

  describe('close', () => {
    it('frees the statement object. ', async () => {
      const statement = new Statement();

      await statement.exec('SELECT * FROM QIWS.QCUSTCDT');
      const result = await statement.close();
      expect(result).to.equal(true);
    });
  });

  // TODO: Ensure This a correct test for how closeCursor() may be used.
  describe('closeCursor', () => {
    it('discards any pending results', async () => {
      const statement = new Statement();

      await statement.exec('SELECT * FROM QIWS.QCUSTCDT');
      const result = await statement.closeCursor();
      expect(result).to.equal(true);
    });
  });

  describe('commit', () => {
    it('adds changes to the database', async () => {
      const sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';

      const statement = new Statement();

      const params = [
        [9997, IN, NUMERIC], // CUSNUM
        ['Johnson', IN, CHAR], // LASTNAME
        ['A J', IN, CHAR], // INITIAL
        ['453 Example', IN, CHAR], // ADDRESS
        ['Fort', IN, CHAR], // CITY
        ['TN', IN, CHAR], // STATE
        [37211, IN, NUMERIC], // ZIP
        [1000, IN, NUMERIC], // CREDIT LIMIT
        [1, IN, NUMERIC], // change
        [150, IN, NUMERIC], // BAL DUE
        [0.00, IN, NUMERIC], // CREDIT DUE
      ];
      await statement.prepare(sql);
      await statement.bindParam(params);
      await statement.execute();
      const result = await statement.commit();
      expect(result).to.equal(true);
    });
  });

  describe('exec', () => {
    it('directly executes a given SQL String', async () => {
      const connection = new Connection();
      const statement = connection.connect().getStatement();

      const sql = 'SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = 938472';

      const result = await statement.exec(sql);

      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
    });
  });

  describe('execute', () => {
    before('init stored procedure', async () => {
      const pool = new DBPool({ url: '*LOCAL' });
      const findSp = `SELECT OBJLONGNAME FROM TABLE (QSYS2.OBJECT_STATISTICS('${schema}', '*PGM')) AS X`;

      const spResult = await pool.runSql(findSp);
      if (!spResult.length) {
        const createSP = `CREATE PROCEDURE ${schema}.MAXBAL (OUT OUTPUT DECIMAL(6,2))
      BEGIN
      DECLARE MAXBAL NUMERIC ( 6 , 2 ) ;
      SELECT MAX ( BALDUE ) INTO MAXBAL FROM QIWS.QCUSTCDT;
      SET OUTPUT = MAXBAL;
      END`;

        await pool.runSql(createSP).catch((error) => {
          // eslint-disable-next-line no-console
          console.log('UNABLE TO CREATE STORED PROCEDURE!');
          throw error;
        });
        // eslint-disable-next-line no-console
        console.log('before hook: Created Stored Procedure');
      }
    });

    it('executes a stored procedure and returns output parameter', async () => {
      const connection = new Connection();

      const statement = connection.connect().getStatement();
      const bal = 0;

      await statement.prepare(`CALL ${schema}.MAXBAL(?)`);
      await statement.bind([[bal, OUT, NUMERIC]]);
      const result = await statement.execute();

      expect(result).to.be.a('array');
      expect(result.length).to.equal(1);
      expect(result[0]).to.be.a('number');
    });
  });

  describe('fetchAll', () => {
    it('fetches All rows from the result set', async () => {
      const connection = new Connection();
      const statement = connection.connect().getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const results = await statement.fetchAll();

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
      const connection = new Connection();
      const statement = connection.connect().getStatement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const result = await statement.fetch();

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
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const fields = await statement.numFields();

      expect(fields).to.be.a('number').to.equal(11);
    });
  });

  describe('numRows', () => {
    it('returns number of rows that were effected by a query', async () => {
      const sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';

      const statement = new Statement();

      const params = [
        [9997, IN, NUMERIC], // CUSNUM
        ['Johnson', IN, CHAR], // LAST NAME
        ['A J', IN, CHAR], // INITIAL
        ['453 Example', IN, CHAR], // ADDRESS
        ['Fort', IN, CHAR], // CITY
        ['TN', IN, CHAR], // STATE
        [37211, IN, NUMERIC], // ZIP
        [1000, IN, NUMERIC], // CREDIT LIMIT
        [1, IN, NUMERIC], // change
        [150, IN, NUMERIC], // BAL DUE
        [0.00, IN, NUMERIC], // CREDIT DUE
      ];
      await statement.prepare(sql);
      await statement.bindParam(params);
      await statement.execute();
      const rows = await statement.numRows();

      expect(rows).to.be.a('number').and.to.equal(1);
    });
  });

  describe('fieldType', () => {
    it('returns the data type of the indicated column', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();

      const type = await statement.fieldType(0);

      expect(type).to.be.a('number').and.to.equal(2);
    });
  });

  describe('fieldWidth', () => {
    it('returns the field width of the indicated column', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const width = await statement.fieldWidth(0);

      expect(width).to.to.equal(7);
    });
  });

  describe('fieldNullable', () => {
    it('returns t/f if the indicated column is nullable', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const nullable = await statement.fieldNullable(0);

      expect(nullable).to.equal(false);
    });
  });

  describe('fieldName', () => {
    it('returns name of the indicated column ', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const name = await statement.fieldName(0);

      expect(name).to.equal('CUSNUM');
    });
  });

  describe('fieldPrecise', () => {
    it('returns the precision of the indicated column', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();

      const precision = await statement.fieldPrecise(0);

      expect(precision).to.equal(6);
    });
  });

  describe('fieldScale', () => {
    it('returns the scale of the indicated column', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const scale = await statement.fieldScale(0);

      expect(scale).to.equal(0);
    });
  });

  describe('setStmtAttr', () => {
    it('sets the value of a specified statement attribute', async () => {
      const attr = SQL_ATTR_FOR_FETCH_ONLY;
      const value = 1;

      const statement = new Statement();
      const result = await statement.setStmtAttr(attr, value);
      expect(result).to.equal(true);
    });
  });

  describe('getStmtAttr', () => {
    it('returns the value of specified attribute', async () => {
      const attr = SQL_ATTR_FOR_FETCH_ONLY;
      const statement = new Statement();

      const result = await statement.getStmtAttr(attr);

      expect(result).to.equal(0);
    });
  });

  describe('rollback', () => {
    it('rollback changes made on the connection', async () => {
      const statement = new Statement();

      await statement.prepare('SELECT * FROM QIWS.QCUSTCDT');
      await statement.execute();
      const result = await statement.rollback();

      expect(result).to.equal(true);
    });
  });

  describe('enableNumericTypeConversion', () => {
    it('should default to false', async () => {
      const statement = new Statement();
      expect(statement.enableNumericTypeConversion()).to.equal(false);
    });

    it('should return numeric data as strings when false', async () => {
      const sql = `select cast(-32768 as SMALLINT) MIN_SMALLINT,
      cast(+32767 as SMALLINT) MAX_SMALLINT
      from sysibm.sysdummy1`;

      const statement = new Statement();
      const result = await statement.exec(sql);
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

      const statement = new Statement();
      expect(statement.enableNumericTypeConversion(true)).to.equal(true);
      const result = await statement.exec(sql);
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

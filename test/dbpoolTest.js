/*
* Test case for the idb-pconnector DBPool Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/

const expect = require('chai').expect;
const idbp = require('../lib/idb-pconnector');
const {DBPool} = idbp;
const connPool = new DBPool({url: '*LOCAL'}, {debug: true});
const {DBPoolConnection} = require('../lib/dbPool.js');
const log = console.log;

describe('createConnetion', async () => {
  it('should instantiate a new instance of DBConnection with an `index` and appends it to the pool',
    async () => {
      let lenBefore = connPool.connections.length;

      connPool.createConnection();
      //verify the connection was added by checking the new length
      expect(connPool.connections.length).to.be.equal(lenBefore +1);
    });
});

describe('attach', async () => {
  it('should find a connection and return one', async () => {
    let conn = await connPool.attach();
    log(JSON.stringify(conn) );

    //verify that the conn returned is of type DBPoolConnection
    expect(conn).to.be.an.instanceOf(DBPoolConnection);

    //verify that it is set to unavailable in the Pool
    expect(conn.available).to.be.false;
    connPool.detach(conn);
  });
});
//could give assertion error (red herring?) , see detatch test in manualTest.js
describe('detach', async () => {
  it('should make the connection available again and clear stmts', async () => {
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

  });
});

describe('detachAll', async () => {
  it('should return all connections back to available', async () => {
    //ensure all connections reset before attaching all
    await connPool.detachAll();
    //make all of the connections unavailable
    for ( connection of connPool.connections){
      //all of the conns should be unavailable
      connPool.attach();
    }
    for ( connection of connPool.connections){
      //all of the conns should be unavailable
      expect(connection.available).to.be.false;
    }
    //now call detach all
    await connPool.detachAll();

    //make sure that are now available again.
    for ( connection of connPool.connections){
      //all of the conns should be unavailable
      expect(connection.available).to.be.true;
    }
  });

});
describe('retire', async () => {
  it('should remove a connection from the pool', async () => {
    let conn = await connPool.attach(),
      id = conn.poolIndex,
      lenBefore = connPool.connections.length;

    await connPool.retire(conn);
    //verify that conn was removed
    expect(connPool.connections.length).to.be.equal(lenBefore - 1);

    connPool.connections.forEach(element => {
      expect(element.poolIndex).to.not.equal(id);
    });
  });
});
describe('retireAll', async () => {
  it('should remove all connection from the pool', async () => {
    log('Length Before: '+ connPool.connections.length);
    await connPool.retireAll();

    log('Length After: '+ connPool.connections.length);
    expect(connPool.connections.length).to.equal(0);
  });
});
describe('runSql', async () => {
  it('should execute sql and return result set as an array if available , or return null', async () => {
    let results = await connPool.runSql('SELECT * FROM QIWS.QCUSTCDT');
    expect(results).to.be.an('array');
    expect(results.length).to.be.gt(0);
  });
});
describe('runSql', async () => {
  it('should execute sql and return result set as an array if available , or return null', async () => {
    let sql = `INSERT INTO QIWS.QCUSTCDT VALUES (6754,'Smith','A S','323 Main','Test','CA',52501,3500,2,500.99,0.98) with NONE`,
      results = await connPool.runSql(sql);

    expect(results).to.be.null;
  });
});
describe('prepare, bind, execute', async () => {
  it('should prepare bind and execute , return output params & result',
    async () => {
      let cusNum = 938472,
        results = await connPool.prepareExecute('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [cusNum]),
        {resultSet, outputParams} = results;

      console.log(results);
      expect(results).to.be.an('object');
      expect(resultSet).to.be.an('array');
      expect(resultSet.length).to.be.gt(0);
      expect(outputParams).to.be.an('array');
      expect(outputParams.length).to.equal(1);
    });
});
describe('prepare, bind, execute', async () => {
  it('should prepare bind and execute , return null ',
    async () => {
      let sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE',
        params = [
          5469, //CUSNUM
          'David', //LASTNAME
          'E D', //INITIAL
          '456 enter', //ADDRESS
          'Hill', //CITY
          'SC', //STATE
          54786, //ZIP
          7000, //CREDIT LIMIT
          2, // change
          478.32, //BAL DUE
          0.25 //CREDIT DUE
        ];

      let results = await connPool.prepareExecute(sql, params, {io: 'in'});

      expect(results).to.be.null;
    });
});
describe('prepare, bind, execute', async () => {
  it('should prepare and execute , retrun result set & not output parameters',
    async () => {
      let sql = 'SELECT * FROM QIWS.QCUSTCDT';

      let results = await connPool.prepareExecute(sql);

      expect(results.outputParams).to.be.undefined;
      expect(results.resultSet).to.be.a('array');
      expect(results.resultSet.length).to.be.gt(0);
    });
});
describe('Set Connection Attribute for Pool', async () => {
  it('should set a valid connection attribute for the pool.',
    async () => {
      let db = {url: '*LOCAL'},
        attribute = {attribute: idbp.SQL_ATTR_DBC_SYS_NAMING, value: idbp.SQL_FALSE},
        config = {incrementSize: 3, debug: true};

      const testPool = new DBPool(db, config);

      await testPool.setConnectionAttribute(attribute).catch(error =>{throw error;});

    });
});


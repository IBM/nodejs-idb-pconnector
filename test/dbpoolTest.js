/*
* Test case for the idb-pconnector DBPool Class Functions.
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -g name_of_test
*/

const expect = require('chai').expect;
const idbp = require('../lib/idb-pconnector');
const connPool = new idbp.DBPool({}, {debug: true});
const DBPoolConnection = require('../lib/dbPool.js').DBPoolConnection;
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
describe('prepare, bind, execute', async () => {
  it('should prepare bind and execute , return output params if available or result set if available',
    async () => {
      let cusNum = 938472,
        results = await connPool.prepareExecute('SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ?', [cusNum]);

      console.log(results);
      expect(results).to.be.an('array');
      expect(results.length).to.be.gt(0);
    });
});


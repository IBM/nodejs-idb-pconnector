const {DBPool} = require('idb-pconnector');
const pool = new DBPool();

async function poolExample(){
  //attach() returns an available connection from the pool.
  let connection = pool.attach(),
    statement = connection.getStatement(),
    results = null;

  try {
    await statement.prepare("CALL QIWS.GET_MEMBERS('QIWS','QCUSTCDT')");
    await statement.execute();
    results = await statement.fetchAll();

    if (results !== null){
      console.log(`\n\nResults: \n${JSON.stringify(results)}`);
    }
    //closes statements makes the Connection available for reuse.
    await pool.detach(connection);

  } catch (error){
    console.log(`Error was: \n\n${error.stack}`);
    pool.retire(connection);
  }
}

poolExample();
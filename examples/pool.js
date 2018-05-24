//adjust require path as needed
const {DBPool} = require('../lib/idb-pconnector');
//set the debug to true to view verbose output call
const pool = new DBPool({}, {debug: true});
//remember to use await you must wrap within async Function.
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
    //closes statments makes the Connection available for reuse.
    await pool.detach(connection);

  } catch (err){
    console.log(`Error was: \n\n${err.stack}`);
    pool.retire(connection);
  }
};

poolExample();
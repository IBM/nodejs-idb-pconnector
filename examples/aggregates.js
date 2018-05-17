//adjust require path as needed
const DBPool = require('../lib/idb-pconnector').DBPool;
//set the debug to true to view verbose output call
const pool = new DBPool({}, {debug: true});
//remember to use await you must wrap within async Function.
async function exampleRun(){
  //Prepare and execute an SQL statement.
  console.log('\nPrepare and Execute\n');
  let results = await pool.prepareExecute("CALL QIWS.GET_MEMBERS('QIWS','QCUSTCDT')");
  if (results !== null) {console.log(`\n\n${JSON.stringify(results)}\n\n`);}
  /*
    Params are passed as an array values.
    The order of the params indexed in the array should map to the order of the parameter markers(i.e. '?').
  */
  console.log('\nPrepare Bind & Execute\n');
  let sqlBind = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';
  let params = [4949, 'Johnson', 'T J', '452 Broadway', 'MSP', 'MN', 9810, 2000, 1, 250, 0.00];
  let results2 = await pool.prepareExecute(sqlBind, params);
  if (results2 !== null) {console.log(`\n\n${JSON.stringify(results2)}\n\n`);}
  /*
    Quickly execute a statement by providing the SQL to the runSql() function
    NOTE: Stored Procedures should use the prepareExecute() method instead.
  */
  console.log('\nRun a Query\n');
  let results3 = await pool.runSql(`SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ${params[0]}`);
  if (results3 !== null) {console.log(`\n${JSON.stringify(results3)}`);}
  console.log('\nDone');
};

exampleRun();

const {DBPool} = require('idb-pconnector');
const pool = new DBPool();

async function prepareExecuteExample(){
//Prepare and execute an SQL statement.
  try {
    /*
     * Params are passed as an array values.
     * The order of the params indexed in the array should map to the order of the parameter markers(i.e. '?').
     */
    let sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE',
      params = [4949, 'Johnson', 'T J', '452 Broadway', 'MSP', 'MN', 9810, 2000, 1, 250, 0.00],
      data = await pool.prepareExecute(sql, params);

    if (data !== null){
      let {resultSet} = data;
      console.error(`\n\n${JSON.stringify(resultSet)}\n\n`);
    }

  } catch (error){
    console.error(`Error was: ${error.stack}`);
  }
}

prepareExecuteExample();

async function runSqlExample(){
  /*
  * Directly execute a statement by providing the SQL to the runSql() function.
  * NOTE: Stored Procedures must use the prepareExecute() method instead.
  */
  try {

    let result = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');

    if (result !== null) {
      console.log(`\n${JSON.stringify(result)}`);
    }

  } catch (error){
    console.log(`Error was: ${error.stack}`);
  }
}

runSqlExample();
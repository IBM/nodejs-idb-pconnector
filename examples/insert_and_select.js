const idbp = require('idb-pconnector');
async function runInsertAndSelect() {
  try {
    let statement =  new idbp.Connection().connect().getStatement();
    await statement.prepare('INSERT INTO MYSCHEMA.TABLE VALUES (?,?)');
    await statement.bind([[2018, idbp.SQL_PARAM_INPUT, idbp.SQL_BIND_NUMERIC],
      ['Dog' , idbp.SQL_PARAM_INPUT, idbp.SQL_BIND_CHAR]
    ]);
    await statement.execute();
    let result = await statement.exec('SELECT * FROM MYSCHEMA.TABLE');
    console.log(`Select results: \n${JSON.stringify(result)}`);
  } catch (err) {
    console.log(`Error was: \n${err.stack}`);
  }
}
runInsertAndSelect();

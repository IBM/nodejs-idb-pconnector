const idbp = require('idb-pconnector');
const {Connection} = idbp;

async function execExample() {
  try {
    let statement =  new Connection().connect().getStatement();

    let result = await statement.exec('SELECT * FROM MYSCHEMA.TABLE');

    console.log(`Select results: \n${JSON.stringify(result)}`);

  } catch (error) {
    console.error(`Error was: \n${error.stack}`);
  }
}

execExample();

async function pbeExample() {
  try {
    let statement =  new Connection().connect().getStatement();

    await statement.prepare('INSERT INTO MYSCHEMA.TABLE VALUES (?,?)');

    await statement.bind([
      [2018, idbp.IN, idbp.INT],
      ['example', idbp.IN, idbp.CHAR]
    ]);
    await statement.execute();

  } catch (error) {
    console.error(`Error was: \n${error.stack}`);
  }
}

pbeExample();

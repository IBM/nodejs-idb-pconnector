const {
  Connection, Statement, IN, NUMERIC, CHAR,
} = require('../lib/idb-pconnector');

async function execExample() {
  const connection = new Connection({ url: '*LOCAL' });
  const statement = new Statement(connection);

  const results = await statement.exec('SELECT * FROM QIWS.QCUSTCDT');

  console.log(`results:\n ${JSON.stringify(results)}`);
}

execExample().catch((error) => {
  console.error(error);
});


async function pbeExample() {
  const connection = new Connection({ url: '*LOCAL' });

  const statement = new Statement(connection);

  const sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';

  await statement.prepare(sql);

  await statement.bindParam([
    [9997, IN, NUMERIC],
    ['Johnson', IN, CHAR],
    ['A J', IN, CHAR],
    ['453 Example', IN, CHAR],
    ['Fort', IN, CHAR],
    ['TN', IN, CHAR],
    [37211, IN, NUMERIC],
    [1000, IN, NUMERIC],
    [1, IN, NUMERIC],
    [150, IN, NUMERIC],
    [0.00, IN, NUMERIC],
  ]);

  await statement.execute();
}

pbeExample().catch((error) => {
  console.error(error);
});

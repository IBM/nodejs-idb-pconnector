//adjust path as needed
const idbp = require('idb-pconnector');
//set the debug to true to view verbose output
var connPool = new idbp.DBPool({}, {debug: true});
//exampleRun as IFFE to run right away.
(async function exampleRun(){
  //Prepare and execute an SQL statement.
  console.log(`\nPrepare and Execute with pe() \n`);
  let results = await connPool.pe('CALL QIWS.GET_MEMBERS("QIWS" , "QCUSTCDT");');
  console.log(`\n${JSON.stringify(results)}
   \n=====================================================================\n`);
  /*
 Params are passed as an array of otbjects.
 The order of the params indexed in the array should map to the order of the parameter markers(i.e. '?').
 Each Object should have an key 'value' and this should = the params value.
 Also the Object should have a key 'type' this should = either 'in' , 'out' , or 'inout'.
 NOTE: that if the type is input param you do not have to specify it.
 You will have to specify 'type' if you want to bind an inout or out param.
*/
  console.log(`\nPrepare Bind & Execute with pbe() \n`);
  let sqlBind = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';
  let params = [{value: 4949, type: 'in'}, {value:'Johnson'}, {value:'T J'},
    {value: '452 Broadway'}, {value: 'Win'}, {value: 'MN'}, {value: 9810},
    {value: 2000}, {value:1}, {value: 250}, {value: 0.00}
  ];
  let results2 = await connPool.pbe(sqlBind, params);
  console.log(`${JSON.stringify(results2)}
  \n=====================================================================\n`);
  //show that that the insert was a success.
  //Quickly execute a statement by providing the SQL to the query() function
  //NOTE: Stored Procedures should use the PE or PBE method instead.
  console.log('Quickly Execute with query()');
  let results3 = await connPool.query(`SELECT * FROM QIWS.QCUSTCDT WHERE CUSNUM = ${params[0].value}`);
  console.log(`\nLast Querry: \n ${JSON.stringify(results3)}
  \n=====================================================================\n`);
  console.log('Done');
})();

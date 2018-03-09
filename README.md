# idb-pconnector

 Promised-based Db2 Connector for IBM i (pre-alpha, NOT PRODUCTION READY)
 
 The objective of this project is to provide a database connector for Db2 on i that enables usage of the "await" keyword. 
 
Simple example of using a prepared statement to insert some values into a table, then querying all contents of that table:

```javascript
var dba = require("idb-pconnector");
async function runInsertAndSelect() {
    try {
        var dbStmt =  new dba.Connection().connect().getStatement();
        await dbStmt.prepare("INSERT INTO MYSCHEMA.TABLE1 VALUES (?,?)");
        await dbStmt.bind([ [2018,dba.PARM_TYPE_INPUT,2], ['Dog' ,dba.PARM_TYPE_INPUT, 1] ]);
        await dbStmt.execute();
        var res = await dbStmt.exec("SELECT * FROM MYSCHEMA.TABLE1");
        console.log("Select results: "+JSON.stringify(res));
    } catch(dbError) {
        console.log("Error is " + dbError);
        console.log(error.stack);
    } 
}

runInsertAndSelect();


```
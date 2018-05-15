# idb-pconnector

 Promised-based Db2 Connector for IBM i (pre-alpha, NOT PRODUCTION READY)
 
 The objective of this project is to provide a database connector for Db2 on i that enables usage of the "await" keyword. 
 
Simple example of using a prepared statement to insert some values into a table, then querying all contents of that table:

```javascript
var dba = require('idb-pconnector');
async function runInsertAndSelect() {
    try {
        var dbStmt =  new dba.Connection().connect().getStatement();
        await dbStmt.prepare('INSERT INTO MYSCHEMA.TABLE VALUES (?,?)');
        await dbStmt.bind([ [2018,dba.SQL_PARAM_INPUT, dba.SQL_BIND_NUMERIC], 
                            ['Dog' ,dba.SQL_PARAM_INPUT, dba.SQL_BIND_CHAR] 
        ]);
        await dbStmt.execute();
        var res = await dbStmt.exec('SELECT * FROM MYSCHEMA.TABLE');
        console.log('Select results: '+JSON.stringify(res));
    } catch(err) {
        console.log('Error was: ' + err);
    } 
}

runInsertAndSelect();



```
### Full Documentation is outlined in the docs folder
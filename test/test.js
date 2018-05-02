/*
* This is the test case document for the idb-pconnector
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -- --grep name_of_test
*
*/
const assert = require('chai').assert;
const expect = require('chai').expect;
const dba = require('idb-pconnector');


// Test Connection Class

describe('connect', () => {
  it('should return a newly connected dbconn object', async () => {
    let dbConn = new dba.Connection();
    console.log(dbConn);
    let connReturned = dbConn.connect();
    console.log(connReturned);
    expect(connReturned.dbconn).to.be.a('dbconn');
  });
});


describe('getStatement', () => {
  it('should return a new statemetnt intiialized with the the dbconn', async () => {
    let dbConn = new dba.Connection().connect();
    console.log(dbConn);
    let stmtReturned = dbConn.getStatement();
    console.log(stmtReturned);
    expect(stmtReturned.stmt).to.be.a('dbstmt');
  });
});

//if successful returns String
describe('validStmt', () => {
  it('if the SQL is valid, validStmt , should return type String', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.validStmt(sql);
    console.log('Valid Stmt output: ' + res);
    expect(res).to.be.a('string');
  });
});

describe('validStmtFail', () => {
  it('error caused by providing invalid SQL as a param', async () => {
    let sql = 'garbageInput';
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.validStmt();
    console.log('Valid Stmt output: ' + res);
    expect(res).to.be.a('string');
  });
});

//if successful returns String or Int depending on attribute
describe('getConnAttr', () => {
  it('if connection attribute exsits should return type String or Int depending on the attribute type', async () => {
    let attr = 0;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.getConnAttr(attr);
    console.log('Attrubte: ' + res);
    expect(res).to.satisfy(function(res){
      return res === 'string' || typeof res === 'number';
    });
  });
});

describe('getConnAttrFail', () => {
  it('error caused by providing invalid attr as a param', async () => {
    let attr = 50;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.getConnAttr(attr);
    console.log('Attrubte: ' + res);
    expect(res).to.satisfy(function(res){
      return res === 'string' || typeof res === 'number';
    });
  });
});

//if successful returns undefined
describe('setConnAttr', () => {
  it('sets the ConnAttr. Attrubte should be INT. Value can String or Int depending on the attribute', async () => {
    let attr = 0;
    let value = 2;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.setConnAttr(attr, value);
    expect(res).to.be.a('undefined');
  });
});
describe('setConnAttrFail', () => {
  it('error caused by providing invlaid attr and value params', async () => {
    let attr = '';
    let value = -5;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.setConnAttr(attr, value);
    expect(res).to.be.a('undefined');
  });
});

//if successful returns undefined
describe('debug', () => {
  it('prints more detailed info if choice = true. Turned off by setting choice = false.', async () => {
    let choice = true;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.debug(choice);
    expect(res).to.be.a('undefined');
  });
});
describe('debugFail', () => {
  it('error caused by using invalid param type instead of a boolean', async () => {
    let choice = 1;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.debug('choice');
    expect(res).to.be.a('undefined');
  });
});

//if successful returns undefined
describe('disconn', () => {
  it('disconnects an exsisting connection to the datbase. ', async () => {
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.disconn();
    expect(res).to.be.a('undefined');
  });
});

// need to create a Failure Case for disconn()
// describe('disconnFail' , () => {
// 	it('error caused by calling disconn before Conn was established ', async () =>{
// 			let dbConn = new dba.Connection().constructor();
// 			let res = await dbConn.disconn();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns undefined
describe('close', () => {
  it('frees the connection object. ', async () => {
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.close();
    expect(res).to.be.a('undefined');
  });
});

// need to create a Failure Case for close()
// describe('closeFail' , () => {
// 	it('error caused by calling close before Conn was established. ', async () =>{
// 			//let dbConn = new dba.Connection().connect();
// 			let res = await dbConn.close();
// 			expect(res).to.be.a('undefined');
// 	});
// })

// need to test the conn method

//Test Statement Class

//if successful returns undefined
describe('prepare', () => {
  it('Prepares valid SQL and sends it to the DBMS, if the input SQL Statement cannot be prepared error is returned. ', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.prepare(sql);
    expect(res).to.be.a('undefined');
  });
});

describe('prepareFail', () => {
  it('error caused by preparing invalid SQL as a param', async () => {
    let sql = 'SELECT * ';
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.prepare(sql);
    expect(res).to.be.a('undefined');
  });
});

//if successful returns undefined.
describe('bindParams', () => {
  it('associate parameter markers in an SQL statement to app variables', async () => {
    let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    let res = await dbStmt.bindParam([
      [9997, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CUSNUM
      ['Doe', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //LASTNAME
      ['J D', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //INITIAL
      ['123 Broadway', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //ADDRESS
      ['Hope', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //CITY
      ['WA', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //STATE
      [98101, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //ZIP
      [2000, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CREDIT LIMIT
      [1, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], // change
      [250, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //BAL DUE
      [0.00, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC] //CREDIT DUE
    ]);
    await dbStmt.execute();
    expect(res).to.be.a('undefined');
  });
});

describe('bindParamsFail', () => {
  it('error caused by not providing correct params within the params[]', async () => {
    let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    let res = await dbStmt.bindParam([
      [1, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], // change
      [250, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //BAL DUE
    ]);
    await dbStmt.execute();
    expect(res).to.be.a('undefined');
  });
});

describe('bind', () => {
  it('shorthand for the bindParams()', async () => {
    let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    let res = await dbStmt.bindParam([
      [9997, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CUSNUM
      ['Johnson', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //LASTNAME
      ['A J', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //INITIAL
      ['453 Example', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //ADDRESS
      ['Fort', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //CITY
      ['TN', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //STATE
      [37211, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //ZIP
      [1000, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CREDIT LIMIT
      [1, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], // change
      [150, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //BAL DUE
      [0.00, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC] //CREDIT DUE
    ]);
    await dbStmt.execute();
    expect(res).to.be.a('undefined');
  });
});

//if successful returns undefined
describe('close', () => {
  it('frees the statement object. ', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.exec(sql);
    let res = await dbStmt.close();
    expect(res).to.be.a('undefined');
  });
});

// describe('closeFail' , () => {
// 	it('error caused by calling close before statement was executed. ', async () =>{
// 			let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 			let dbStmt = new dba.Connection().connect().getStatement();
// 			//await dbStmt.exec(sql);
// 			let res = await dbStmt.close();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns undefined
describe('closeCursor', () => {
  it('closes any cursor associated with the dbstmt object and discards any pending results. ', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.exec(sql);
    let res = await dbStmt.closeCursor();
    expect(res).to.be.a('undefined');
  });
});

// describe('closeCursorFail' , () => {
// 	it('error caused by calling closeCursor before statement was executed. ', async () =>{
// 			let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 			let dbStmt = new dba.Connection().connect().getStatement();
// 			//await dbStmt.exec(sql);
// 			let res = await dbStmt.closeCursor();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns undefined
describe('commit', () => {
  it('adds all changes to the database that have been made on the connection since connect time ', async () => {
    let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.bindParam([
      [9997, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CUSNUM
      ['Johnson', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //LASTNAME
      ['A J', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //INITIAL
      ['453 Example', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //ADDRESS
      ['Fort', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //CITY
      ['TN', dba.SQL_PARAM_INPUT, dba.SQL_CHAR], //STATE
      [37211, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //ZIP
      [1000, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //CREDIT LIMIT
      [1, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], // change
      [150, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC], //BAL DUE
      [0.00, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC] //CREDIT DUE
    ]);
    await dbStmt.execute();
    let res = await dbStmt.commit();
    expect(res).to.be.a('undefined');
  });
});

// need to create a Failure Case for commit()
// describe('commitFail' , () => {
// 	it('error caused by calling commit before statement was executed. ', async () =>{
// 			let sql = 'INSERT INTO QIWS.QCUSTCDT(CUSNUM,LSTNAM,INIT,STREET,CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE ';
// 			let dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.prepare(sql);
// 			let res = await dbStmt.bindParam([ [4234,dba.PARM_TYPE_INPUT,2], ['sublime' ,dba.PARM_TYPE_INPUT, 1] ]);
// 			//await dbStmt.execute();
// 			let res = await dbStmt.commit();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns an array. of Type of objects
describe('exec', () => {
  it('performs action of given SQL String', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.exec(sql);
    assert.isNotObject(res, 'object was not returned');
    console.log('Type of Res = ' + typeof res);
    console.log('Select results: ' + JSON.stringify(res));
    expect(res).to.be.an('array');
  });
});

describe('execFail', () => {
  it('error caused by calling exec without params', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.exec();
    assert.isNotObject(res, 'object was not returned');
    console.log('Type of Res = ' + typeof res);
    console.log('Select results: ' + JSON.stringify(res));
    expect(res).to.be.an('array');
  });
});

//if successful returns an array of length 0?. Why,even return it if size === 0?
describe('execute', () => {
  it('retrieves results from execute function:', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    let res = await dbStmt.execute();
    console.log('Select results: ' + JSON.stringify(res));
    console.log('Size of the returned array:' + res.length);
    expect(res).to.be.a('array');
  });
});

describe('executeFail', () => {
  it('error caused by calling execute before statement was prepared.', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    //await dbStmt.prepare(sql);
    let res = await dbStmt.execute();
    console.log('Select results: ' + JSON.stringify(res));
    console.log('Size of the returned array:' + res.length);
    expect(res).to.be.a('array');
  });
});

//if successful returns an array. of Type of objects
describe('fetchAll', () => {
  it('retrieves results from execute function:', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let res = await dbStmt.fetchAll();
    console.log('Select results: ' + JSON.stringify(res));
    expect(res).to.be.a('array');
  });
});

describe('fetchAllFail', () => {
  it('error caused by calling fetchAll before results were available', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    //await dbStmt.execute();
    let res = await dbStmt.fetchAll();
    console.log('Select results: ' + JSON.stringify(res));
    expect(res).to.be.a('array');
  });
});

//if successful returns an Object of Row
//kind of weird because FetchAll returns an Array(of objects? )
describe('fetch', () => {
  it('retrieves results from execute function:', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let res = await dbStmt.fetch();
    console.log('Select results: ' + JSON.stringify(res));
    expect(res).to.be.a('object');
  });
});

describe('fetchFail', () => {
  it('error caused by calling fetch before results were available', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    //await dbStmt.execute();
    let res = await dbStmt.fetch();
    console.log('Select results: ' + JSON.stringify(res));
    expect(res).to.be.a('object');
  });
});

//if successful returns an Int
describe('numFields', () => {
  it('retrieves number of fields contained in result', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let fields = await dbStmt.numFields();
    console.log('Number of Fields: ' + fields);
    expect(fields).to.be.a('number');
  });
});

describe('numFieldsFail', () => {
  it('error caused by calling numFields before results were available.', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    //await dbStmt.execute();
    let fields = await dbStmt.numFields();
    console.log('Number of Fields: ' + fields);
    expect(fields).to.be.a('number');
  });
});

//if successful returns an Int
describe('numRows', () => {
  it('retrieves number of rows that were effected by a Querry', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let rows = await dbStmt.numRows();
    console.log('Number of Rows: ' + rows);
    expect(rows).to.be.a('number');
  });
});

describe('numRowsFail', () => {
  it('error caused by calling numRows before results were available.', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    //await dbStmt.execute();
    let rows = await dbStmt.numRows();
    console.log('Number of Rows: ' + rows);
    expect(rows).to.be.a('number');
  });
});

//if successful returns an Int
describe('fieldType', () => {
  it('requires an int index parameter. If a valid index is provided, returns the data type of the indicated column', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldType(0);
    let col2 = await dbStmt.fieldType(1);
    console.log('column 1 fieldType = : ' + col1);
    console.log('column 2 fieldType = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

describe('fieldTypeFail', () => {
  it('error caused by not providing an index as a param', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldType();
    let col2 = await dbStmt.fieldType();
    console.log('column 1 fieldType = : ' + col1);
    console.log('column 2 fieldType = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

//if successful returns an Int
describe('fieldWidth', () => {
  it('requires an int index parameter. If a valid index is provided, returns the field width of the indicated column', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldWidth(0);
    let col2 = await dbStmt.fieldWidth(1);
    console.log('column 1 fieldWidth = : ' + col1);
    console.log('column 2 fieldWidth = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

describe('fieldWidthFail', () => {
  it('error caused by not providing an index as a param', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldWidth();
    let col2 = await dbStmt.fieldWidth();
    console.log('column 1 fieldWidth = : ' + col1);
    console.log('column 2 fieldWidth = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

//if successful returns an Int but should return boolean based on doc , UPDATE 3-6-18 added logic to return the boolean. (makeBool method in idb-p)
describe('fieldNullable', () => {
  it('requires an int index parameter. If a valid index is provided, returns t/f if the indicated column can be Null', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldNullable(0);
    let col2 = await dbStmt.fieldNullable(1);
    console.log('column 1 Nullable? = : ' + col1);
    console.log('column 2 Nullable? = : ' + col2);
    //****Documnetation says it should return a boolean
    expect(col1).to.equal(false);
    expect(col2).to.equal(true);
  });
});

describe('fieldNullableFail', () => {
  it('error caused by not providing an index as a param', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldNullable();
    console.log(col1);
  });
});

//if successful returns an String
describe('fieldName', () => {
  it('requires an int index parameter. If a valid index is provided,returns name of the indicated column ', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldName(1);
    let col2 = await dbStmt.fieldName(1);
    console.log('column 1 Name = : ' + col1);
    console.log('column 2 Name = : ' + col2);
    expect(col1).to.be.a('string');
    expect(col2).to.be.a('string');
  });
});

describe('fieldNameFail', () => {
  it('error caused by providing an invalid index as a param', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldName('garbageInput');
    let col2 = await dbStmt.fieldName('fake');
    console.log('column 1 Name = : ' + col1);
    console.log('column 2 Name = : ' + col2);
    expect(col1).to.be.a('string');
    expect(col2).to.be.a('string');
  });
});

//if successful returns an Int
describe('fieldPrecise', () => {
  it('requires an int index parameter. If a valid index is provided, returns the precision of the indicated column', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldPrecise(0);
    let col2 = await dbStmt.fieldPrecise(1);
    console.log('column 1 fieldPrecision = : ' + col1);
    console.log('column 2 fieldPrecision = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

describe('fieldPreciseFail', () => {
  it('error caused by not providing an index as a param', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldPrecise();
    let col2 = await dbStmt.fieldPrecise();
    console.log('column 1 fieldPrecision = : ' + col1);
    console.log('column 2 fieldPrecision = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

//if successful returns an Int
describe('fieldScale', () => {
  it('requires an int index parameter. If a valid index is provided, returns the scale of the indicated column', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldScale(0);
    let col2 = await dbStmt.fieldScale(1);
    console.log('column 1 fieldScale = : ' + col1);
    console.log('column 2 fieldScale = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

describe('fieldScaleFail', () => {
  it('error caused by providing an invalid index as a param', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldScale('c');
    let col2 = await dbStmt.fieldScale('a');
    console.log('column 1 fieldScale = : ' + col1);
    console.log('column 2 fieldScale = : ' + col2);
    expect(col1).to.be.a('number');
    expect(col2).to.be.a('number');
  });
});

//if successful returns undefined
describe('setStmtAttr', () => {
  it('sets StmtAttr Attrubte should be INT. Value can String or Int depending on the attribute', async () => {
    let attr = dba.SQL_ATTR_FOR_FETCH_ONLY;
    let value = 1;
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.setStmtAttr(attr, value);
    expect(res).to.be.a('undefined');
  });
});

describe('setStmtAttrFail', () => {
  it('error caused by providing invalid attr and value as params', async () => {
    //invalid attr insert
    let attr = -500;
    let value = 1;
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.setStmtAttr(attr, value);
    expect(res).to.be.a('undefined');
  });
});

//if successful returns String or Int depending on attribute
describe('getStmtAttr', () => {
  it('if statement attribute exsits should return type String or Int depending on the attribute type', async () => {
    let attr = dba.SQL_ATTR_FOR_FETCH_ONLY;
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.getStmtAttr(attr);
    console.log('Smt Attr: '+res);
    expect(res).to.satisfy(function(res){
      return res === 'string' || typeof res === 'number';
    });
  });
});

describe('getStmtAttrFail', () => {
  it('error caused by providing invalid attr as a param.', async () => {
    //insert invalid attr
    let attr = 2;
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.getStmtAttr(attr);
    expect(res).to.satisfy(function(res){
      return res === 'string' || typeof res === 'number';
    });
  });
});

// whats the passing use case for next Result?
// describe('nextResult', () => {
// 	it('Determines whether there is more information available on the statement', async () => {
// 		let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 		let dbStmt = new dba.Connection().connect().getStatement();
// 		await dbStmt.prepare(sql);
// 		await dbStmt.execute();
// 		let res = await dbStmt.nextResult();
// 		expect(res).to.be.a('object');
// 	});
// })

describe('nextResultFail', () => {
  it('err', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let res = await dbStmt.nextResult();
    expect(res).to.be.a('object');
  });
});

//if successful returns undefined
describe('rollback', () => {
  it('Rollback all changes to the database that have been made on the connection', async () => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let res = await dbStmt.rollback();
    expect(res).to.be.a('undefined');
  });
});

// need to create fail case for rollback
// describe('rollbackFail', () => {
// 	it('error caused by ', async () => {
// 		let res = await dbStmt.rollback();
// 		let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 		let dbStmt = new dba.Connection().connect().getStatement();
// 		await dbStmt.prepare(sql);
// 		//await dbStmt.execute();
// 		expect(res).to.be.a('undefined');
// 	});
// })

//how to test this?
// describe('stmtError' , () => {

// 	it('Returns the diagnostic information ', async () =>{
// 			let dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.stmtError(hType, recno);

// 	});
// })

// need to create failure case for stmtErr
// describe('stmtError' , () => {

// 	it('error was caused by: ', async () =>{
// 			let dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.stmtError(hType, recno);

// 	});
// })

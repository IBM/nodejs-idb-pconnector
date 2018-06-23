/**
 * Moved Failure tests into own File.
 * Still needs to be finished.
 *  Will get back to it once the Mocha Testing issue is resolved.
*/

const assert = require('chai').assert;
const expect = require('chai').expect;
const dba = require('../lib/idb-pconnector');

// Test Connection Class

describe('validStmtFail', () => {
  it('error caused by providing invalid SQL as a param', async () => {
    let sql = 'garbageInput';
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.validStmt();
    console.log('Valid Stmt output: ' + res);
    expect(res).to.be.a('string');
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

describe('setConnAttrFail', () => {
  it('error caused by providing invlaid attr and value params', async () => {
    let attr = '';
    let value = -5;
    let dbConn = new dba.Connection().connect();
    let res = await dbConn.setConnAttr(attr, value);
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

// need to create a Failure Case for disconn()
// describe('disconnFail' , () => {
// 	it('error caused by calling disconn before Conn was established ', async () =>{
// 			let dbConn = new dba.Connection().constructor();
// 			let res = await dbConn.disconn();
// 			expect(res).to.be.a('undefined');
// 	});
// })

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

describe('prepareFail', () => {
  it('error caused by preparing invalid SQL as a param', async () => {
    let sql = 'SELECT * ';
    let dbStmt = new dba.Connection().connect().getStatement();
    let res = await dbStmt.prepare(sql);
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

// describe('closeFail' , () => {
// 	it('error caused by calling close before statement was executed. ', async () =>{
// 			let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 			let dbStmt = new dba.Connection().connect().getStatement();
// 			//await dbStmt.exec(sql);
// 			let res = await dbStmt.close();
// 			expect(res).to.be.a('undefined');
// 	});
// })

// describe('closeCursorFail' , () => {
// 	it('error caused by calling closeCursor before statement was executed. ', async () =>{
// 			let sql = "SELECT * FROM QIWS.QCUSTCDT";
// 			let dbStmt = new dba.Connection().connect().getStatement();
// 			//await dbStmt.exec(sql);
// 			let res = await dbStmt.closeCursor();
// 			expect(res).to.be.a('undefined');
// 	});
// })

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

describe('fieldNullableFail', () => {
  it('error caused by not providing an index as a param', async (done) => {
    let sql = 'SELECT * FROM QIWS.QCUSTCDT';
    let dbStmt = new dba.Connection().connect().getStatement();
    await dbStmt.prepare(sql);
    await dbStmt.execute();
    let col1 = await dbStmt.fieldNullable();
    console.log(col1);
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

// need to create failure case for stmtErr
// describe('stmtError' , () => {

// 	it('error was caused by: ', async () =>{
// 			let dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.stmtError(hType, recno);

// 	});
// })

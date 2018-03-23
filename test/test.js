/*
* This is the test case document for the idb-pconnector
* Automated test Framework Mocha & assertion library Chai was used to create the test cases
* You may need to download those modules to run these tests on your machine
* To see results of individual test cases you can run npm test -- --grep name_of_test  
*
*/
var assert = require('chai').assert;
var expect = require('chai').expect;
var dba = require('../idb-pconnector.js');

// Test Connection Class

//if successful returns String 
describe('validStmt', function () {
	it('if the SQL is valid, validStmt , should return type String', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.validStmt(sql);
		console.log("Valid Stmt output: " + res);
		expect(res).to.be.a('string');
	});
})

describe('validStmtFail', function () {
	it('error caused by providing invalid SQL as a param', async function () {
		var sql = "garbageInput";
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.validStmt();
		console.log("Valid Stmt output: " + res);
		expect(res).to.be.a('string');
	});
})

//if successful returns String or Int depending on attribute
describe('getConnAttr', function () {
	it('if connection attribute exsits should return type String or Int depending on the attribute type', async function () {
		var attr = 0;
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.getConnAttr(attr);
		console.log("Attrubte: " + res)
		expect(res).to.satisfy(function(res){
			return res === 'string' || typeof res == 'number'
		});
	});
})

describe('getConnAttrFail', function () {
	it('error caused by providing invalid attr as a param', async function () {
		var attr = 50;
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.getConnAttr(attr);
		console.log("Attrubte: " + res)
		expect(res).to.satisfy(function(res){
			return res === 'string' || typeof res == 'number'
		});
	});
})

//if successful returns undefined
describe('setConnAttr', function () {
	it('sets the ConnAttr. Attrubte should be INT. Value can String or Int depending on the attribute', async function () {
		var attr = 0;
		var value = 2;
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.setConnAttr(attr, value);
		expect(res).to.be.a('undefined');
	});
})
describe('setConnAttrFail', function () {
	it('error caused by providing invlaid attr and value params', async function () {
		var attr = "";
		var value = -5;
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.setConnAttr(attr, value);
		expect(res).to.be.a('undefined');
	});
})

//if successful returns undefined
describe('debug', function () {
	it('prints more detailed info if choice = true. Turned off by setting choice = false.', async function () {
		var choice = true;
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.debug(choice);
		expect(res).to.be.a('undefined');
	});
})
describe('debugFail', function () {
	it('error caused by using invalid param type instead of a boolean', async function () {
		var choice = 1;
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.debug("choice");
		expect(res).to.be.a('undefined');
	});
})

//if successful returns undefined
describe('disconn', function () {
	it('disconnects an exsisting connection to the datbase. ', async function () {
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.disconn();
		expect(res).to.be.a('undefined');
	});
})

// need to create a Failure Case for disconn()
// describe('disconnFail' , function() {
// 	it('error caused by calling disconn before Conn was established ', async function(){
// 			var dbConn = new dba.Connection().constructor();
// 			var res = await dbConn.disconn();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns undefined
describe('close', function () {
	it('frees the connection object. ', async function () {
		var dbConn = new dba.Connection().connect();
		var res = await dbConn.close();
		expect(res).to.be.a('undefined');
	});
})

// need to create a Failure Case for close()
// describe('closeFail' , function() {
// 	it('error caused by calling close before Conn was established. ', async function(){
// 			//var dbConn = new dba.Connection().connect();
// 			var res = await dbConn.close();
// 			expect(res).to.be.a('undefined');
// 	});
// })

// need to test the conn method

//Test Statement Class

//if successful returns undefined
describe('prepare', function () {
	it('Prepares valid SQL and sends it to the DBMS, if the input SQL Statement cannot be prepared error is returned. ', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.prepare(sql);
		expect(res).to.be.a('undefined');
	});
})

describe('prepareFail', function () {
	it('error caused by preparing invalid SQL as a param', async function () {
		var sql = "SELECT * ";
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.prepare(sql);
		expect(res).to.be.a('undefined');
	});
})

//if successful returns undefined.
describe('bindParams', function () {
	it('associate parameter markers in an SQL statement to app variables', async function () {
		var sql = "INSERT INTO AMUSSE.TABLE1 VALUES (?,?)";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		var res = await dbStmt.bindParam([
			[2099, dba.SQL_PARAM_INPUT, dba.SQL_NUMERIC],
			['Node.Js', dba.SQL_PARAM_INPUT, dba.SQL_CHAR]
		]);
		await dbStmt.execute();
		expect(res).to.be.a('undefined');
	});
})

describe('bindParamsFail', function () {
	it('error caused by not providing correct params within the params[]', async function () {
		var sql = "INSERT INTO AMUSSE.TABLE1 VALUES (?,?)";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		var res = await dbStmt.bindParam([
			[2099],
			['Node.Js']
		]);
		await dbStmt.execute();
		expect(res).to.be.a('undefined');
	});
})

//if successful returns undefined
describe('close', function () {
	it('frees the statement object. ', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.exec(sql);
		var res = await dbStmt.close();
		expect(res).to.be.a('undefined');
	});
})

// describe('closeFail' , function() {
// 	it('error caused by calling close before statement was executed. ', async function(){
// 			var sql = "SELECT * FROM AMUSSE.TABLE1";
// 			var dbStmt = new dba.Connection().connect().getStatement();
// 			//await dbStmt.exec(sql);
// 			var res = await dbStmt.close();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns undefined
describe('closeCursor', function () {
	it('closes any cursor associated with the dbstmt object and discards any pending results. ', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.exec(sql);
		var res = await dbStmt.closeCursor();
		expect(res).to.be.a('undefined');
	});
})

// describe('closeCursorFail' , function() {
// 	it('error caused by calling closeCursor before statement was executed. ', async function(){
// 			var sql = "SELECT * FROM AMUSSE.TABLE1";
// 			var dbStmt = new dba.Connection().connect().getStatement();
// 			//await dbStmt.exec(sql);
// 			var res = await dbStmt.closeCursor();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns undefined
describe('commit', function () {
	it('adds all changes to the database that have been made on the connection since connect time ', async function () {
		var sql = "INSERT INTO AMUSSE.TABLE1 VALUES (?,?)";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		var res = await dbStmt.bindParam([
			[4234, dba.PARM_TYPE_INPUT, 2],
			['sublime', dba.PARM_TYPE_INPUT, 1]
		]);
		await dbStmt.execute();
		var res = await dbStmt.commit();
		expect(res).to.be.a('undefined');
	});
})

// need to create a Failure Case for commit()
// describe('commitFail' , function() {
// 	it('error caused by calling commit before statement was executed. ', async function(){
// 			var sql = "INSERT INTO AMUSSE.TABLE1 VALUES (?,?)";
// 			var dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.prepare(sql);
// 			var res = await dbStmt.bindParam([ [4234,dba.PARM_TYPE_INPUT,2], ['sublime' ,dba.PARM_TYPE_INPUT, 1] ]);
// 			//await dbStmt.execute();
// 			var res = await dbStmt.commit();
// 			expect(res).to.be.a('undefined');
// 	});
// })

//if successful returns an array. of Type of objects
describe('exec', function () {
	it('performs action of given SQL String', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.exec(sql);
		assert.isNotObject(res, "object was not returned");
		console.log("Type of Res = " + typeof res);
		console.log("Select results: " + JSON.stringify(res))
		expect(res).to.be.an('array');
	});
})

describe('execFail', function () {
	it('error caused by calling exec without params', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.exec();
		assert.isNotObject(res, "object was not returned");
		console.log("Type of Res = " + typeof res);
		console.log("Select results: " + JSON.stringify(res))
		expect(res).to.be.an('array');
	});
})

//if successful returns an array of length 0?. Why,even return it if size == 0?
describe('execute', function () {
	it('retrieves results from execute function:', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		var res = await dbStmt.execute();
		console.log("Select results: " + JSON.stringify(res));
		console.log("Size of the returned array:" + res.length)
		expect(res).to.be.a('array');
	});
})

describe('executeFail', function () {
	it('error caused by calling execute before statement was prepared.', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		//await dbStmt.prepare(sql);
		var res = await dbStmt.execute();
		console.log("Select results: " + JSON.stringify(res));
		console.log("Size of the returned array:" + res.length)
		expect(res).to.be.a('array');
	});
})

//if successful returns an array. of Type of objects
describe('fetchAll', function () {
	it('retrieves results from execute function:', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var res = await dbStmt.fetchAll();
		console.log("Select results: " + JSON.stringify(res));
		expect(res).to.be.a('array');
	});
})

describe('fetchAllFail', function () {
	it('error caused by calling fetchAll before results were available', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		//await dbStmt.execute();
		var res = await dbStmt.fetchAll();
		console.log("Select results: " + JSON.stringify(res));
		expect(res).to.be.a('array');
	});
})

//if successful returns an Object of Row
//kind of weird because FetchAll returns an Array(of objects? )
describe('fetch', function () {
	it('retrieves results from execute function:', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var res = await dbStmt.fetch();
		console.log("Select results: " + JSON.stringify(res));
		//expect(res).to.be.a('array');
		expect(res).to.be.a('object');
	});
})

describe('fetchFail', function () {
	it('error caused by calling fetch before results were available', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		//await dbStmt.execute();
		var res = await dbStmt.fetch();
		console.log("Select results: " + JSON.stringify(res));
		//expect(res).to.be.a('array');
		expect(res).to.be.a('object');
	});
})

//if successful returns an Int 
describe('numFields', function () {
	it('retrieves number of fields contained in result', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var fields = await dbStmt.numFields();
		console.log("Number of Fields: " + fields);
		expect(fields).to.be.a('number');
	});
})

describe('numFieldsFail', function () {
	it('error caused by calling numFields before results were available.', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		//await dbStmt.execute();
		var fields = await dbStmt.numFields();
		console.log("Number of Fields: " + fields);
		expect(fields).to.be.a('number');
	});
})

//if successful returns an Int 
describe('numRows', function () {
	it('retrieves number of rows that were effected by a Querry', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var rows = await dbStmt.numRows();
		console.log("Number of Rows: " + rows);
		expect(rows).to.be.a('number');
	});
})

describe('numRowsFail', function () {
	it('error caused by calling numRows before results were available.', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		//await dbStmt.execute();
		var rows = await dbStmt.numRows();
		console.log("Number of Rows: " + rows);
		expect(rows).to.be.a('number');
	});
})

//if successful returns an Int 
describe('fieldType', function () {
	it('requires an int index parameter. If a valid index is provided, returns the data type of the indicated column', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldType(0);
		var col2 = await dbStmt.fieldType(1);
		console.log("column 1 fieldType = : " + col1);
		console.log("column 2 fieldType = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

describe('fieldTypeFail', function () {
	it('error caused by not providing an index as a param', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldType();
		var col2 = await dbStmt.fieldType();
		console.log("column 1 fieldType = : " + col1);
		console.log("column 2 fieldType = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

//if successful returns an Int 
describe('fieldWidth', function () {
	it('requires an int index parameter. If a valid index is provided, returns the field width of the indicated column', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldWidth(0);
		var col2 = await dbStmt.fieldWidth(1);
		console.log("column 1 fieldWidth = : " + col1);
		console.log("column 2 fieldWidth = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

describe('fieldWidthFail', function () {
	it('error caused by not providing an index as a param', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldWidth();
		var col2 = await dbStmt.fieldWidth();
		console.log("column 1 fieldWidth = : " + col1);
		console.log("column 2 fieldWidth = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

//if successful returns an Int but should return boolean based on doc , UPDATE 3-6-18 added logic to return the boolean. (makeBool method in idb-p)
describe('fieldNullable', function () {
	it('requires an int index parameter. If a valid index is provided, returns t/f if the indicated column can be Null', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldNullable(0);
		var col2 = await dbStmt.fieldNullable(1);
		console.log("column 1 Nullable? = : " + col1);
		console.log("column 2 Nullable? = : " + col2);
		//****Documnetation says it should return a boolean
		expect(col1).to.equal(false);
		expect(col2).to.equal(true);
	});
})

describe('fieldNullableFail', function () {
	it('error caused by not providing an index as a param', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldNullable();
		console.log(col1);
	});
})

//if successful returns an String
describe('fieldName', function () {
	it('requires an int index parameter. If a valid index is provided,returns name of the indicated column ', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldName(0);
		var col2 = await dbStmt.fieldName(1);
		console.log("column 1 Name = : " + col1);
		console.log("column 2 Name = : " + col2);
		expect(col1).to.be.a('string');
		expect(col2).to.be.a('string');
	});
})

describe('fieldNameFail', function () {
	it('error caused by providing an invalid index as a param', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldName("garbageInput");
		var col2 = await dbStmt.fieldName("fake");
		console.log("column 1 Name = : " + col1);
		console.log("column 2 Name = : " + col2);
		expect(col1).to.be.a('string');
		expect(col2).to.be.a('string');
	});
})

//if successful returns an Int 
describe('fieldPrecise', function () {
	it('requires an int index parameter. If a valid index is provided, returns the precision of the indicated column', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldPrecise(0);
		var col2 = await dbStmt.fieldPrecise(1);
		console.log("column 1 fieldPrecision = : " + col1);
		console.log("column 2 fieldPrecision = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

describe('fieldPreciseFail', function () {
	it('error caused by not providing an index as a param', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldPrecise();
		var col2 = await dbStmt.fieldPrecise();
		console.log("column 1 fieldPrecision = : " + col1);
		console.log("column 2 fieldPrecision = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

//if successful returns an Int 
describe('fieldScale', function () {
	it('requires an int index parameter. If a valid index is provided, returns the scale of the indicated column', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldScale(0);
		var col2 = await dbStmt.fieldScale(1);
		console.log("column 1 fieldScale = : " + col1);
		console.log("column 2 fieldScale = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

describe('fieldScaleFail', function () {
	it('error caused by providing an invalid index as a param', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var col1 = await dbStmt.fieldScale("c");
		var col2 = await dbStmt.fieldScale("a");
		console.log("column 1 fieldScale = : " + col1);
		console.log("column 2 fieldScale = : " + col2);
		expect(col1).to.be.a('number');
		expect(col2).to.be.a('number');
	});
})

//if successful returns undefined
describe('setStmtAttr', function () {
	it('sets StmtAttr Attrubte should be INT. Value can String or Int depending on the attribute', async function () {
		var attr = dba.SQL_ATTR_FOR_FETCH_ONLY;
		var value = 1;
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.setStmtAttr(attr, value);
		expect(res).to.be.a('undefined');
	});
})

describe('setStmtAttrFail', function () {
	it('error caused by providing invalid attr and value as params', async function () {
		//invalid attr insert
		var attr = -500;
		var value = 1;
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.setStmtAttr(attr, value);
		expect(res).to.be.a('undefined');
	});
})

//if successful returns String or Int depending on attribute
describe('getStmtAttr', function () {
	it('if statement attribute exsits should return type String or Int depending on the attribute type', async function () {
		var attr = dba.SQL_ATTR_FOR_FETCH_ONLY;
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.getStmtAttr(attr);
		console.log("Smt Attr: "+res);
		expect(res).to.satisfy(function(res){
			return res === 'string' || typeof res == 'number'
		});
	});
})

describe('getStmtAttrFail', function () {
	it('error caused by providing invalid attr as a param.', async function () {
		//insert invalid attr
		var attr = 2;
		var dbStmt = new dba.Connection().connect().getStatement();
		var res = await dbStmt.getStmtAttr(attr);
		expect(res).to.satisfy(function(res){
			return res === 'string' || typeof res == 'number'
		});
	});
})

// whats the passing use case for next Result?
// describe('nextResult', function () {
// 	it('Determines whether there is more information available on the statement', async function () {
// 		var sql = "SELECT * FROM AMUSSE.TABLE1";
// 		var dbStmt = new dba.Connection().connect().getStatement();
// 		await dbStmt.prepare(sql);
// 		await dbStmt.execute();
// 		var res = await dbStmt.nextResult();
// 		expect(res).to.be.a('object');
// 	});
// })

describe('nextResultFail', function () {
	it('err', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var res = await dbStmt.nextResult();
		expect(res).to.be.a('object');
	});
})

//if successful returns undefined
describe('rollback', function () {
	it('Rollback all changes to the database that have been made on the connection', async function () {
		var sql = "SELECT * FROM AMUSSE.TABLE1";
		var dbStmt = new dba.Connection().connect().getStatement();
		await dbStmt.prepare(sql);
		await dbStmt.execute();
		var res = await dbStmt.rollback();
		expect(res).to.be.a('undefined');
	});
})

// need to create fail case for rollback
// describe('rollbackFail', function () {
// 	it('error caused by ', async function () {
// 		var res = await dbStmt.rollback();
// 		var sql = "SELECT * FROM AMUSSE.TABLE1";
// 		var dbStmt = new dba.Connection().connect().getStatement();
// 		await dbStmt.prepare(sql);
// 		//await dbStmt.execute();
// 		expect(res).to.be.a('undefined');
// 	});
// })

//how to test this?
// describe('stmtError' , function() {

// 	it('Returns the diagnostic information ', async function(){
// 			var dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.stmtError(hType, recno);

// 	});
// })

// need to create failure case for stmtErr
// describe('stmtError' , function() {

// 	it('error was caused by: ', async function(){
// 			var dbStmt =  new dba.Connection().connect().getStatement();
// 			await dbStmt.stmtError(hType, recno);

// 	});
// })
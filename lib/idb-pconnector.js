var dba = require('idb-connector');


class Connection {
    constructor() {
        this.wrp = new dba.dbconn();
        console.log("constructed, wrp="+JSON.stringify(this.wrp));
    }
    connect(dbName) {
        if(dbName == undefined) {
            this.wrp.conn("*LOCAL");
        } else {
            this.wrp.conn(dbName);
        }
        return this;
    }
    getStatement() {
        return new Statement(this);
    }
}
class Statement {
    constructor(dbConn) {
        this.stmt = new dba.dbstmt(dbConn.wrp);
    }
    
    async exec(sqlString) {
        var stmt = this.stmt;
        return new Promise(function (resolve, reject)   {
            stmt.execSync(sqlString,function(result, dbError) {
                if(dbError == undefined)
                  resolve(result);
                reject(dbError);
            });
        });
    }
    async prepare(sqlString) {
        var stmt = this.stmt;
        return new Promise(function (resolve, reject)   {
            stmt.prepareSync(sqlString,function(result, dbError) {
                if(dbError == undefined)
                  resolve(result);
                reject(dbError);
            });
        });
    }
    async bindParam(params) {
        var stmt = this.stmt;
        return new Promise(function (resolve, reject)   {
            stmt.bindParamSync(params,function(result, dbError) {
                if(dbError == undefined)
                  resolve(result);
                reject(dbError);
            });
        });
    }
    async bind(params) { 
        return this.bindParam(params);
    }
    async execute() {
        var stmt = this.stmt;
        return new Promise(function (resolve, reject)   {
            stmt.executeSync(function(result, dbError) {
                if(dbError == undefined)
                  resolve(result);
                reject(dbError);
            });
        });
    }
}

////////////////////////////////////////////////////////////////////////
exports.Connection = Connection;
exports.Statement = Statement;
exports.PARM_TYPE_INPUT = 1;

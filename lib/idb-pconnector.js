/*
  Main entry point
  exports Connection, Statement, DBPool, and idb-connector constants
*/

const idb = require('idb-connector');
const Connection = require('./connection');
const Statement = require('./statement');
const DBPool = require('./dbPool');

module.exports.Connection = Connection;
module.exports.Statement = Statement;
module.exports.DBPool = DBPool;

// export constants from idb-connector
module.exports = { ...module.exports, ...idb };

// do not export dbstmt and dbconn from idb-connector
delete module.exports.dbstmt;
delete module.exports.dbconn;

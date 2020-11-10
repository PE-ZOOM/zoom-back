const mysql = require('mysql');

const pool  = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});


pool.query("SELECT 1 + 1",(err,row)=>{});

pool.on('error', function(err) {
  console.log('db error', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    console.log('FICHIER DB2 HANDLE ERROR')                        // lost due to either server restart, or a
  } else {                                      // connnection idle timeout (the wait_timeout
    throw err;                                  // server variable configures this)
  }
});


module.exports = pool;


// exports.connection = {
// 	query: function(){
// 		var queryArgs = Array.prototype.slice.call(arguments),
// 		events = [],
// 		eventNameIndex = {};

// 		pool.getConnection(function(err, conn){
// 			if(err){
// 				if(eventNameIndex.error){
// 					eventNameIndex.error();
// 				}
// 			}
// 			if(conn){
// 				var q = conn.query.apply(conn, queryArgs);
// 				q.on('end', function(){
// 					conn.release();
// 				});

// 				events.forEach(function(args){
// 					q.on.apply(q, args);
// 				});
// 			}
// 		});

// 		return {
// 			on: function(eventName, callback){
// 				events.Push(Array.prototype.slice.call(arguments));
// 				eventNameIndex[eventName] = callback;
// 				return this;
// 			}
// 		};
// 	}
// };

// var DB = (function (){
// 	function _query(query, params, callback){
// 		pool.getConnection(function (err, connection){
// 			if(err){
// 				connection.release();
// 				callback(null, err);
// 				throw err;
// 			}

// 			connection.query(query, params, function(err, rows){
// 				connection.release();
// 				if(!err){
// 					callback(rows);
// 				} else {
// 					callback(null, err);
// 				}
// 			});

// 			connection.on('error', function(err){
// 				connection.release();
// 				callback(null, err);
// 				throw err;
// 			});
// 		});
// 	};

// 	return {
// 		query: _query
// 	};

// })();

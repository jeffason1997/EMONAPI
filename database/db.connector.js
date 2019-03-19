const mysql = require("mysql");

var conn = mysql.createConnection({
    host: '188.166.112.138',
    user: 'JeffL',
    password: 'Jeff123',
    database: 'emonbase'
});

module.exports = conn;

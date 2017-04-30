/*
 * @Author: Jan Funke - Tyr3al 
 * @Date: 2017-04-29 22:35:54 
 * @Last Modified by: Jan Funke - Tyr3al
 * @Last Modified time: 2017-04-30 10:23:25
 */

var express = require('express')
var app = express()
var fs = require('fs');
var mysql = require('mysql')

// load settings
try {
    var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (error) {
    console.error("Error loading config file. Message: ", error);
    process.exit(1);
}

// create database connection
var connection = mysql.createConnection({
    host: config.dbSettings.host,
    user: config.dbSettings.user,
    password: config.dbSettings.password,
    database: config.dbSettings.database
});

try {
    connection.connect();
} catch (error) {
    Console.error("Connection to database failed!");
}


app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(config.serverSettings.port, function () {
    console.log('Example app listening on port', config.serverSettings.port, '!')
})
/*
 * @Author: Jan Funke - Tyr3al
 * @Date: 2017-04-29 22:35:54
 * @Last Modified by: Jan Funke - Tyr3al
 * @Last Modified time: 2017-04-30 11:05:50
 */

var express = require("express");
var app = express();
var fs = require("fs");
var mysql = require("mysql");

// load settings
try {
    var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
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
    console.error("Connection to database failed!");
}

app.get("/", function (req, res) {
    res.send("API Server fully functional!");
});

app.get("/banner/:gcCode", function (req, res) {
    // check gc code
    var regexGC = /^GC[a-zA-Z0-9]{1,8}$/g;
    if (req.params.gcCode != null) {
        var matchResult = regexGC.exec(req.params.gcCode);
        if (matchResult !== null) {
            res.send(req.params.gcCode);
        } else {
            res.send("Invalid GC-Code!");
        }
    } else {
        res.send("No GC-Code was submitted!");
    }

});


app.listen(config.serverSettings.port, function () {
    console.log("CacherSpace API Server listening on port", config.serverSettings.port, "!");
});
/*
 * @Author: Jan Funke - Tyr3al
 * @Date: 2017-04-29 22:35:54
 * @Last Modified by: Jan Funke - Tyr3al
 * @Last Modified time: 2017-04-30 16:48:52
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

app.get("/banner", function (req, res) {
    // get all banner
    connection.query(
        "SELECT g.gc_code, g.name, t.name, g.owner, b.counter, b.path " +
        "FROM geocaches g " +
        "LEFT JOIN gc_banner b " +
        "ON g.banner = b.id "+
        "LEFT JOIN gc_types t " +
        "ON g.type = t.id " +
        "WHERE g.banner IS NOT NULL;"
        , function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});

app.get("/banner/:gcCode", function (req, res) {
    // check gc code
    var regexGC = /^GC[a-zA-Z0-9]{1,8}$/g;
    var foundID = regexGC.exec(req.params.gcCode);
    if (foundID === null) {
        res.sendFile("./assets/banner/not_found.png", { "root": __dirname });
        return;
    }

    /* try to update counter
    *  if 0 affected rows -> banner unknown
    */ 
    connection.query("UPDATE gc_banner b RIGHT JOIN geocaches g ON b.id = g.banner SET b.counter = b.counter + 1 WHERE g.gc_code = ?;", req.params.gcCode, function (err, results, fields) {
        if (err) throw err;
        var foundBanner = false;
        if (results.affectedRows !== 0) {
            var filePath = "./assets/banner/" + req.params.gcCode + ".jpg";
            if (fs.existsSync(filePath)) {
                foundBanner = true;
            }
        }

        // send result
        if (foundBanner) {
            res.sendFile(filePath, { "root": __dirname });
        } else {
            res.sendFile("./assets/banner/not_found.png", { "root": __dirname });
        }          
    });
});


app.listen(config.serverSettings.port, function () {
    console.log("CacherSpace API Server listening on port", config.serverSettings.port, "!");
});
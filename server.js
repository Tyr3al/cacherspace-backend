/*
 * @Author: Jan Funke - Tyr3al 
 * @Date: 2017-04-29 22:35:54 
 * @Last Modified by: Jan Funke - Tyr3al
 * @Last Modified time: 2017-04-29 22:41:42
 */

var express = require('express')
var app = express()
var DBClient = require('mongodb').MongoClient

const _ServerPort = 3000;

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(_ServerPort, function () {
    console.log('Example app listening on port' , _ServerPort, '!')
})
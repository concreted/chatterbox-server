var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

var dbPath = './server/database.json';

var writeToDB = function (filePath, database) {
  fs.writeFile(filePath, JSON.stringify(database.results), function(err) {
    if (err) {
      return console.error(err);
    }
  });
};

var readFromDB = function(filePath, database) {
  fs.readFile(filePath,'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    database.results = JSON.parse(data);
  });
};

console.log(__dirname)

app.get('/', function(req, res){
  //res.send('hello world');
  res.sendFile(path.resolve(__dirname + '/../client/client/index.html'));
});

// This is required to load libraries for the client
app.use(express.static(path.resolve(__dirname + '/../client/client')));

app.options('/classes/messages', function(req, res) {
  res.set(defaultCorsHeaders)
  res.status(200).send()//.send(db)
});

app.get('/classes/messages', function(req, res) {
  res.set(defaultCorsHeaders)
  res.status(200).send(db)
});

app.post('/classes/messages', function(req, res) {
  res.set(defaultCorsHeaders);
  //res.status(201).send();
  req.on('data', function(data) {
    var msg = JSON.parse(data.toString());
    db.results.push(msg);
    writeToDB(dbPath, db);
    res.status(201).send(msg);
  });
});

app.listen(3000);

var db = {};
readFromDB(dbPath, db);


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "access-control-max-age": 10 // Seconds.
};
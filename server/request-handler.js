/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
var path = require("path");
var fs = require("fs");

module.exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd() + "/client/client", uri);

  var statusCode = 404;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'application/json';

  /* .writeHead() tells our server what HTTP status code to send back */
  var output = '';

  if (request.method === 'GET' || request.method === 'OPTIONS') {
    if (request.url === '/classes/messages') {
      statusCode = 200;
      output = JSON.stringify(dataStore);
      response.writeHead(statusCode, headers);
      response.end(output);
      return;
    } else if (request.url === '/classes/room1') {
      statusCode = 200;
      output = JSON.stringify(dataStore);
      response.writeHead(statusCode, headers);
      response.end(output);
      return;
    } else {
      path.exists(filename, function(exists) {
        if(!exists) {
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write("404 Not Found\n");
          response.end();
          return;
        }

        if (fs.statSync(filename).isDirectory()) {
          filename += '//index.html';
          //console.log('adding index.html', filename);
        }

        fs.readFile(filename, "binary", function(err, file) {
          if(err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
          }

          //console.log(file.toString());
          response.writeHead(200);
          response.write(file);
          response.end();
          return;
        });
      });
    }


  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      statusCode = 201;

      console.log(statusCode, headers);

      request.on('data', function(data) {
        var message = JSON.parse(data.toString());

        output = JSON.stringify(data.toString());

        dataStore.results.push(message);
        var database = JSON.stringify(dataStore);

        fs.writeFile('./server/database.json', database, function (err) {
          if (err) {
            return console.log(err);
          }
          console.log(database);
          response.writeHead(statusCode, headers);
          response.end(output);
          return;
        });
      });
    }
    if (request.url === '/classes/room1') {
      statusCode = 201;

      request.on('data', function(data) {
        messages.push(JSON.parse(data.toString()));
        // console.log(JSON.stringify(dataStore));
        // console.log(messages);
        output = JSON.stringify(dataStore);

        response.writeHead(statusCode, headers);
        response.end(output);
        return;
      });
    }
  }
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

};


var dataStore = {};

var messages = [];

// messages.push({
//   createdAt: "2014-09-29T21:59:07.402Z",
//   objectId: "HqLtDAV7t3",
//   roomname: "lobby",
//   text: "send",
//   updatedAt: "2014-09-29T21:59:07.402Z",
//   username: "ralph"
// });

dataStore.results = messages;

fs.readFile('./server/database.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  dataStore = JSON.parse(data);
  console.log(JSON.stringify(dataStore));
});


/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "access-control-max-age": 10 // Seconds.
};

var handlePOST = function() {};

/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

module.exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

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
    }
    if (request.url === '/classes/room1') {
      statusCode = 200;
      output = JSON.stringify(dataStore);
    }
    response.writeHead(statusCode, headers);
    response.end(output);
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      statusCode = 201;

      console.log(statusCode, headers);

      request.on('data', function(data) {
        messages.push(JSON.parse(data.toString()));
        // console.log(JSON.stringify(dataStore));
        // console.log(messages);
        output = JSON.stringify(data.toString());

        response.writeHead(statusCode, headers);
        response.end(output);

      });
    }
    if (request.url === '/classes/room1') {
      statusCode = 201;

      request.on('data', function(data) {
        messages.push(JSON.parse(data.toString()));
        // console.log(JSON.stringify(dataStore));
        // console.log(messages);
        output = JSON.stringify(dataStore);

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

messages.push({
  createdAt: "2014-09-29T21:59:07.402Z",
  objectId: "HqLtDAV7t3",
  roomname: "lobby",
  text: "send",
  updatedAt: "2014-09-29T21:59:07.402Z",
  username: "ralph"
});

dataStore.results = messages;

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

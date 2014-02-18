var restify = require('restify');
var mongoose = require('mongoose');

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

// 404 error
server.on('ResourceNotFoundError', function (stream) {
  console.log('someone connected!', stream);
});


server.on('ResourceNotFound', function (stream) {
  console.log('someone connected!', stream);
});


mongoose.connect('mongodb://localhost/test');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// CORS
server.use(restify.CORS());
server.use(restify.fullResponse());

// Catch errors
server.on('uncaughtException', function(req, res, route, err) {
  console.log(err.stack);
});

// server.on('MethodNotAllowed', function(req, res, next) {
//   console.log("Method not allowed", req);
// });

// server.on('UnsupportedMediaType', function(req, res, next) {
//   console.log("UnsupportedMediaType", req);
// });

server.on('NotFound', function(req, res, next) {
  console.log("NotFound", req.url);
  res.send(new restify.ResourceNotFoundError("Could not find: " + req.url));
  return next();
});

// Routes
var routes = require('./routes')(server);

server.listen(8888, function () {
  console.log('%s listening at %s', server.name, server.url);
});
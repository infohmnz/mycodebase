
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3010);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'test');

var TodoSchema = require('./models/Todo.js').TodoSchema;
var Todo = db.model('todos', TodoSchema);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

app.get('/', routes.index(Todo));
app.get('/users', user.list);
app.get('/todos.json', routes.get(Todo));

app.put('/todo/:id.json', routes.update(Todo));

app.post('/todo.json', routes.addTodo(Todo));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

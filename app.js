'use strict';

var express = require('express'),
    pg = require('pg'),
    pry = require('pryjs'),
    bodyParser = require('body-parser');

var connectionString = "postgresql://trevorlundberg@localhost:5432/grocery_list";
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var app = express();

app.use(urlencodedParser);

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/groceries', function(req, res){

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query("SELECT groceries.id, groceries.grocery_name FROM groceries", function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      var table = result.rows;
      client.end();
      res.render('groceries', {table: table});
    });
  });
});

app.post('/groceries', function(req, res, next){
  var grocery_name = req.body.grocery_name;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    client.query("INSERT INTO groceries(grocery_name) VALUES($1)", [grocery_name], function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      res.redirect('/groceries');
    });
  });
});

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});

var express = require('express');
var app = express();
var fs = require("fs");
var usersA = require('./MongoGetAll.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url = "mongodb://root:mongo123@ds127129.mlab.com:27129/usersdb";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/listUsers', function (req, resp) {
   //fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
	  //res.writeHead(200, {'Content-Type': 'text/event-stream'});
	  //var str = usersA.toString();
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("usersdb");
  var collectionU = dbo.collection("users");
 
  var vop;
  collectionU.find({}).toArray(function(err, res) {
    if (err) throw err;
    //console.log('From Mongo' + JSON.stringify(res));
	vop = JSON.stringify(res);
	resp.send(vop);
	//console.log('data',data);
	//resp.end(res)
    //db.close();
	//obj = JSON.stringify(res);
  });
  
  db.close();
});



      
})

app.post('/addUser',urlencodedParser, function (req, resp) {
	
	//var response;
	 response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   // First read existing users.
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("usersdb");
  var collectionU = dbo.collection("users");
 
  
  collectionU.insertOne(response,function(err, res) {
    if (err) throw err;
    //console.log('From Mongo' + JSON.stringify(res));
	console.log("Added");
	 resp.end(JSON.stringify(response) + 'Successfullt Added');
  });
  
  db.close();
});

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
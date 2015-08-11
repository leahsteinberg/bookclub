var express = require('express');
var app = express();
var secrets = require('secrets');

var path = require('path');
var amazon = require('amazon-product-api');
console.log(amazon);

var server = app.listen(4004, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("BookClub App listening at http://%s:%s ~~~", host, port);
});

app.use("/public", express.static(path.resolve('../public')));

app.get('/', function(req, res) {
  res.sendFile(path.resolve('../public/e.html'));//'../public/d.html');
});

app.get('/sentence', function(req, res){
	console.log("in sentence! req is ", req.query);
	// var tag = req.query.tag;
	// response = p.sample(p.noS(p.entriesWithTag(tag)));
	// res.send(JSON.stringify(response));
});


var tryAPI = function(){

var client = amazon.createClient({
  awsId: "aws ID",
  awsSecret: "aws Secret",
  awsTag: "aws Tag"
});


}




var express = require('express');
var app = express();
var secrets = require('../secrets.js');

var path = require('path');
var amazon = require('amazon-product-api');
var client = amazon.createClient({
    awsId: secrets.awsId,
    awsSecret: secrets.awsSecret,
    awsTag: secrets.awsAssociateTag
  });


var server = app.listen(4004, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("BookClub App listening at http://%s:%s ~~~", host, port);
});

app.use("/public", express.static(path.resolve('../public')));

app.get('/', function(req, res) {
  res.sendFile(path.resolve('../public/main.html'));
});

app.get('/search', function(req, res){
	var search = req.query.searchString;
	 client.itemSearch({
	    keywords: req.query.searchString,
	    searchIndex: 'Books',
	    responseGroup: 'ItemAttributes,Images'
	}).then(function(results){
	    //console.log("success,", results.slice(0, 3));
	    res.send(JSON.stringify(results.slice(0, 5)))
	    // send response here


	}).catch(function(err){
	    console.log("error", err["Error"][0]["Code"]);
	});
});


var tryAPI = function(){
  client.itemSearch({
      keywords: 'Harry Potter',
      searchIndex: 'Books',
      responseGroup: 'ItemAttributes,Images'
  }).then(function(results){
    //console.log("success,", results);
  }).catch(function(err){
    console.log("error", err["Error"][0]["Code"]);
    console.log("Api Not working!!!")
  });
}


tryAPI();


var express = require('express');
var port = process.env.PORT || 5000;
var app = express();

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/src', express.static(__dirname + '/src'));


app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
}).listen(port, function() {
    console.log("Listening on " + port);
});
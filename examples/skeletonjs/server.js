var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', main);
app.get('/all', main);
app.get('/active', main);
app.get('/completed', main);

function main(req,res) {
	res.sendFile(__dirname + '/public/index.html');
}

app.listen(8000, function(err) {
	if(err) {
		return 'An error has occured: ' + err.message;
	}
	console.log('Listening on port 8000!');
});
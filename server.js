var clarifai = require('./clarifai_node.js');
var clientID = "Ujn2c65_Y-9-FyZRNDg5GTew2n6g5apT1DGh8BX-";
var clientSecret = "DoOB5xDgVAcZqxuL1M2kXDaulw_sw6LwzY_Qcip8";
clarifai.initAPI(clientID, clientSecret);

function exampleTagSingleURL() {
	var testImageURL = 'http://www.clarifai.com/img/metro-north.jpg';
	var ourId = "train station 1"; // this is any string that identifies the image to your system

	Clarifai.setRequestTimeout( 100 ); // in ms - expect: ensure no timeout 

	Clarifai.tagURL( testImageURL , ourId, commonResultHandler );
}

var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
  exampleTagSingleURL();
}).listen(port);


// images:
// http://i.imgur.com/mGafnMa.png
// http://gallery.photo.net/photo/3204336-lg.jpg
// http://gallery.photo.net/photo/3204337-lg.jpg
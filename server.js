var display = "";
var Clarifai = require('./clarifai_node.js');
var clientID = "Ujn2c65_Y-9-FyZRNDg5GTew2n6g5apT1DGh8BX-";
var clientSecret = "DoOB5xDgVAcZqxuL1M2kXDaulw_sw6LwzY_Qcip8";
var tagsToScores = {};
var scoreOfLatestGuess = 0;
Clarifai.initAPI(clientID, clientSecret);

// Setting a throttle handler lets you know when the service is unavailable because of throttling. It will let
// you know when the service is available again. Note that setting the throttle handler causes a timeout handler to
// be set that will prevent your process from existing normally until the timeout expires. If you want to exit fast
// on being throttled, don't set a handler and look for error results instead.

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function commonResultHandler( err, res ) {
	if (err != null) {
        if (typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
            console.log("TAG request timed out");
        } else if (typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
            console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");
        } else if (typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
            console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");
        } else if (typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
            console.log("Clarifai host is throttling this application.");
        } else {
            console.log("TAG request encountered an unexpected error: ");
            console.log(err);
        }
    }
	else {
			// if some images were successfully tagged and some encountered errors,
			// the status_code PARTIAL_ERROR is returned. In this case, we inspect the
			// status_code entry in each element of res["results"] to evaluate the individual
			// successes and errors. if res["status_code"] === "OK" then all images were 
			// successfully tagged.
			if( typeof res["status_code"] === "string" && 
				( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {

				// the request completed successfully
				for( i = 0; i < res.results.length; i++ ) {
					if( res["results"][i]["status_code"] === "OK" ) {
						var numTags = res["results"][i].result["tag"]["classes"].length;
						var sumOfInverseUnideductedProbabilities = 0;

						for (j = 0; j < numTags; j++) {
							sumOfInverseUnideductedProbabilities += 1 / (1 - res["results"][i].result["tag"]["probs"][j]);
						}

						for (j = 0; j < numTags; j++) {
							var score = Math.round(100 / (1 - res["results"][i].result["tag"]["probs"][j]) / sumOfInverseUnideductedProbabilities);

							if (score >= 5) {
								tagsToScores[res["results"][i].result["tag"]["classes"][j]] = score;
							}
						}

						console.log(tagsToScores);
					}
					else {
						console.log( 'docid='+res.results[i].docid +
							' local_id='+res.results[i].local_id + 
							' status_code='+res.results[i].status_code +
							' error = '+res.results[i]["result"]["error"] );
					}
				}

				getScoreOfGuess("cat");
				getScoreOfGuess("nonsenseXYZ"); // expect 0

			}		
	}
	callback();
}

function getScoreOfGuess(word) {
	scoreOfLatestGuess = tagsToScores[word];

	if (scoreOfLatestGuess === undefined) {
		scoreOfLatestGuess = 0;
	}

	console.log(scoreOfLatestGuess);
}

// exampleTagSingleURL() shows how to request the tags for a single image URL
function exampleTagSingleURL() {
	var testImageURL = 'https://lh3.googleusercontent.com/-xlXLYPjhRKE/VH-pLDYTXpI/AAAAAAAAIY8/5WpXe-gfY2I/w640-h360/white-cat-blue-eyes-640x360.jpg';
	var ourId = "train station 1"; // this is any string that identifies the image to your system

	//Clarifai.setRequestTimeout( 100 ); // in ms - expect: ensure no timeout 

	Clarifai.tagURL( testImageURL , ourId, commonResultHandler );
}


exampleTagSingleURL();

function callback() {

	var http = require('http')
	var port = process.env.PORT || 1337;
	http.createServer(function(req, res) {
	  	res.writeHead(200, { 'Content-Type': 'text/plain' });
	  	res.end(display);
		Clarifai.clearThrottleHandler();
	}).listen(port);
}


// images:
// "http://www.clarifai.com/img/metro-north.jpg"; --- train station
// http://i.imgur.com/mGafnMa.png --- collage
// http://gallery.photo.net/photo/3204336-lg.jpg --- dark room (not a very good image for this purpose)
// http://gallery.photo.net/photo/3204337-lg.jpg --- owl
// https://lh3.googleusercontent.com/-xlXLYPjhRKE/VH-pLDYTXpI/AAAAAAAAIY8/5WpXe-gfY2I/w640-h360/white-cat-blue-eyes-640x360.jpg --- cat
// http://vapable.com/wp-content/uploads/2013/08/raspberry-flavour-e-liquid.jpg --- raspberries
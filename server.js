var display = "";
var Clarifai = require('./clarifai_node.js');
var clientID = "Ujn2c65_Y-9-FyZRNDg5GTew2n6g5apT1DGh8BX-";
var clientSecret = "DoOB5xDgVAcZqxuL1M2kXDaulw_sw6LwzY_Qcip8";
var tagsToScores = {};
var playerOneRoundScore = 0;
var playerTwoRoundScore = 0;
var playerOnePermanentScore = 0;
var playerTwoPermanentScore = 0;
var playerOneStrikes = 0;
var playerTwoStrikes = 0;
var scoreOfLatestGuess = 0;
var totalAnswers = 0;
var correctGuessesThisRound = 0;
var currentRound = 0;
var images = [
	'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg', // fallen leaf
	'http://www.clarifai.com/img/metro-north.jpg', // train station
	'http://vapable.com/wp-content/uploads/2013/08/raspberry-flavour-e-liquid.jpg', // raspberries
	'http://gallery.photo.net/photo/3204337-lg.jpg', // owl
	'https://lh3.googleusercontent.com/-xlXLYPjhRKE/VH-pLDYTXpI/AAAAAAAAIY8/5WpXe-gfY2I/w640-h360/white-cat-blue-eyes-640x360.jpg', // kitty!
	'http://www.menucool.com/slider/jsImgSlider/images/image-slider-2.jpg' // movie poster for Up
];

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
								totalAnswers++;
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

				handleGuess("cat", 1);
				handleGuess("nonsenseXYZ", 2); // expect 0

			}		
	}
	callback();
}

function newRound() {
	playerOneRoundScore = 0;
	playerTwoRoundScore = 0;
	playerOneStrikes = 0;
	playerTwoStrikes = 0;
	correctGuessesThisRound = 0;
	totalAnswers = 0;
	tagsToScores = {};
	currentRound = (currentRound + 1) % images.length;
}

function handleGuess(word, playerNumber) {
	scoreOfLatestGuess = tagsToScores[word];

	if (scoreOfLatestGuess === undefined) {
		scoreOfLatestGuess = 0;
	}

	console.log(scoreOfLatestGuess);

	if (playerNumber == 1) {
		if (playerTwoStrikes == 3) { // opportunity to steal
			if (scoreOfLatestGuess > 0) { // successful steal
				playerOneRoundScore += scoreOfLatestGuess;
				playerOneRoundScore += playerTwoRoundScore;
				playerOnePermanentScore += playerOneRoundScore;
			} else {
				playerTwoPermanentScore += playerTwoRoundScore;
			}

			newRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerOneRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;

				if (correctGuessesThisRound == totalAnswers) {
					playerOnePermanentScore += playerOneRoundScore;

					newRound();
				}
			} else {
				playerOneStrikes++;
			}
		}
	}

	if (playerNumber == 2) {
		if (playerOneStrikes == 3) { // opportunity to steal
			if (scoreOfLatestGuess > 0) { // successful steal
				playerTwoRoundScore += scoreOfLatestGuess;
				playerTwoRoundScore += playerOneRoundScore;
				playerTwoPermanentScore += playerTwoRoundScore;
			} else {
				playerOnePermanentScore += playerOneRoundScore;
			}

			newRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerTwoRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;

				if (correctGuessesThisRound == totalAnswers) {
					playerTwoPermanentScore += playerTwoRoundScore;

					newRound();
				}
			} else {
				playerTwoStrikes++;
			}
		}
	}
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

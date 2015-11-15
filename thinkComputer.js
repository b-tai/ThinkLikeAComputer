var clientID = "Ujn2c65_Y-9-FyZRNDg5GTew2n6g5apT1DGh8BX-";
var clientSecret = "DoOB5xDgVAcZqxuL1M2kXDaulw_sw6LwzY_Qcip8";

var Clarifai;
window.onload = function() {
	require(['./clarifai_node.js'], function (Clarifai) {
    	Clarifai.initAPI(clientID, clientSecret);
    	newImage();
	});
}

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function commonResultHandler(err, res) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			console.log("TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			console.log("Clarifai host is throttling this application.");				
		}
		else {
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
				(res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR")) {

				// the request completed successfully
				for(i = 0; i < res.results.length; i++) {
					if( res["results"][i]["status_code"] === "OK" ) {
						console.log( 'docid='+res.results[i].docid +
							' local_id='+res.results[i].local_id +
							' tags='+res["results"][i].result["tag"]["classes"]);
						tags = res["results"][i].result["tag"]["classes"];
					}
					else {
						console.log( 'docid='+res.results[i].docid +
							' local_id='+res.results[i].local_id + 
							' status_code='+res.results[i].status_code +
							' error = '+res.results[i]["result"]["error"]);
					}
				}

			}		
	}
	console.log(tags);
}

// exampleTagSingleURL() shows how to request the tags for a single image URL
function exampleTagSingleURL(url) {
	var testImageURL = url;

	Clarifai.tagURL(testImageURL , "", commonResultHandler); // second arg is ourId which we don't care about
}

function newImage() {
	console.log('gets here');
	exampleTagSingleURL("http://i.imgur.com/mGafnMa.png"); // hardcoded
	console.log('and here');
}

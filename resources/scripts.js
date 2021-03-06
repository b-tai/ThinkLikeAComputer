var tagsToScores = {};
var wordsToElementId = {};

var playerOneRoundScore = 0;
var playerTwoRoundScore = 0;
var playerOnePermanentScore = 0;
var playerTwoPermanentScore = 0;
var playerOneStrikes = 0;
var playerTwoStrikes = 0;
var scoreOfLatestGuess = 0;
var totalAnswers = 5;
var correctGuessesThisRound = 0;
var currentRound = 0;
var currentPlayer = 1;

window.onload = function() {
	for (i = 1; i <= 5; i++) {
		var ithTag = document.getElementById('word' + i).innerHTML.split(", ")[0];
		var ithScore = document.getElementById('word' + i).innerHTML.split(", ")[1];

		tagsToScores[ithTag] = ithScore;
		wordsToElementId[ithTag] = 'word' + i;
	}

	document.getElementById('p1Button').onclick = function() {
		var input = document.getElementById('p1input').value;
		if (currentPlayer == 1 && input != '') {
			handleGuess(input, 1);
		}
	}

	document.getElementById('p2Button').onclick = function() {
		var input = document.getElementById('p2input').value;
		if (currentPlayer == 2 && input != '') {
			handleGuess(input, 2);
		}
	}

	$("#p1input").keyup(function(event){
    	if(event.keyCode == 13){
        	$("#p1Button").click();
    	}
	});

	$("#p2input").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#p2Button").click();
	    }
	});

	setVisibilityOfPlayerActions();
}

function setVisibilityOfPlayerActions() {
	if (currentPlayer == 1) {
		document.getElementById('p1Button').style.visibility = "visible";
		document.getElementById('p1input').style.visibility = "visible";
		document.getElementById('p1input').focus();
		document.getElementById('p2Button').style.visibility = "hidden";
		document.getElementById('p2input').style.visibility = "hidden";
	} else if (currentPlayer == 2) {
		document.getElementById('p1Button').style.visibility = "hidden";
		document.getElementById('p1input').style.visibility = "hidden";
		document.getElementById('p2Button').style.visibility = "visible";
		document.getElementById('p2input').style.visibility = "visible";
		document.getElementById('p2input').focus();
	} else {
		document.getElementById('p1Button').style.visibility = "hidden";
		document.getElementById('p1input').style.visibility = "hidden";
		document.getElementById('p2Button').style.visibility = "hidden";
		document.getElementById('p2input').style.visibility = "hidden";
	}
}

var strikes = "";
function handleGuess(word, playerNumber) {
	scoreOfLatestGuess = tagsToScores[word];

	if (scoreOfLatestGuess === undefined) {
		scoreOfLatestGuess = 0;
	}

	scoreOfLatestGuess = parseInt(scoreOfLatestGuess);

	if (playerNumber == 1) {
		if (playerTwoStrikes == 3) { // opportunity to steal
			if (scoreOfLatestGuess > 0) { // successful steal
				playerOneRoundScore += scoreOfLatestGuess;
				playerOneRoundScore += playerTwoRoundScore;
				playerOnePermanentScore += playerOneRoundScore;
				playerTwoRoundScore = 0;
				document.getElementById(wordsToElementId[word]).style.visibility = "visible";
				document.getElementById("p1pts").innerHTML = playerOneRoundScore;
				document.getElementById("p2pts").innerHTML = playerTwoRoundScore;
				currentPlayer = 0;
				alert('Success! Player 1 wins with ' + playerOneRoundScore + ' points!');
			} else {
				playerTwoPermanentScore += playerTwoRoundScore;
				currentPlayer = 0;
				alert('The steal fails! Player 2 wins with ' + playerTwoRoundScore + ' points!');
			}

			//clearRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerOneRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;
				document.getElementById(wordsToElementId[word]).style.visibility = "visible";

				if (correctGuessesThisRound == totalAnswers) {
					playerOnePermanentScore += playerOneRoundScore;
					currentPlayer = 0;
					alert('Player 1 wins with ' + playerOneRoundScore + ' points!');
					//clearRound();
				}
			} else {
				playerOneStrikes++;
				strikes = strikes + "X ";
				document.getElementById("wrong").innerHTML = strikes;

				if (playerOneStrikes == 3) {
					currentPlayer = 2;
					alert('Player 2 has the chance to steal!');
				}
			}
		}
	}

	if (playerNumber == 2) {
		if (playerOneStrikes == 3) { // opportunity to steal
			if (scoreOfLatestGuess > 0) { // successful steal
				playerTwoRoundScore += scoreOfLatestGuess;
				playerTwoRoundScore += playerOneRoundScore;
				playerTwoPermanentScore += playerTwoRoundScore;
				playerOneRoundScore = 0;
				document.getElementById(wordsToElementId[word]).style.visibility = "visible";
				document.getElementById("p1pts").innerHTML = playerOneRoundScore;
				document.getElementById("p2pts").innerHTML = playerTwoRoundScore;
				currentPlayer = 0;
				alert('Success! Player 2 wins with ' + playerTwoRoundScore + ' points!');
			} else {
				playerOnePermanentScore += playerOneRoundScore;
				currentPlayer = 0;
				alert('The steal fails! Player 1 wins with ' + playerOneRoundScore + ' points!');
			}

			//clearRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerTwoRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;
				document.getElementById(wordsToElementId[word]).style.visibility = "visible";

				if (correctGuessesThisRound == totalAnswers) {
					playerTwoPermanentScore += playerTwoRoundScore;
					currentPlayer = 0;
					alert('Player 2 wins with ' + playerTwoRoundScore + ' points!');
					//clearRound();
				}
			} else {
				playerTwoStrikes++;
				strikes = strikes + "X ";
				document.getElementById("wrong").innerHTML = strikes;
				if (playerTwoStrikes == 3) {
					currentPlayer = 1;
					alert('Player 1 has the chance to steal!');
				}
			}
		}
	}

	setVisibilityOfPlayerActions();
	document.getElementById("p1pts").innerHTML = playerOneRoundScore;
	document.getElementById("p2pts").innerHTML = playerTwoRoundScore;
	document.getElementById("p1input").value = "";
	document.getElementById("p2input").value = "";
}

function clearRound() {
	playerOneRoundScore = 0;
	playerTwoRoundScore = 0;
	playerOneStrikes = 0;
	playerTwoStrikes = 0;
	correctGuessesThisRound = 0;
	totalAnswers = 0;
	tagsToScores = {};
	currentRound++;
	currentPlayer = 0;
}

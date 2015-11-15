var tagsToScores = {};
var wordsToElementId = {};

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
var currentPlayer = 0;

window.onload = function() {
	for (i = 1; i <= 5; i++) {
		var ithTag = document.getElementById('word' + i).innerHTML.split(", ")[0];
		var ithScore = document.getElementById('word' + i).innerHTML.split(", ")[1];

		tagsToScores[ithTag] = ithScore;
		wordsToElementId[ithTag] = 'word' + i;
	}


	document.getElementById('p1Button').onclick = function() {
		if (currentPlayer == 0) {
			currentPlayer = 1;
		}

		if (currentPlayer == 1) {
			handleGuess(document.getElementById('p1input').value, 1);
		}
	}

	document.getElementById('p2Button').onclick = function() {
		if (currentPlayer == 0) {
			currentPlayer = 2;
		}

		if (currentPlayer == 2) {
			handleGuess(document.getElementById('p2input').value, 2);
		}
	}
}

var strikes = "";
function handleGuess(word, playerNumber) {
	scoreOfLatestGuess = tagsToScores[word];

	if (scoreOfLatestGuess === undefined) {
		scoreOfLatestGuess = 0;
	}

	scoreOfLatestGuess = parseInt(scoreOfLatestGuess);

	console.log(scoreOfLatestGuess);

	if (playerNumber == 1) {

		if (playerTwoStrikes == 3) { // opportunity to steal
			if (scoreOfLatestGuess > 0) { // successful steal
				playerOneRoundScore += scoreOfLatestGuess;
				playerOneRoundScore += playerTwoRoundScore;
				playerOnePermanentScore += playerOneRoundScore;
				playerTwoRoundScore = 0; 
			} else {
				playerTwoPermanentScore += playerTwoRoundScore;
			}

			//clearRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerOneRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;


				if (correctGuessesThisRound == totalAnswers) {
					playerOnePermanentScore += playerOneRoundScore;
					//clearRound();
				}
			} else {
				playerOneStrikes++;
				strikes = strikes + "X ";
				document.getElementById("wrong").innerHTML = strikes;

				if (playerOneStrikes == 3) {
					currentPlayer = 2;
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
			} else {
				playerOnePermanentScore += playerOneRoundScore;
			}

			//clearRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerTwoRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;

				if (correctGuessesThisRound == totalAnswers) {
					playerTwoPermanentScore += playerTwoRoundScore;
					//clearRound();
				}
			} else {
				playerTwoStrikes++;
				strikes = strikes + "X ";
				document.getElementById("wrong").innerHTML = strikes;
				if (playerTwoStrikes == 3) {
					currentPlayer = 1;
				}
			}
		}
	}

	document.getElementById("p1pts").innerHTML = playerOneRoundScore;
	document.getElementById("p2pts").innerHTML = playerTwoRoundScore;
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

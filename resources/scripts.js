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

window.onload = function() {
	document.getElementById('p1Button').onclick = function(){
		alert("button clicked!");
	}

	document.getElementById('p2Button').onclick = function(){
		alert("button clicked! 2");
	}
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

function newRound() {
	playerOneRoundScore = 0;
	playerTwoRoundScore = 0;
	playerOneStrikes = 0;
	playerTwoStrikes = 0;
	correctGuessesThisRound = 0;
	totalAnswers = 0;
	tagsToScores = {};
	currentRound++;
}

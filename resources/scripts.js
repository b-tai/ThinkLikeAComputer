var tagsToScores = {
	document.getElementById('word1').split[", "][0] : document.getElementById('word1').split[", "][1],
	document.getElementById('word2').split[", "][0] : document.getElementById('word2').split[", "][1],
	document.getElementById('word3').split[", "][0] : document.getElementById('word3').split[", "][1],
	document.getElementById('word4').split[", "][0] : document.getElementById('word4').split[", "][1],
	document.getElementById('word5').split[", "][0] : document.getElementById('word5').split[", "][1]
};
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
	document.getElementById('p1Button').onclick = function() {
		if (currentPlayer == 0) {
			currentPlayer = 1;
		}

		if (currentPlayer == 1) {
			handleGuess(document.getElementById(p1input)), 1);
		}
	}

	document.getElementById('p2Button').onclick = function() {
		if (currentPlayer == 0) {
			currentPlayer = 2;
		}

		if (currentPlayer == 2) {
			handleGuess(document.getElementById(p2input)), 2);
		}
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

			clearRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerOneRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;

				if (correctGuessesThisRound == totalAnswers) {
					playerOnePermanentScore += playerOneRoundScore;
					clearRound();
				}
			} else {
				playerOneStrikes++;

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
			} else {
				playerOnePermanentScore += playerOneRoundScore;
			}

			clearRound();
		} else { // normal play
			if (scoreOfLatestGuess > 0) {
				playerTwoRoundScore += scoreOfLatestGuess;
				correctGuessesThisRound++;
				tagsToScores[word] = 0;

				if (correctGuessesThisRound == totalAnswers) {
					playerTwoPermanentScore += playerTwoRoundScore;
					clearRound();
				}
			} else {
				playerTwoStrikes++;

				if (playerTwoStrikes == 3) {
					currentPlayer = 1;
				}
			}
		}
	}
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

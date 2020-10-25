const EloRank = require('./elo');

var elo = new EloRank(15);

var playerA = 1200;
var playerB = 1400;

console.log(playerA, playerB);

//Gets expected score for first parameter
var expectedScoreA = elo.getExpected(playerA, playerB);
var expectedScoreB = elo.getExpected(playerB, playerA);

//update score, 1 if won 0 if lost
playerA = elo.updateRating(expectedScoreA, 1, playerA);
playerB = elo.updateRating(expectedScoreB, 0, playerB);

console.log(playerA, playerB);
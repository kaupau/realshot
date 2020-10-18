var player = { 
    uid: 1032643,
    name: "John", 
    ELO: 1234 , 
    location: "Milwaukee" , 
    photo: "/etc/mongodb/JohnPhoto.jpg", 
    gameHistory: [  ], 
    followers: [  ],
    following: [  ], 
};

var game = { 
    uid: "someAlpaNumericCode", 
    gametype: "free throw", 
    shots: 20, 
    player1: player.uid, 
    player2: player.uid, 
    player1_location: "40° 26′ 46″ N 79° 58′ 56″ W",  
    player2_location: "79° 26′ 46″ N 40° 58′ 56″ W",  
    player1_score: 15, 
    player2_score: 12, 
    date: "9/1/2020 16H43M",    // save as UNIX timestamp so you can easily convert to different time zones 
} 

var onlinePlayers = {
    list: [],
    count: 3,
} 

var inGamePlayers = {
    list: [],
    count: 3,
} 


function getUserGames( player ) {

} 
function getUserWins( player ) {

} 
function getQuickPlayOpponent( ) {       // returns online opponent online

} 
function setPlayerOnline( player ) {     // adds user to onlinePlayers[ ] for when user is actively looking for a new game

} 
function setPlayerOffline( player ) {    // removes user from onlinePlayers[ ]

} 
function setPlayerInGame( player ) {

} 
function findFriendsOnline( player.friends[ ] ) {    // returns friends in onlinePlaers && inGamePlayers, must return which list they are in

} 
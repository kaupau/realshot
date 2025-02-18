const mongoose = require('mongoose');
const model = require('./models');
const EloRank = require('./elo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const jwtKey = "realshot";  // move this to a config file when deploying
var port = process.env.PORT || 3005;
app.use(express.json());
//app.use(cors());

app.listen(port, function () {
  console.log('PORT: ' + port);
});

app.post('/api/users/register', async (req, res) => {
    const status = await createPlayer(req.body.name, req.body.email, req.body.password, "1", req.body.location, "./pic", []);
    return res.status(status).json({ message: 'tried' });
});

app.post('/api/users/login', async (req, res) => {
    console.log("loggedin");
    const token = autheticatePlayer(req.body.email, req.body.password);
    res.cookie("token", token, { maxAge: 300 * 1000 })
    res.end();
});

app.get('/api/users/:player_id/profile', verifyToken, (req, res) => {
    getPlayerByID(req.params.player_id)
    res.status(200).json({message:"hi"})
});

app.post('/api/users/:player_id/update', verifyToken, (req, res) => {
    /*  create this
    const status = await editPlayer(req.body.name, req.body.email, req.body.password, "1", req.body.location, "./pic", []);
    return res.status(status).json({ message: 'tried' });
    */ 
});

app.post('/api/users/:player_id/status/inapp', verifyToken, (req, res) => {
    // set status of user online in app
});

app.post('/api/users/:player_id/status/ingame', verifyToken, (req, res) => {
    // set status of user online in app
});

app.post('/api/games/start', verifyToken, async (req, res) => {
    const gameID = await startGame(player1ID, player2ID);
    return res.status(201).json({ gameID });
});

app.get('/api/games/all', async (req, res) => {
    model.Game.find().then(doc => {
        // return doc;
        return res.status(200).json({ doc });
    });
});

app.get('/api/users/online', async(req, res) => {
    const onlinePlayers = await getOnlinePlayers();
    return res.status(200).json({ onlinePlayers });
})



/*
{
    winner: playerID
}
*/
app.post('/api/games/:game_id/finish', (req, res) => {
    model.Game.findOne({_id: req.params.game_id}).then(game => {
        var elo = new EloRank(15);  // change to ENV variable? or CONFIG file variable? something idk.
        
        var rankingPlayer1 = getPlayerByID(game.player1).rank;
        var rankingPlayer2 = getPlayerByID(game.player2).rank;

        var expectedScore1 = elo.getExpected(rankingPlayer1, rankingPlayer2);
        var expectedScore2 = elo.getExpected(rankingPlayer2, rankingPlayer1);
        
        if(req.body.winner == game.player1) {
            rankingPlayer1 = elo.updateRating(expectedScore, 1, game.player1);
            rankingPlayer2 = elo.updateRating(expectedScore, 0, game.player2);
        }
        else if(req.body.winner == game.player2) {
            elo.updateRating(expectedScore, 0, game.player1);
            elo.updateRating(expectedScore, 1, game.player2);
        }

        model.Player.update({ _id: game.player1}, {
            $set: {
                rank: rankingPlayer1
            }
        });
        model.Player.update({ _id: game.player2}, {
            $set: {
                rank: rankingPlayer2
            }
        });

    });
})








async function createPlayer(name, email, password, rank, location, photo, gameHistory) {
    if (await model.Player.findOne({ email })) {
        console.log('player already exists.');
        return 409;
    }
    password = bcrypt.hashSync(password, 16);

    const newPlayer = new model.Player({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email,
        passwordHash: password,
        rank: rank,
        online: false,
        location: location,
        photo: photo,
        gameHistory: gameHistory,
    });
    
    newPlayer.save(function (err) {
        if (err) {
            console.log('err', err);
            return 409;
        } 
        console.log('saved player');
        return 201;
    });
}

async function autheticatePlayer(email, password) {
    const player = await model.Player.findOne({ email });
    if (player && bcrypt.compareSync(password, player.passwordHash)) {
        console.log('user login success');
        // read up on jwt tokens
        
        const token = jwt.sign({ sub: player.id }, jwtKey, { expiresIn: '7d' });
        return token;        
    }
}

function getOnlinePlayers() {
    model.Player.find({online: true}).then(doc => {
        //console.log(doc);
        return doc;
    });
}

// TODO:
// [+] Return only the needed elements from the player object... so MAKE SURE YOU DON'T RETURN THE HASHED PASSWORD
function getPlayerByID(player_id) {
    model.Player.findOne({_id: player_id}).then(doc => {
        console.log(doc);
        return doc;
    });
}

async function startGame(player1ID, player2ID) {
    const gameID = new mongoose.Types.ObjectId();
    const newGame = new model.Game({
        _id: gameID,
        gametype: 'standard',
        shots: 3, 
        player1: player1ID, 
        player2: player2ID,
        player1_location: 'location 1', 
        player2_location: 'location 2',   
        player1_score: 0, 
        player2_score: 0,  
        date: '',
        waiting: true,
        inProgress: true,
    });

    // update player 1's games
    var player1Games = (await model.Player.findById(player1ID).select('gameHistory -_id')).gameHistory;
    model.Player.findByIdAndUpdate(player1ID, {
        gameHistory: [...player1Games, gameID],
    },  function (err) {
        if (err) console.log('err', err);
        console.log('edited player');
    });
    // update player 2's games
    var player2Games = (await model.Player.findById(player2ID).select('gameHistory -_id')).gameHistory;
    model.Player.findByIdAndUpdate(player2ID, {
        gameHistory: [...player2Games, gameID],
    },  function (err) {
        if (err) console.log('err', err);
        console.log('edited player');
    });

    newGame.save(function (err) {
        if (err) console.log('err', err);
        console.log('saved game');
        return gameID;
    });
}

// createPlayer("kaushik", "kaushikpa@gmail.com", "spiderman123", "1", "MN", "./pic", []);
// autheticatePlayer("kaushikpa@gmail.com", "spiderman123");

// TOKEN FORMAT:
// Authorization: Bearer <access_token> 
// Authorization: Bearer <access_token> 

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];  // get auth header value

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');     // split token format
        const bearerToken = bearer[1];              // get token
        req.token = bearerToken;                    // split token
        next();
    } else {
        res.sendStatus(403);    // Forbidden
    }
}
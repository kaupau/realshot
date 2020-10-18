const mongoose = require("mongoose");

const uri = 'mongodb+srv://kaushik:8doFhdspTnzRHRti@cluster0.49dvx.gcp.mongodb.net/RS?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true});
const db = mongoose.connection;

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: [true, "Name field is required"]
    },
    email: {
		type: String,
		required: [true, "Email field is required"]
    },
    passwordHash: {
		type: String,
		required: [true, "Password field is required"]
    },
	rank: {
		type: Number,
    },
	online: {
		type: Boolean,
		default: false
    },
    inGame: {
		type: Boolean,
		default: false
    },
    location: {
        type: String,
    },
    photo: {
        type: String,
    },
    gameHistory: {
        type: Array,
    }
})

// learn to use functions.

exports.Player = mongoose.model("Player", playerSchema);

const gameSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    gametype: {
        type: String,
        // type: int ----- save storage?       
    },
    shots: {
        type: Number,
    }, 
    player1: {
        type: String, // ??
    }, 
    player2: {
        type: String, // ??
    },
    player1_location: {
        type: String, // coordinates
    }, 
    player2_location: {
        type: String, // coordinates
    },   
    player1_score: {
        type: Number,
    }, 
    player2_score: {
        type: Number,
    },  
    date: {
        type: Date,
    },  // save as UNIX timestamp so you can easily convert to different time zones 
    inProgress: {
        type: Boolean,
    }
    // add field - game ready - array of players that are ready, cause it's gonna take time
    // can't matchmake twice :
        //  can only matchmake inProgress
})

exports.Game = mongoose.model("Game", gameSchema);
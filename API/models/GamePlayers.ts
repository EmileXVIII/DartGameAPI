import CreateMongooseShema from "../utils/CreateMongooseShema";
import MongoDb from "../routers/routes/MongoDb";
import BddReqs from "../utils/BddReqs";
const mongoose = require('mongoose');
const BDDGamePlayersColsQuery = ["id",  "playerId",  "gameId",  "remainingShots",  "score",  "rank","order","createdAt"];
const BDDGamePlayersColsAnswers = ["rowid",  "playerId",  "gameId",  "remainingShots",  "score",  "rank","order","createdAt"];
const urlBdd = require('../main.ts').urlBdd
let BDDGamePlayers;
switch(process.env.BDD){
    case "perso":
        BDDGamePlayers= new MongoDb(BDDGamePlayersColsQuery,BDDGamePlayersColsAnswers,urlBdd,"dbGames","gamePlayer")
        break;
    case "mongoose":
    default:
        let connection=mongoose.createConnection(urlBdd+"dbGames", {useNewUrlParser: true, poolSize: 5 });
        BDDGamePlayers = connection.model('gamePlayer', CreateMongooseShema.fromArray(BDDGamePlayersColsQuery));
        break;
}
export default new BddReqs(BDDGamePlayers);
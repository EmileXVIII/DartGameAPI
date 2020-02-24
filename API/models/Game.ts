import CreateMongooseShema from "../utils/CreateMongooseShema";
import MongoDb from "../routers/routes/MongoDb";
import BddReqs from "../utils/BddReqs";
const mongoose = require('mongoose');
const BDDGamesColsQuery = ["id",  "mode",  "name",  "currentPlayerId",  "status", "winBy", "createdAt"];
const BDDGamesColsAnswers = ["rowid", "mode",  "name",  "currentPlayerId",  "status", "winBy", "createdAt"]
const urlBdd = require('../main.ts').urlBdd
let BDDGames;
switch(process.env.BDD){
    case "perso":
        BDDGames= new MongoDb(BDDGamesColsQuery,BDDGamesColsAnswers,urlBdd,"dbGames","games");
        break;
    case "mongoose":
    default:
        let connection=mongoose.createConnection(urlBdd+"dbGames", {useNewUrlParser: true});
        BDDGames = connection.model('games', CreateMongooseShema.fromArray(BDDGamesColsQuery));
        break;
}
export default new BddReqs(BDDGames);
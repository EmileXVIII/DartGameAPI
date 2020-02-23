import CreateMongooseShema from "../utils/CreateMongooseShema";
import MongoDb from "../routers/routes/MongoDb";
import BddReqs from "../utils/BddReqs";
const mongoose = require('mongoose');
const BDDGameShotsColsQuery = ["id",  "playerId",  "gameId","multiplicator","sector","createdAt"];
const BDDGameShotsColsAnswers = ["rowid",  "playerId",  "gameId","multiplicator","sector","createdAt"]
const urlBdd = require('../main.ts').urlBdd
let BDDGameShots;
switch(process.env.BDD){
    case "perso":
        BDDGameShots= new MongoDb(BDDGameShotsColsQuery,BDDGameShotsColsAnswers,urlBdd,"dbGames","shots");
        break;
    case "mongoose":
    default:
        let connection=mongoose.createConnection(urlBdd+"dbGames", {useNewUrlParser: true});
        BDDGameShots = connection.model('shots', CreateMongooseShema.fromArray(BDDGameShotsColsQuery));
        break;
}
export default new BddReqs(BDDGameShots)
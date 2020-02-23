import CreateMongooseShema from "../utils/CreateMongooseShema";
import MongoDb from "../routers/routes/MongoDb";
import BddReqs from "../utils/BddReqs";
const mongoose = require('mongoose');
const BDDPlayersColsQuery = ["id","name","email"];
const BDDPlayersColsAnswers = ["rowid","name","email"];
const urlBdd = require('../main.ts').urlBdd
let BDDPlayers;
switch(process.env.BDD){
    case "perso":
        BDDPlayers= new MongoDb(BDDPlayersColsQuery,BDDPlayersColsAnswers,urlBdd,"dbPlayer","players");
        break;
    case "mongoose":
    default:
        let connection=mongoose.createConnection(urlBdd+"dbGames", {useNewUrlParser: true});
        BDDPlayers = connection.model('players', CreateMongooseShema.fromArray(BDDPlayersColsQuery));
        break;
}
export default new BddReqs(BDDPlayers)
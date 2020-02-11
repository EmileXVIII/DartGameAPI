import RoadsGames from "./RouteTable"
import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
const router = require('express').Router();
const bddGames:MongoDb = require("../router.ts").bddGames
const playerRouter = require('./players.ts');
function assertGame(game){
    if(
        ''+game.mode in {'around-the-world':'' , '301':'' , 'cricket':''} &&
        game.status in {'draft':'' , 'started':'' , 'ended':''}
    ) return true
    return false
};
let roadGame = new RoadsGames(router,bddGames,"game",assertGame)
roadGame.router.use("/players",playerRouter)
module.exports=roadGame.router;

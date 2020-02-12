import RoadsGames from "./RouteTable"
import assertGame from "../../asserts/AssertGame";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
const router = require('express').Router();
const bddGames:MongoDb = require("../router.ts").bddGames
const playerRouter = require('./players.ts');
const gamePlayerRouter = require('./gamePlayer.ts');
router.post("/:id", function(req,res,next){
    req.method="PATCH"
    next();
})
router.patch("/:id",function(req,res,next){
    let game = bddGames.get(req.params.id)
    if(game===null){
        res.statusCode=404;
        res.send()
    }
    else {
        switch(game.status){
            case "draft":
                next();
                break;
            default:
                req.body={"status":req.body.status}
                if(req.body.status in assertGame.getPossibleGameStatus()){
                    next()
                }
                else{
                    res.statusCode=410;
                    res.send();
                }
        }
    }
})
router.use("/:id/players", function(req,res,next){
    res.redirect("/gamePlayers/game/"+req.params.id+"?include=players");
    //next();
})
router.use("/gamePlayers",gamePlayerRouter)
router.use("/players",playerRouter)
let roadGame = new RoadsGames(router,bddGames,"game",assertGame.assertGame)
module.exports=roadGame.router;

import RoadsGames from "./RouteTable"
import assertGame from "../../asserts/AssertGame";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
const router = require('express').Router();
const bddGames:MongoDb = require("../router.ts").bddGames
const playerRouter = require('./players.ts');
const axios = require("axios");
const axiosLocal = axios.create({baseURL: 'http://localhost:8080'})
const gamePlayerRouter = require('./gamePlayer.ts');
router.post("/:id/shots",async function(req,res,next){
    let result=await axiosLocal.get("/games/"+req.params.id);
    if(result.data.status!="started"){
        res.statusCode=422;
        res.send();
    }
    else{
        if(!assertNumber(req.body.playerId)){
            req.body.playerId=result.data.currentPlayerId;
        }
        req.body.gameId=req.params.id;
        result=await axiosLocal.post("/shots",req.body)
        res.statusCode=result.status;
        res.json(result.data)
    }
})
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
router.use("/:id/players", async function(req,res,next){
    let result = await axiosLocal.post("/gamePlayers/game/"+req.params.id+"?include=players&&_method="+req.method,req.body)
    res.statusCode=result.status;
    res.json(result.data);
})
router.use("/gamePlayers",gamePlayerRouter)
router.use("/players",playerRouter)
let roadGame = new RoadsGames(router,bddGames,"game",assertGame)
module.exports=roadGame.router;

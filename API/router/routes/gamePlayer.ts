//import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";
import RoadsPlayers from "./RouteTable"
import assertNumber from "../../asserts/assertNumber";
import assertGamePlayer from "../../asserts/AssertGamePlayer";
import { globalAgent } from "http";
const router =  require('express').Router();
const host= require("../../main.ts").host;
const axios = require("axios");
const axiosLocal = axios.create({baseURL: 'http://localhost:8080'})
const bddGamePlayer:MongoDb = require("../router.ts").bddGamePlayer
const bddPlayers:MongoDb = require("../router.ts").bddPlayers
router.get("/game/:id",async function(req,res,next){     
    let limit:number=assertNumber(req.query.limit)?req.query.limit:50;
    let offset:number=assertNumber(req.query.offset)?req.query.offset:1;
    let collectionRows = await bddGamePlayer.getBy({"gameId":""+req.params.id},limit,offset)
    let playerRows=[];
    if(req.query.include==="players"){
        let player
        for(let i=0;i<collectionRows.length;i++){
            player=await(bddPlayers.get(collectionRows[i]["playerId"]))
            if(player) playerRows.push(player);
        }
        res.format({
            html: () => {
                res.statusCode=200;
                res.render('renderCollection/index.pug', {
                    items:playerRows,
                    collectionName:"players",
                    title:"get"+"/games/"+req.params.id+"/players offset "+offset+" limit "+limit,
                    cols:bddGamePlayer.getCols()
                })
            },
            json: () => {
                res.statusCode=200;
                res.json(playerRows);
                res.send()
            }
        })
        }
    else
        res.format({
        html: () => {
            res.statusCode=200;
            res.render('renderCollection/index.pug', {
                items:collectionRows,
                collectionName:"gamePlayer",
                title:"get"+"gamePlayer/game/"+req.params.id+" offset "+offset+" limit "+limit,
                cols:bddGamePlayer.getCols()
            })
        },
        json: () => {
            res.statusCode=200;
            res.json(collectionRows);
            res.send()
        }
    })
})
router.post("/game/:id",async function(req,res,next){
    for (let listInd in req.body){
        let idPlayer=req.body[listInd];
        if (!(assertNumber(idPlayer))){
            let player=await axiosLocal.post('/players', req.body[listInd]);
            idPlayer=player.data.id;
        }
        if(assertNumber(idPlayer)){
            if(await bddPlayers.get(idPlayer)!==null){
                let toInsert={"playerId":idPlayer,"gameId":req.params.id,"remainingShots":0,"score":0}
                bddGamePlayer.insert(toInsert)
            }
        }
        else  axiosLocal.post('/players', req.body[listInd])
    }
    res.statusCode=202
    res.send()
})
let playerGame = new RoadsPlayers(router,bddGamePlayer,"gamePlayer",assertGamePlayer)


module.exports=playerGame.router;

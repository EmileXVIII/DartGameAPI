//import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";
import RoadsPlayers from "./RouteTable"
import assertNumber from "../../asserts/assertNumber";
const router =  require('express').Router();
const host= require("../../main.ts").host;
const bddGamePlayer:MongoDb = require("../router.ts").bddGamePlayer
router.get("/game/:id",function(req,res,next){     
    let limit:number=assertNumber(req.query.limit)?req.query.limit:50;
    let offset:number=assertNumber(req.query.offset)?req.query.offset:1;
    let collectionRows = bddGamePlayer.getBy({"gameId":req.params.id},limit,offset)
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
let playerGame = new RoadsPlayers(router,bddGamePlayer,"gamePlayer",(any)=>true)


module.exports=playerGame.router;

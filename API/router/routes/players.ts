import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
import RoadsPlayers from "./RouteTable"
undefined
var $ = require('jquery').ajax;
const router =  require('express').Router();
const host= require("../../main.ts").host;
const bddPlayers:MongoDb = require("../router.ts").bddPlayers

let playerGame = new RoadsPlayers(router,bddPlayers,"player",assertPlayer)


module.exports=playerGame.router;


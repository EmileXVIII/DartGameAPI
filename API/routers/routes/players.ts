import assertPlayer from "../../asserts/AssertPlayer";
import RoadsPlayers from "./RouteTable"
import BddReqs from "../../utils/BddReqs";
const router =  require('express').Router();
const host= require("../../main.ts").host;
const bddPlayers:BddReqs = require("../router.ts").bddPlayers

let playerRouter = new RoadsPlayers(router,bddPlayers,"player",assertPlayer)


module.exports=playerRouter.router;


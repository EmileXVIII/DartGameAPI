import MongoDb from "./MongoDb";
import RoadsShots from "./RouteTable"
import assertShot from "../../asserts/AssertShot";
const router =  require('express').Router();
const host= require("../../main.ts").host;
const bddShots:MongoDb = require("../router.ts").bddShots

let shotRouter = new RoadsShots(router,bddShots,"player",assertShot)


module.exports=shotRouter.router;
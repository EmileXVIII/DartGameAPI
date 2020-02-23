import RoadsShots from "./RouteTable"
import assertShot from "../../asserts/AssertShot";
import BddReqs from "../../utils/BddReqs";
const router =  require('express').Router();
const host= require("../../main.ts").host;
const bddShots:BddReqs = require("../router.ts").bddShots

let shotRouter = new RoadsShots(router,bddShots,"player",assertShot)


module.exports=shotRouter.router;
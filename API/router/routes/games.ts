import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
const router = require('express').Router();
const bddPlayer:MongoDb = require("../router.ts").bddPlayer
const playerRouter = require('./players.ts');
router.use("/players",playerRouter)

module.exports=router;

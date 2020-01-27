import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
const router = require("../main.ts").router
const bddPlayer:MongoDb = require("../main.ts").bddPlayer
const playerRouter = require('./BDDplayers.ts');
router.use("/players",playerRouter)


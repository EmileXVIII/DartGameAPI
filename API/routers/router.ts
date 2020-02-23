import BDDPlayers from "../models/Player";
import BDDGames from "../models/Game";
import BDDGamePlayers from "../models/GamePlayers";
import BDDGameShots from "../models/GameShots";
const host = require('../main.ts').host
const router = require('express').Router(); 
const bddPlayers = BDDPlayers;
const bddGames = BDDGames;
const bddGamePlayer = BDDGamePlayers;
const bddShots = BDDGameShots;
module.exports = {"router":router,"bddPlayers":bddPlayers,"bddGames":bddGames,"bddGamePlayer":bddGamePlayer,"bddShots":bddShots};
const gameRouter = require('./routes/games.ts');
const playerRouter = require('./routes/players.ts');
const gamePlayer = require('./routes/gamePlayer.ts');
const shotRouter = require('./routes/gameShot.ts');
router.use(function(req,res,next){
    if (req.query._method){
        if (req.query._method.toLowerCase() in {"post":"","get":"","delete":"","patch":"","put":""})
            req.method=req.query._method.toUpperCase()
    }
    next();
    })
router.get("/",function(req,res,next){
    res.format({
        html: () => {
           res.status=308;
           res.render('redirection.pug', {
                URL: host+"/games",
                title:"redirection"
            })
        },
        json: () => {
            res.status=308;
            res.send()
        }
    })
});
router.use("/games",gameRouter);
router.use("/players",playerRouter);
router.use("/gamePlayers",gamePlayer);
router.use("/shots",shotRouter);

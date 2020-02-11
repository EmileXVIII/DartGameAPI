import MongoDb from "./routes/MongoDb";
const urlBdd = require('../main.ts').urlBdd
const host = require('../main.ts').host
const router = require('express').Router(); 
const bddPlayers = new MongoDb(["id","name","email"],["rowid","name","email"],urlBdd,"dbPlayer","players")
const bddGames = new MongoDb(["id",  "mode",  "name",  "currentPlayerId",  "status",  "createdAt"],["rowid", "mode",  "name",  "currentPlayerId",  "status",  "createdAt"],urlBdd,"dbGames","games")
module.exports = {"router":router,"bddPlayers":bddPlayers,"bddGames":bddGames};
const gameRouter = require('./routes/games.ts');
const playerRouter = require('./routes/players.ts');
router.get("/",function(req,res,next){
    res.format({
        html: () => {
           res.status=308;
           res.render('redirection.pug', {
                URL: host+"/game",
                title:"redirection"
            })
        },
        json: () => {
            res.status=308;
            res.send()
        }
    }).catch(next)
});
router.use("/games",gameRouter);
router.use("/players",playerRouter);

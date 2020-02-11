import MongoDb from "./routes/MongoDb";
const urlBdd = require('../main.ts').urlBdd
const host = require('../main.ts').host
const router = require('express').Router();
const bddPlayer = new MongoDb(["id","name","email"],["rowid","name","email"],urlBdd,"dbPlayer","players")
module.exports = {"router":router,"bddPlayers":bddPlayer};
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
router.use("/game",gameRouter);
router.use("/players",playerRouter);

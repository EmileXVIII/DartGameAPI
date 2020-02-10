import MongoDb from "./routes/MongoDb";
const urlBdd ="mongodb://root:pwd@localhost:3306/"
const router = require('express').Router();
const gameRouter = require('./routes/games.ts');
const playerRouter = require('./routes/players.ts');
const bddPlayer = new MongoDb(["id","name","email"],["rowid","name","email"],urlBdd,"dbPlayer","players")
bddPlayer.init();
router.get("/",function(req,res,next){
    res.format({
        html: () => {
           res.status=308;
           res.render('views/redirection.pug', {
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
module.exports = {"router":router,"bddPlayers":bddPlayer};
router.use("/game",gameRouter);
router.use("/players",playerRouter);

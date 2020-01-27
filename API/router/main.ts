import MongoDb from "./routes/MongoDb";
const router = require('express').Router();
const gameRouter = require('./routes/game.ts');
const playerRouter = require('./routes/players.ts');
function main(host:string,urlBDD:string){
    const bddPlayer = new MongoDb(["id","name","email"],["rowid","name","email"],urlBDD,"dbPlayer","players")

    router.get("/",function(req,res,next){
        res.format({
            html: () => {
                res.status=308;
                res.render('views/redirection.pug', {
                    URL:host+"/game",
                    title:"redirection"
                })
            },
            json: () => {
                res.status=308;
                res.send()
            }
        }).catch(next)
    });
    router.use('/games', gameRouter);
    module.exports = {"router":router,"bddPlayers":bddPlayer};
}

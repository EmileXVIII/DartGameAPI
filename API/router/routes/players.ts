import assertPlayer from "../../asserts/assertPlayer";
import MongoDb from "./MongoDb";import assertNumber from "../../asserts/assertNumber";
undefined
const router = require("../main.ts").router
const bddPlayer:MongoDb = require("../main.ts").bddPlayer

router.get('/players',function(req,res,next){

    let limit:number=assertNumber(req.limit)?req.limit:50;
    let offset:number=assertNumber(req.offset)?req.offset:1;
    let players=bddPlayer.getAll(limit,offset)
      res.format({
        html: () => {
            res.status=201;
            res.render('views/players/index.pug', {
                players:players,
                title:"getPlayers offset "+offset+" limit "+limit
            })
        },
        json: () => {
            res.status=201;

            res.send()
        }
    }).catch(next)
})
router.post('/players',function(req,res,next){
    if(assertPlayer(req.body)){
        bddPlayer.insert({"name":req.body.name,"email":req.body.email});
        res.status=201;
        res.send();
    }
    else{
        res.status=422;
        res.send();
    }
});
router.get('/players/:id',function(req,res,next){
    if (assertNumber(req.params.id)){
        let player =  bddPlayer.get(req.params.id);
        res.format({
        html: () => {
            res.status=201;
            res.render('views/players/index.pug', {
                players:[player],
                title:"getPlayer id "+req.params.id
            })
        },
        json: () => {
            res.status=406;

            res.send()
        }
    }).catch(next)
    }
})
router.get('/players/new',function(req,res,next){
    let player={}
    player["name"]="";
    player["email"]="";
    res.format({
    html: () => {
        res.status=201;
        res.render('views/players/edit.pug', {
            action:"/game/players",
            title:"Form New Player",
            player:player
        })
    },
    json: () => {
        res.status=406;
        res.send()
    }
    }).catch(next)
})
router.get('/players/:id/edit',function(req,res,next){
    if (assertNumber(req.params.id)){
        let player=bddPlayer.get(req.id);
        res.format({
        html: () => {
            res.status=201;
            res.render('views/players/edit.pug', {
                action:"/game/players",
                title:"Form New Player",
                player:player
            })
        },
        json: () => {
            res.status=406;
            res.send()
        }
    }).catch(next)
    }
    else{
        res.status=422;
        res.send();
    }
})
router.patch("/players/:id",function(req,res,next){
    if (assertNumber(req.params.id)){
        bddPlayer.update(req.params.id,req.body);
        res.status=201;
        res.send();
    }
    else{
        res.status=422;
        res.send();
    }
})
router.delete("/players/:id",function(req,res,next){
    if (assertNumber(req.params.id)){
        bddPlayer.remove(req.params.id);
        res.status=201;
        res.send();
    }
    else{
        res.status=422;
        res.send();
    }
})




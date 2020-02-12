import assertNumber from "../../asserts/assertNumber";
import MongoDb from "./MongoDb";
class RouteTable{
    bdd:MongoDb
    collectionName:string
    router:any
    assertItem:any
    patchItem
    constructor(router,bdd:MongoDb,collectionName:string,assertItem){
        this.bdd=bdd;
        this.collectionName=collectionName;
        this.assertItem=assertItem;
        this.patchItem = function (req,res,next){
            if (assertNumber(req.params.id)){
                bdd.update(req.params.id,req.body);
                res.status=201;
                res.send();
            }
            else{
                res.statusCode=406;
                res.send();
            }
        }
        router.post('/',function(req,res,next){
            if(assertItem(req.body)){
                let cols=bdd.getCols()
                let toInsert={}
                for (let col of cols){
                    toInsert[col]=req.body[col]
                }
                bdd.insert(toInsert);
                res.statusCode=201;
                res.send();
            }
            else{
                res.statusCode=406;
                res.send();
            }
        });

        router.get('/',async function(req,res,next){
        
            let limit:number=assertNumber(req.limit)?req.limit:50;
            let offset:number=assertNumber(req.offset)?req.offset:1;
            let collectionRows=await bdd.getAll(limit,offset)
              res.format({
                html: () => {
                    res.statusCode=200;
                    res.render('renderCollection/index.pug', {
                        items:collectionRows,
                        collectionName:collectionName,
                        title:"get"+collectionName+"s offset "+offset+" limit "+limit,
                        cols:bdd.getCols()
                    })
                },
                json: () => {
                    res.statusCode=200;
                    res.json(collectionRows);
                    res.send()
                }
            })
        })
        router.get('/:id',async function(req,res,next){
            if(req.query._method==="delete") {
                req.method="DELETE";
                next();
            }
            else if (assertNumber(req.params.id)){
                let collectionRow = await bdd.get(req.params.id);
                if (collectionRow===null){
                    next()
                }
                else res.format({
                    html: () => {
                        res.statusCode=200;
                        res.render('renderCollection/index.pug', {
                            collectionName:collectionName,
                            items:[collectionRow],
                            title:"get"+collectionName+"s id "+req.params.id,
                            cols:bdd.getCols()
                        })
                    },
                    json: () => {
                        res.statusCode=200;
                        res.json(collectionRow);
                        res.send()
                    }
                })
            }
            else next();
        });
        router.get('/new',function(req,res,next){
            let thing={};
            thing["name"]="";
            thing["email"]="";
            res.format({
                html: () => {
                    res.statusCode=201;
                    res.render('renderCollection/edit.pug', {
                        action:"/"+collectionName+"s",
                        title:"Form New Player",
                        item:thing,
                        method:"post",
                        cols:bdd.getCols().slice(1)
                    })
                },
                json: () => {
                    res.statusCode=406;
                    res.send()
                }
            })
        }.bind(this));
        router.get('/:id/edit',async function(req,res,next){
            if (assertNumber(req.params.id)){
                let thing=await bdd.get(req.params.id);
                res.format({
                html: () => {
                    res.status=201;
                    res.render('renderCollection/edit.pug', {
                        action:"/"+collectionName+"s/"+req.params.id,
                        title:"Form New Player",
                        item:thing,
                        method:"post",
                        cols:bdd.getCols().slice(1)
                    })
                },
                json: () => {
                    res.statusCode=406;
                    res.send()
                }
            })
            }
            else{
                res.status=422;
                res.send();
            }
        }.bind(this))
        router.post("/:id",this.patchItem);
        router.patch("/:id",this.patchItem);
        router.delete("/:id",function(req,res,next){
            if (assertNumber(req.params.id)){
                this.bdd.remove(req.params.id);
                res.statusCode=202;
                res.send();
            }
            else{
                res.statusCode=422;
                res.send();
            }
        }.bind(this))
        router.use(function(req, res){
            res.statusCode = 404;
            res.format.bind(this);
            res.format({
                html: () => {
                    res.send("<h2>Cannot "+req.method+" "+req.originalUrl+"</h2>")
                },
                json: () => {
                    res.send()
                }
            })
        }.bind(this));
        this.router=router;
        this.patchItem.bind(this);
    }
}
export default RouteTable;
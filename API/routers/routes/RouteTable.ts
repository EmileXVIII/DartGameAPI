import assertNumber from "../../asserts/assertNumber";
import MongoDb from "./MongoDb";
import IAssertItem from "../../asserts/IAssertItem";
import BddReqs from "../../utils/BddReqs";
class RouteTable{
    bdd:BddReqs;
    collectionName:string
    router:any
    assertItem:any
    patchItem
    constructor(router,bdd:BddReqs,collectionName:string,assertItem:IAssertItem){
        this.bdd=bdd;
        this.collectionName=collectionName;
        this.assertItem=assertItem;
        this.patchItem = async function (req,res,next){
            if (assertNumber(req.params.id)&&assertItem.assertPartialItem(req.body)){
                let result=await bdd.updateOne(req.params.id,req.body);
                res.status=201;
                res.send();
            }
            else{
                res.statusCode=406;
                res.send();
            }
        }
        router.post('/',async function(req,res,next){
            if(assertItem.assertItem(req.body)){
                let cols=bdd.getCols()
                let toInsert={}
                for (let col of cols){
                    toInsert[col]=req.body[col]
                }
                let body = await bdd.insertOne(toInsert);
                res.statusCode=201;
                res.json(body);
            }
            else{
                res.statusCode=406;
                res.send();
            }
        });

        router.get('/',async function(req,res,next){
        
            let limit:number=assertNumber(req.query.limit)?req.query.limit:50;
            let offset:number=assertNumber(req.query.page)?req.query.page:1;
            let sortName:string=req.query.sort?req.query.sort:"id";
            let collectionRows;
            if(req.query["hasBody"]==1)
                collectionRows=await bdd.getBy(req.body,+limit,+offset,sortName)
            else
                collectionRows=await bdd.getAll(+limit,+offset,sortName)
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
                let collectionRow = await bdd.getOne(req.params.id);
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
                let thing=await bdd.getOne(req.params.id);
                res.format({
                html: () => {
                    res.status=201;
                    res.render('renderCollection/edit.pug', {
                        action:"/"+collectionName+"s/"+req.params.id+"?_method=patch",
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
                bdd.removeOne(req.params.id);
                res.statusCode=202;
                res.send();
            }
            else{
                res.statusCode=422;
                res.send();
            }
        })
        router.use(function(req, res){
            res.statusCode = 404;
            res.format({
                html: () => {
                    res.send("<h2>Cannot "+req.method+" "+req.originalUrl+"</h2>")
                },
                json: () => {
                    res.send()
                }
            })
        });
        this.router=router;
        this.patchItem.bind(this);
    }
}
export default RouteTable;
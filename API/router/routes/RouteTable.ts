import assertNumber from "../../asserts/assertNumber";
import MongoDb from "./MongoDb";
class RouteTable{
    bdd:MongoDb
    item:string
    router:any
    assertItem:any
    patchItem
    constructor(router,bdd:MongoDb,item:string,assertItem){
        this.bdd=bdd;
        this.item=item;
        this.assertItem=assertItem;
        this.patchItem = function (req,res,next){
            if (assertNumber(req.params.id)){
                this.bdd.update(req.params.id,req.body);
                res.status=201;
                res.send();
            }
            else{
                res.status=422;
                res.send();
            }
        }
        router.get.bind(this);
        router.post.bind(this);
        router.patch.bind(this);
        router.use.bind(this);

        router.get('/',async function(req,res,next){
        
            let limit:number=assertNumber(req.limit)?req.limit:50;
            let offset:number=assertNumber(req.offset)?req.offset:1;
            let things=await bdd.getAll(limit,offset)
            res.format.bind(this)
              res.format({
                html: () => {
                    res.status=201;
                    res.render.bind(this)
                    res.render('things/index.pug', {
                        items:things,
                        title:"get"+this.item+"s offset "+offset+" limit "+limit,
                        cols:this.bdd.getCols()
                    })
                },
                json: () => {
                    res.status=201;
        
                    res.send()
                }
            })
        }.bind(this))
        
        router.post('/',function(req,res,next){
            if(assertItem(req.body)){
                this.bdd.insert({"name":req.body.name,"email":req.body.email});
                res.status=201;
                res.send();
            }
            else{
                res.status=422;
                res.send();
            }
        }.bind(this));
        router.get('/:id',async function(req,res,next){
            if (assertNumber(req.params.id)){
                let thing = await bdd.get(req.params.id);
                console.log(thing)
                res.format.bind(this);
                res.format({
                html: () => {
                    res.status=201;
                    res.render('things/index.pug', {
                        players:[thing],
                        title:"get"+this.item+" id "+req.params.id,
                        cols:bdd.getCols()
                    })
                },
                json: () => {
                    res.status=406;
        
                    res.send()
                }
            })
            }
            else next();
        }.bind(this));
        router.get('/new',function(req,res,next){
            let thing={};
            thing["name"]="";
            thing["email"]="";
            res.format.bind(this);
            res.format({
                html: () => {
                    res.status=201;
                    res.render(this.item+'s/edit.pug', {
                        action:"/"+this.item,
                        title:"Form New Player",
                        item:thing,
                        method:"post",
                        cols:bdd.getCols()
                    })
                },
                json: () => {
                    res.status=406;
                    res.send()
                }
            })
        }.bind(this));
        
        router.get('/:id/edit',async function(req,res,next){
            if (assertNumber(req.params.id)){
                let thing=await bdd.get(req.params.id);
                res.format.bind(this);
                res.format({
                html: () => {
                    res.status=201;
                    res.render('players/edit.pug', {
                        action:"/"+this.item+"/"+req.params.id,
                        title:"Form New Player",
                        item:thing,
                        method:"post",
                        cols:this.bdd.getCols()
                    })
                },
                json: () => {
                    res.status=406;
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
                res.status=201;
                res.send();
            }
            else{
                res.status=422;
                res.send();
            }
        }.bind(this))
        router.use(function(req, res){
            res.status = 404;
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
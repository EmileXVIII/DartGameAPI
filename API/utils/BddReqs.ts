class BddReqs{
    bdd;
    updateOne;
    getCols;
    insertOne;
    getBy;
    getAll;
    getOne;
    removeOne;
    schema ;
    constructor(bdd){
        this.bdd=bdd;
        switch(process.env.BDD){
            case "perso":
                this.updateOne=(id,params)=>bdd.update(id,params);
                this.getCols=()=>bdd.getCols();
                this.insertOne=(body)=>bdd.insert(body);
                this.getBy=(body,limit,offset,sortName)=>bdd.getBy(body,limit,offset,sortName);
                this.getAll=(limit,offset,sortName)=>bdd.getAll(limit,offset,sortName);
                this.getOne=(id)=>bdd.get(id);
                this.removeOne=(id)=>bdd.remove(id);
                break;
            case "mongoose":
            default:
                this.schema=bdd.schema;
                this.updateOne=(id,params)=>{
                    return bdd.updateOne({"id":+id},{$set:params});
                }
                this.getCols=()=>this.schema.cols;
                this.insertOne=async (body)=>{
                    let newId = await bdd.aggregate([{ $group: { _id: "*", max: { $max: "$"+this.getCols()[0] } } }])
                    newId=newId[0]?newId[0]["max"]:0;
                    body[this.getCols()[0]] = Number(newId) + 1
                    return new bdd(body).save()
                };
                this.getBy=(body,limit,offset,sortName)=>bdd.find(body).skip(limit*(offset-1)).limit(limit).sort(sortName);
                this.getAll=(limit,offset,sortName)=>bdd.find().skip(limit*(offset-1)).limit(limit).sort(sortName);
                this.getOne=(id)=>bdd.findOne({"id":id});
                this.removeOne=(id)=>bdd.deleteOne({"id":id});
                break;
        }
    }
}
export default BddReqs;
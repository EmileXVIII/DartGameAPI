import { arrayExpression } from "babel-types";

const MongoCli = require('mongodb').MongoClient;
const assert = require('assert');
const MyEventListener = require("./MyEventListener");
class MongoDb{
  eventListener:any;
  client:any;
  connection:any;
  possibleKeysQuer:string[];
  possibleKeysRes:string[];
  urlBDD:string;
  dbName:string;
  collectionName:string;
  endReq:boolean;
  constructor(possibleKeysQuer,possibleKeysRes,urlBDD,dbName,collectionName){
    this.eventListener=new MyEventListener();
    this.possibleKeysQuer=possibleKeysQuer;
    this.possibleKeysRes=possibleKeysRes;
    this.urlBDD=urlBDD;
    this.dbName=dbName;
    this.collectionName=collectionName;
    this.endReq=false;
    this.connection=new Promise(resolve => {
      (async () => {
        console.log(1)
        while (!this.endReq) {
          await this.awaitXs(2)
        }
        resolve(true)
      })()
    })
    .then(() => {
      console.log('no');
      this.proceed();
    });
    this.init();
  }
  public stop(){
    this.endReq=true;
  }
  private convertResult(fromBDD:Object,sourceCols=this.possibleKeysRes,outPutCols=this.possibleKeysQuer) {
    if(!fromBDD) return fromBDD;
    let result = {};
    let i;
    for (let col in fromBDD) {
      i=col!==null?sourceCols.indexOf(col):-1
      if(i!==-1) result[outPutCols[i]] = fromBDD[sourceCols[i]]
    }
    return result
  }
  public init(){
    this.client = new MongoCli(this.urlBDD, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect((err) => {
      assert.equal(null, err);
      console.log("connected with BDD");
      const db = this.client.db(this.dbName);
      const db_collection = db.collection(this.collectionName);
      (async () => {
        await this.connection
      })()
      //
      const fonctions = {
        get: (itemId) => {
          return this.toPromise(db_collection.findOne({ rowid: +itemId })).then(res=>this.convertResult(res))
        },
        count: () => {
          let res = this.toPromise(db_collection.aggregate([{ $group: { _id: "*", count: { $sum: 1 } } }]).toArray());
          return res.then(
            (result) => result[0]["count"]
          )
        },
        getBy: (object,limit, offset,sortName) => {
          let sortInd=this.possibleKeysQuer[sortName];
          let sortCasted={};
          if(sortName===-1){
            sortCasted[this.possibleKeysRes[0]]=1;
          }
          else sortCasted[this.possibleKeysRes[sortName]]=1;
          return this.toPromise(db_collection.find(this.convertResult(object)).skip((offset-1) * limit).limit(limit).sort(sortCasted).toArray()).then(res=>{
            let array:any[]=<any[]>res;
            for(let i in array) array[i]=this.convertResult(array[i])
            return array;
          })
        },
    
        getAll: (limit, offset,sortName) => fonctions.getBy({},limit,offset,sortName),
    
        insert: (params) => {
          return (async () => {
            let aInsert = {};
            let len:number= this.possibleKeysRes.length;
            let newId = await this.toPromise(db_collection.aggregate([{ $group: { _id: "*", max: { $max: "$"+this.possibleKeysRes[0] } } }]).toArray());
            newId=newId[0]?newId[0]["max"]:0;
            params.itemId = Number(newId) + 1
            for (let i = 0; i < len; i++) {
              aInsert[this.possibleKeysRes[i]] = ""+params[this.possibleKeysQuer[i]]
            };
            aInsert[this.possibleKeysRes[0]]=params.itemId;
            let where={};
            where[this.possibleKeysRes[0]]=params.itemId;
            return this.toPromise(db_collection.deleteOne(where)).then(
              async () => {
                let res = await this.toPromise(db_collection.insertOne(aInsert));
                return this.convertResult(res["ops"][0],this.possibleKeysRes,this.possibleKeysQuer)
              }
            );
          })()
        },
    
        update: (itemId, params) => {
          itemId=+itemId
          let res=this.toPromise(undefined);
          for (let param in params) {
            let cas = this.possibleKeysQuer.slice(1).indexOf(param);
            if(cas===-1) continue;
            let setter={}
            setter[this.possibleKeysRes[cas+1]]=""+params[param]
            let where={};
            where[this.possibleKeysRes[0]]=itemId;
            res=db_collection.updateOne(
              where,
              { $set: setter }
            )
          }
          return res;
        },
    
        remove: (itemId) => {
          let where={};
          where[this.possibleKeysRes[0]]=+itemId;
          return db_collection.deleteOne(where)
        }
    
      };
      this.eventListener.on('get', (itemId) => fonctions.get(itemId));
      this.eventListener.on('count', () => fonctions.count());
      this.eventListener.on('getAll', (limit, offset,sortName) => fonctions.getAll(limit, offset,sortName));
      this.eventListener.on('getBy', (object,limit, offset,sortName) => fonctions.getBy(object,limit, offset,sortName));
      this.eventListener.on('insert', (params) => fonctions.insert(params));
      this.eventListener.on('update', (itemId, params) => fonctions.update(itemId, params));
      this.eventListener.on('remove', (itemId) => fonctions.remove(itemId));
    }
    )
  }
  private toPromise(cursor) {
    return new Promise(async (resolve) => {
      let res;
      try{
        res = await cursor;
      }
      catch(err){console.log(err)};
      resolve(res)
    })
  }
  private awaitXs(X) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, X * 1000);
    });
  };
  private proceed() {
    (async () => {
      //console.log(1)
      while (!this.endReq) {
        await this.awaitXs(2);
        //console.log('yes');
      }
      Promise.resolve(true)
    })()
  }
  public getCols() {return this.possibleKeysQuer};
  public get(itemId) {return this.eventListener.emit('get', itemId)};
  public count() {return this.eventListener.emit('count')};
  public getAll(limit, offset){return this.eventListener.emit('getAll', limit, offset)};
  public getBy(object,limit, offset){return this.eventListener.emit('getBy',object, limit, offset)};
  public insert(params){return this.eventListener.emit('insert', params)};
  public update(itemId, params){return this.eventListener.emit('update', itemId, params)};
  public remove(itemId) {return this.eventListener.emit('remove', itemId)};
}

export default MongoDb;
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
  public init(){
    this.client = new MongoCli(this.urlBDD, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect((err) => {
      assert.equal(null, err);
      console.log("conected with BDD");
      const db = this.client.db(this.dbName);
      const db_collection = db.collection(this.collectionName);
      (async () => {
        await this.connection
      })()
    
    
      function convertEnResSql(list:string[], cols = this.possibleKeysRes) {
    
        const possibleKeys = cols;
        let result = {};
        for (let i = 0; i < 6; i++) {
          result[possibleKeys[i]] = list[i]
        }
        return result
      }
      //
      const fonctions = {
        get: (itemId) => {
          return this.toPromise(db_collection.findOne({ rowid: +itemId }))
        },
        count: () => {
          let res = this.toPromise(db_collection.aggregate([{ $group: { _id: "*", count: { $sum: 1 } } }]).toArray());
          return res.then(
            (result) => result[0]["count"]
          )
        },
    
        getAll: (limit, offset) => {
          console.log('I')
          return this.toPromise(db_collection.find().skip((offset-1) * limit).limit(limit).toArray())
        },
    
        insert: (params) => {
          return (async () => {
            let aInsert = {};
            let len:number= this.possibleKeysRes.length;
            let newId = await this.toPromise(db_collection.aggregate([{ $group: { _id: "*", max: { $max: "$rowid" } } }]).toArray());
            newId=newId[0]["max"]?newId[0]["max"]:0;
            params.itemId = Number(newId) + 1
            for (let i = 0; i < len; i++) {
              aInsert[this.possibleKeysRes[i]] = params[this.possibleKeysQuer[i]]
            };
            aInsert["rowid"]=params.itemId;
            return this.toPromise(db_collection.remove({ "rowid": params.itemId })).then(
              async () => {await this.toPromise(db_collection.insertOne(aInsert));return}
            );
          })()
        },
    
        update: (itemId, params) => {
          itemId=+itemId
          let res=this.toPromise(undefined);
          for (let param in params) {
            let cas = this.possibleKeysQuer.indexOf(param);
            if(cas===-1) continue;
            let setter={}
            setter[param]=params[param]
            res=db_collection.updateOne(
              { "rowid": itemId },
              { $set: setter }
            )
          }
          return res;
        },
    
        remove: (itemId) => {
          return db_collection.remove({ "rowid": +itemId })
        }
    
      };
      this.eventListener.on('get', (itemId) => fonctions.get(itemId));
      this.eventListener.on('count', () => fonctions.count());
      this.eventListener.on('getAll', (limit, offset) => fonctions.getAll(limit, offset));
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
  public get(itemId) {return this.eventListener.emit('get', itemId)};
  public count() {return this.eventListener.emit('count')};
  public getAll(limit, offset){return this.eventListener.emit('getAll', limit, offset)};
  public insert(params){return this.eventListener.emit('insert', params)};
  public update(itemId, params){return this.eventListener.emit('update', itemId, params)};
  public remove(itemId) {return this.eventListener.emit('remove', itemId)};
}

export default MongoDb;
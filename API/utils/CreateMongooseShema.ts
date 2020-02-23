import { Schema } from "inspector";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
class CreateMongooseShema{
    public static fromArray(colsNameArray:string[]){
        let mapCols = {};
        let i:number=0;
        mapCols[colsNameArray[i]]=Number;
        i++
        for (i ;i<colsNameArray.length;i++){
            mapCols[colsNameArray[i]]=String;
        }
        let schema = new Schema(mapCols);
        schema.cols = colsNameArray;
        return schema;
    }
    public static fromMap(colsMap:Map<string,any>){
        let schema = new Schema(colsMap);
        schema.cols=colsMap.keys();
        return schema;
    }
}
export default CreateMongooseShema;
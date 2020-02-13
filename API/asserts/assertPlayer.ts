import IAssertItem from "./IAssertItem";

class AssertPlayer implements IAssertItem{
    assertItem(body){
        if(body.name&&body.email){
            return(this.isEmail(''+body.email)&&body.name.length!==0)
        }
        return false;
    }
    assertPartialItem(body){
        let result=true;
        if(body.name==undefined){}
        else if(body.name){
            result=result||body.name.length!==0
        }
        else return false;
        if(body.name==undefined){}
        else if(body.email){
            result = result&&this.isEmail(''+body.email)
        }
        else return false;
    }
    isEmail(email:string){
        let partEmail=email.split("@");
        if (partEmail.length!=2) return false;
        partEmail=partEmail[1].split(".")
        if (partEmail.length!=2) return false;
        return true
    }
}
export default new AssertPlayer();
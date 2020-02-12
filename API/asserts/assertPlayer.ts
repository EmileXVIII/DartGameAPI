function assertPlayer(body){
    if(body.name&&body.email){
        return(isEmail(body.email)&&body.name.length!==0)
    }
    return false;
}
function isEmail(email:string){
    let partEmail=email.split("@");
    if (partEmail.length!=2) return false;
    partEmail=partEmail[1].split(".")
    if (partEmail.length!=2) return false;
    return true
}
export default assertPlayer;
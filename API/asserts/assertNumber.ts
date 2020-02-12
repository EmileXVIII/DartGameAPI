function assertNumber(num:any){
    return num===+num||num===''+(+num)
}
export default assertNumber;
class AssertGame{
    gameModes;
    gameStatus;
    constructor (gameModes,gameStatus){
        this.gameModes=gameModes
        this.gameStatus=gameStatus
    }
    getPossibleGameStatus(){return this.gameStatus}
    getPossibleGameModes(){return this.gameModes}
    assertGame(game){
        if(
            ''+game.mode in this.gameModes &&
            game.status in this.gameStatus
        ) return true
        return false
    };
}
let assertGame=new AssertGame({'around-the-world':'' , '301':'' , 'cricket':''}, {'draft':'' , 'started':'' , 'ended':''})
export default assertGame;
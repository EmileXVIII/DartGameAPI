import IAssertItem from "./IAssertItem";
import assertNumber from "./assertNumber";

class AssertGame implements IAssertItem{
    gameModes;
    gameStatus;
    constructor (gameModes,gameStatus){
        this.gameModes=gameModes
        this.gameStatus=gameStatus
    }
    getPossibleGameStatus(){return this.gameStatus}
    getPossibleGameModes(){return this.gameModes}
    assertItem(game){
        return ''+game.mode in this.gameModes &&
        game.status in this.gameStatus
    };
    assertPartialItem(game){
        return (game.mode===undefined||''+game.mode in this.gameModes) &&
            (game.status===undefined||game.status in this.gameStatus)&&
            (game.currentPlayerId===undefined||assertNumber(game.currentPlayerId))
    };
}
let assertGame=new AssertGame({'around-the-world':'' , '301':'' , 'cricket':''}, {'draft':'' , 'started':'' , 'ended':''})
export default assertGame;
import assertNumber from "./assertNumber";
import IAssertItem from "./IAssertItem";
class AssertGamePlayer implements IAssertItem{
    assertItem(body){
        return(assertNumber(body.playerId)&&assertNumber(body.gameId)&&assertNumber(body.score)&&assertNumber(body.remainingShots))
    }
    assertPartialItem(body){
        return ((body.playerId===undefined||assertNumber(body.playerId))&&(body.gameId===undefined||assertNumber(body.gameId))&&(body.score===undefined||assertNumber(body.score))&&(body.remainingShots===undefined||assertNumber(body.remainingShots)))
    }
}
export default new AssertGamePlayer();
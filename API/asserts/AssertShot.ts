import assertNumber from "./assertNumber";
import IAssertItem from "./IAssertItem";
class AssertShot implements IAssertItem{
    assertItem(body){
        return assertNumber(body.gameId)&&assertNumber(body.playerId)&&assertNumber(body.sector)&&assertNumber(body.multiplicator);
    }
    assertPartialItem(body){
        return (body.gameId===undefined||assertNumber(body.gameId))&&(body.playerId===undefined||assertNumber(body.playerId))&&(body.sector===undefined||assertNumber(body.sector))&&(body.multiplicator===undefined||assertNumber(body.multiplicator));
    }
}
export default new AssertShot();
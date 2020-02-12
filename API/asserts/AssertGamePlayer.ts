import assertNumber from "./assertNumber";

function assertGamePlayer(body){
    return(assertNumber(body.playerId)||assertNumber(body.gameId)||assertNumber(body.score)||assertNumber(body.remainingShots))
}
export default assertGamePlayer;
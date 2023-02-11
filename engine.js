//bitboards - one for each piece & colour combo
//attack bitboards (magic numbers)
//psuedo legal move generation
//

/*let whitePawns = 0
let whiteKnights = 0
let whiteBishops = 0
let whiteRooks = 0
let whiteQueens = 0
let whiteKings = 0
let blackPawns = 0
let blackKnights = 0
let blackBishops = 0
let blackRooks = 0
let blackQueens = 0
let blackKings = 0

const RANK1 = 0xff
const RANK2 = 0xff00
const RANK3 = 0xff0000
const RANK4 = 0xff000000
const RANK5 = 0xff00000000
const RANK6 = 0xff0000000000
const RANK7 = 0xff000000000000
const RANK8 = 0xff00000000000000

const AFILE = 0x0101010101010101
const BFILE = 0x0202020202020202
const CFILE = 0x0303030303030303
const DFILE = 0x0404040404040404
const EFILE = 0x0505050505050505
const FFILE = 0x0606060606060606
const GFILE = 0x0707070707070707
const HFILE = 0x0808080808080808*/

function generateMovesToDepth(depth){
    if(depth<1){
      return 1
    }
    const moves = chess.moves()
    let numberofNodes = 0
    for (let i=0;i<moves.length;i++){
      chess.move(moves[i])
      numberofNodes += generateMovesToDepth(depth-1)
      chess.undo()
    }
    return numberofNodes
  }
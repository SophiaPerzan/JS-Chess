import { chess } from "./scripts.js"

const whitePawnPieceSquareTable = [ 0,  0,  0,  0,  0,  0,  0,  0,
                                 50, 50, 50, 50, 50, 50, 50, 50,
                                 10, 10, 20, 30, 30, 20, 10, 10,
                                  5,  5, 10, 25, 25, 10,  5,  5,
                                  0,  0,  0, 20, 20,  0,  0,  0,
                                  5, -5,-10,  0,  0,-10, -5,  5,
                                  5, 10, 10,-20,-20, 10, 10,  5,
                                  0,  0,  0,  0,  0,  0,  0,  0]

const whiteKnightPieceSquareTable = [-50,-40,-30,-30,-30,-30,-40,-50,
                                 -40,-20,  0,  0,  0,  0,-20,-40,
                                 -30,  0, 10, 15, 15, 10,  0,-30,
                                 -30,  5, 15, 20, 20, 15,  5,-30,
                                 -30,  0, 15, 20, 20, 15,  0,-30,
                                 -30,  5, 10, 15, 15, 10,  5,-30,
                                 -40,-20,  0,  5,  5,  0,-20,-40,
                                 -50,-40,-30,-30,-30,-30,-40,-50] 

const whiteBishopPieceSquareTable = [-20,-10,-10,-10,-10,-10,-10,-20,
                                     -10,  0,  0,  0,  0,  0,  0,-10,
                                     -10,  0,  5, 10, 10,  5,  0,-10,
                                     -10,  5,  5, 10, 10,  5,  5,-10,
                                     -10,  0, 10, 10, 10, 10,  0,-10,
                                     -10, 10, 10, 10, 10, 10, 10,-10,
                                     -10,  5,  0,  0,  0,  0,  5,-10,
                                     -20,-10,-10,-10,-10,-10,-10,-20]

const whiteRookPieceSquareTable = [  0,  0,  0,  0,  0,  0,  0,  0,
                                5, 10, 10, 10, 10, 10, 10,  5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                                0,  0,  0,  5,  5,  0,  0,  0]
                            
const whiteQueenPieceSquareTable = [-20,-10,-10, -5, -5,-10,-10,-20,
                               -10,  0,  0,  0,  0,  0,  0,-10,
                               -10,  0,  5,  5,  5,  5,  0,-10,
                                -5,  0,  5,  5,  5,  5,  0, -5,
                                 0,  0,  5,  5,  5,  5,  0, -5,
                               -10,  5,  5,  5,  5,  5,  0,-10,
                               -10,  0,  5,  0,  0,  0,  0,-10,
                               -20,-10,-10, -5, -5,-10,-10,-20]

const whiteKingPieceSquareTable = [-30,-40,-40,-50,-50,-40,-40,-30,
                                   -30,-40,-40,-50,-50,-40,-40,-30,
                                   -30,-40,-40,-50,-50,-40,-40,-30,
                                   -30,-40,-40,-50,-50,-40,-40,-30,
                                   -20,-30,-30,-40,-40,-30,-30,-20,
                                   -10,-20,-20,-20,-20,-20,-20,-10,
                                    20, 20,  0,  0,  0,  0, 20, 20,
                                    20, 30, 10,  0,  0, 10, 30, 20]

const blackPawnPieceSquareTable = [ 0,  0,  0,  0,  0,  0,  0,  0,
                                 5, 10, 10,-20,-20, 10, 10,  5,
                                 5, -5,-10,  0,  0,-10, -5,  5,
                                  0,  0,  0, 20, 20,  0,  0,  0,
                                  5,  5, 10, 25, 25, 10,  5,  5,
                                  10, 10, 20, 30, 30, 20, 10, 10,
                                  50, 50, 50, 50, 50, 50, 50, 50,
                                  0,  0,  0,  0,  0,  0,  0,  0]

const blackKnightPieceSquareTable = [-50,-40,-30,-30,-30,-30,-40,-50,
                                 -40,-20,  0,  5,  5,  0,-20,-40,
                                 -30,  5, 10, 15, 15, 10,  5,-30,
                                 -30,  0, 15, 20, 20, 15,  0,-30,
                                 -30,  5, 15, 20, 20, 15,  5,-30,
                                 -30,  0, 10, 15, 15, 10,  0,-30,
                                 -40,-20,  0,  0,  0,  0,-20,-40,
                                 -50,-40,-30,-30,-30,-30,-40,-50] 

const blackBishopPieceSquareTable = [-20,-10,-10,-10,-10,-10,-10,-20,
                                     -10,  5,  0,  0,  0,  0,  5,-10,
                                     -10, 10, 10, 10, 10, 10, 10,-10,
                                     -10,  0, 10, 10, 10, 10,  0,-10,
                                     -10,  5,  5, 10, 10,  5,  5,-10,
                                     -10,  0,  5, 10, 10,  5,  0,-10,
                                     -10,  0,  0,  0,  0,  0,  0,-10,
                                     -20,-10,-10,-10,-10,-10,-10,-20]

const blackRookPieceSquareTable = [  0,  0,  0,  5,  5,  0,  0,  0,
                                -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               -5,  0,  0,  0,  0,  0,  0, -5,
                               5, 10, 10, 10, 10, 10, 10,  5,
                               0,  0,  0,  0,  0,  0,  0,  0]
                            
const blackQueenPieceSquareTable = [-20,-10,-10, -5, -5,-10,-10,-20,
                               -10,  0,  5,  0,  0,  0,  0,-10,
                               -10,  5,  5,  5,  5,  5,  0,-10,
                                0,  0,  5,  5,  5,  5,  0, -5,
                                -5,  0,  5,  5,  5,  5,  0, -5,
                                -10,  0,  5,  5,  5,  5,  0,-10,
                                -10,  0,  0,  0,  0,  0,  0,-10,
                               -20,-10,-10, -5, -5,-10,-10,-20]

const blackKingPieceSquareTable = [20, 30, 10,  0,  0, 10, 30, 20,
                                   20, 20,  0,  0,  0,  0, 20, 20,
                                   -10,-20,-20,-20,-20,-20,-20,-10,
                                   -20,-30,-30,-40,-40,-30,-30,-20,
                                   -30,-40,-40,-50,-50,-40,-40,-30,
                                   -30,-40,-40,-50,-50,-40,-40,-30,
                                   -30,-40,-40,-50,-50,-40,-40,-30,
                                    -30,-40,-40,-50,-50,-40,-40,-30]


//let principleVariation = []

export function generateMovesToDepth(depth){
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

function maximizing(depth, alpha, beta, moveMade){
    if(depth === 0){
        return {score: evaltuatePosition(), pV: []}
    }else{
        const moves = chess.moves()
        let principleVariation = [moves[0]]
        for (let i=0;i<moves.length;i++){
            chess.move(moves[i])
            let result = minimizing(depth-1, alpha, beta, moves[i])
            let score = result.score
            if(score>=beta){
                chess.undo()
                return {score: beta, pV: principleVariation}
            }
            if(score>alpha){
                alpha = score
                result.pV.push(moves[i])
                principleVariation = result.pV
            }
            chess.undo()
          }
          return {score: alpha, pV: principleVariation}
    }
}

function minimizing(depth, alpha, beta, moveMade){
    if(depth === 0){
        return {score: evaltuatePosition(), pV: []}
    }else{
        const moves = chess.moves()
        let principleVariation = [moves[0]]
        for (let i=0;i<moves.length;i++){
            chess.move(moves[i])
            let result = maximizing(depth-1, alpha, beta, moves[i])
            let score = result.score
            if(score<=alpha){
                chess.undo()
                return {score: alpha, pV: principleVariation}
            }
            if(score<beta){
                beta = score
                result.pV.push(moves[i])
                principleVariation = result.pV
            }
            chess.undo()
          }
        return {score: beta, pV: principleVariation}
    }
}

function iterativeDeepening(depth){


}

export function getBestMove(depth){
    const moves = chess.moves({verbose: true})
    let moveScores = []
    for (let i=0;i<moves.length;i++){
        chess.move(moves[i])
        if(chess.turn() === 'w'){
            moveScores.push(maximizing(depth-1, -1000000000, 1000000000, moves[i]))
        }else{
            moveScores.push(minimizing(depth-1, -1000000000, 1000000000, moves[i]))
        }
        chess.undo()
      }
    let bestMoveIndex = 0
    
    if(chess.turn() === 'w'){
        let max = -100000000
        for (let i=0;i<moveScores.length;i++){
            if(moveScores[i].score>max){
                max = moveScores[i].score
                bestMoveIndex = i
            }
        }
    }else{
        let min = 100000000
        for (let i=0;i<moveScores.length;i++){
            if(moveScores[i].score<min){
                min = moveScores[i].score
                bestMoveIndex = i
            }
        }
    }
    return {move: moves[bestMoveIndex], score: moveScores[bestMoveIndex].score, pV: moveScores[bestMoveIndex].pV}
}

export function evaltuatePosition(){
    let sumEval = 0
    let squareEval = 0;
    if(chess.isDraw()){
        return 0
    }
    let boardArray = chess.board()
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(boardArray[i][j] === null){
                
            }else{
                squareEval = 0
                
                switch(boardArray[i][j].color){
                    case('w'):
                    switch(boardArray[i][j].type){
                        case('p'):
                        squareEval = 100 + whitePawnPieceSquareTable[i*8+j]
                        break;
                        case('n'):
                        squareEval = 300 + whiteKnightPieceSquareTable[i*8+j]
                        break;
                        case('b'):
                        squareEval = 325 + whiteBishopPieceSquareTable[i*8+j]
                        break;
                        case('r'):
                        squareEval = 500 + whiteRookPieceSquareTable[i*8+j]
                        break;
                        case('q'):
                        squareEval = 900 + whiteQueenPieceSquareTable[i*8+j]
                        break;
                        case('k'):
                        squareEval = 1000000 + whiteKingPieceSquareTable[i*8+j]
                        break;
                        default:
                        squareEval = 0
                        break;
                    }
                    sumEval+=squareEval
                    break;
                    case('b'):
                    switch(boardArray[i][j].type){
                        case('p'):
                        squareEval = 100 + blackPawnPieceSquareTable[i*8+j]
                        break;
                        case('n'):
                        squareEval = 300 + blackKnightPieceSquareTable[i*8+j]
                        break;
                        case('b'):
                        squareEval = 325 + blackBishopPieceSquareTable[i*8+j]
                        break;
                        case('r'):
                        squareEval = 500 + blackRookPieceSquareTable[i*8+j]
                        break;
                        case('q'):
                        squareEval = 900 + blackQueenPieceSquareTable[i*8+j]
                        break;
                        case('k'):
                        squareEval = 1000000 + blackKingPieceSquareTable[i*8+j]
                        break;
                        default:
                        squareEval = 0
                        break;
                    }
                    sumEval-=squareEval
                    break;
                    default:
                    break;
                }
            }
            
        }
    }
    return sumEval
}
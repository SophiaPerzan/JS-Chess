
import { Chess } from 'https://unpkg.com/chess.js@1.0.0-beta.3/dist/chess.js';

const chess = new Chess();

var board = Chessboard('chessBoard', {
    draggable: true,
    dropOffBoard: 'snapback',
    sparePieces: false,
    position: 'start'/*,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd*/
  });
  $('#startBtn').on('click', board.start)
  $('#clearBtn').on('click', board.clear)

  function makeRandomMove(){
  if (!chess.isGameOver()) {
    const moves = chess.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    chess.move(move)
    board.position(chess.fen())
    }
    if (!chess.isGameOver()) {
        setTimeout(()=> {makeRandomMove()}, 400  );
    }
}

makeRandomMove();
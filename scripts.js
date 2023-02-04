
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
  $('#startBtn').on('click', onStartButtonClick)
  $('#clearBtn').on('click', onClearButtonClick)
  $('#randomMoveButton').on('click',onRandomButtonClick)

  function onStartButtonClick(){
    try {
        chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w')
      } catch (e) {
        console.log(e)
      }
    board.start()
    
  }

  function onClearButtonClick(){
    chess.clear();
    board.clear();
  }

  function onRandomButtonClick(){
    makeRandomMove();
  }

  function makeRandomMove(){
  if (!chess.isGameOver()) {
    const moves = chess.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    chess.move(move)
    board.position(chess.fen())
    }
}
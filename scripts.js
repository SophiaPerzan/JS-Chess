
import { Chess } from 'https://unpkg.com/chess.js@1.0.0-beta.3/dist/chess.js';

var board = Chessboard('chessBoard', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true
  })

  $('#startBtn').on('click', board.start)
  $('#clearBtn').on('click', board.clear)
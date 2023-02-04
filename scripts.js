
import { Chess } from 'https://unpkg.com/chess.js@1.0.0-beta.3/dist/chess.js';

const chess = new Chess();

var board = Chessboard('chessBoard', {
    //Do onChange to reset eval
    draggable: true,
    dropOffBoard: 'snapback',
    sparePieces: false,
    position: 'start',
    showErrors: 'console',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare
  });
  $('#startBtn').on('click', onStartButtonClick)
  $('#clearBtn').on('click', onClearButtonClick)
  $('#randomMoveButton').on('click',onRandomButtonClick)
  $('#queenButton').on('click', onQueenButtonClick)
  $('#rookButton').on('click', onRookButtonClick)
  $('#bishopButton').on('click', onBishopButtonClick)
  $('#knightButton').on('click', onKnightButtonClick)

  let whiteSquareGrey = '#a9a9a9'
  let blackSquareGrey = '#696969'
  let desiredPromotion = '';
  let disableInteraction = false;
  let sourcePawn = '';
  let targetSquareForPawn = '';

  function onQueenButtonClick(){
    hidePromotionButtons();
    desiredPromotion = 'q'
    disableInteraction = false;
    attemptPromotionMove();
  }

  function onRookButtonClick(){
    hidePromotionButtons();
    desiredPromotion = 'r'
    disableInteraction = false;
    attemptPromotionMove();
  }

  function onBishopButtonClick(){
    hidePromotionButtons();
    desiredPromotion = 'b'
    disableInteraction = false;
    attemptPromotionMove();
  }

  function onKnightButtonClick(){
    hidePromotionButtons();
    desiredPromotion = 'n'
    disableInteraction = false;
    attemptPromotionMove();
  }

  function onStartButtonClick(){
    if(disableInteraction){
        return
    }
    try {
        chess.reset();
      } catch (e) {
        console.log(e)
      }
    board.start()
    
  }

  function onClearButtonClick(){
    if(disableInteraction){
        return
    }
    chess.clear();
    board.clear();
  }

  function onRandomButtonClick(){
    if(disableInteraction){
        return
    }
    makeRandomMove();
  }

  function removeGreySquares () {
    $('#chessBoard .square-55d63').css('background', '')
  }

  function makeSquareGrey (square) {
    let $square = $('#chessBoard .square-' + square)
  
    let backgroundColour = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      backgroundColour = blackSquareGrey
    }
  
    $square.css('background', backgroundColour)
  }

  function onMouseoverSquare (square, piece) {
    let possibleMoves = chess.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (possibleMoves.length === 0) return
  
    // highlight the square they moused over
    makeSquareGrey(square);
  
    // highlight the possible squares for this piece
    for (var i = 0; i < possibleMoves.length; i++) {
      makeSquareGrey(possibleMoves[i].to);
    }
  }

  function showPromotionButtons(){
    $('#promotionDiv').css('visibility','visible');
  }

  function hidePromotionButtons(){
    $('#promotionDiv').css('visibility','hidden');
  }

  function onDragStart(sourceOfPiece, piece, boardPosition, boardOrientation){

    if(chess.isGameOver() || disableInteraction){
        return false
    }
    if ((chess.turn() === 'w' && chess.get(sourceOfPiece).color !== 'w') ||
        (chess.turn() === 'b' && chess.get(sourceOfPiece).color !== 'b')) {
    return false
    }
    return true
  }

  function attemptPromotionMove(){
    try {
        let moveSuccessful = chess.move({from: sourcePawn, to: targetSquareForPawn, promotion: desiredPromotion});
    } catch (error) {
        //window.alert("Invalid move")
    }
    sourcePawn = '';
    targetSquareForPawn = '';
    desiredPromotion = '';
    board.position(chess.fen());
  }

  function onDrop(sourceOfPiece, targetSquare, piece, positionAfterDrop, positionBeforeDrop, boardOrientation){
    removeGreySquares();
    let regex8thRank = /8/;
    let regex1stRank = /1/;
    if( chess.get(sourceOfPiece).type === 'p' && 
    ((regex8thRank.test(targetSquare) === true && chess.get(sourceOfPiece).color === 'w') || 
    (regex1stRank.test(targetSquare) === true && chess.get(sourceOfPiece).color === 'b')) ){
        showPromotionButtons();
        disableInteraction = true;
        sourcePawn = sourceOfPiece;
        targetSquareForPawn = targetSquare;
        return
    }
    try {
        let moveSuccessful = chess.move({from: sourceOfPiece, to: targetSquare});
    } catch (error) {
        return 'snapback'
    }
    return
  }

  function onMouseoutSquare (square, piece) {
    removeGreySquares();
  }

  function onSnapEnd(){
    if(disableInteraction){
        return
    }
    board.position(chess.fen());
  }

  function makeRandomMove(){
  if (!chess.isGameOver()) {
    const moves = chess.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    chess.move(move)
    board.position(chess.fen())
    }
}

import { Chess } from 'https://unpkg.com/chess.js@1.0.0-beta.3/dist/chess.js';
import { evaltuatePosition, getBestMove } from './engine.js';

export const chess = new Chess();

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
  let $board = $('#chessBoard')
  let whiteSquareGrey = '#a9a9a9'
  let blackSquareGrey = '#696969'
  let desiredPromotion = '';
  let disableInteraction = false;
  let sourcePawn = '';
  let targetSquareForPawn = '';
  let squareClass = 'square-55d63'
  let squareToHighlight = null
  let colorToHighlight = null
    
  $('#startBtn').on('click', onStartButtonClick)
  $('#clearBtn').on('click', onClearButtonClick)
  $('#aiMoveButton').on('click',onAIButtonClick)
  $('#queenButton').on('click', onQueenButtonClick)
  $('#rookButton').on('click', onRookButtonClick)
  $('#bishopButton').on('click', onBishopButtonClick)
  $('#knightButton').on('click', onKnightButtonClick)

  function removeHighlights (color) {
    $board.find('.' + squareClass)
      .removeClass('highlight-' + color)
  }

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
    removeHighlights('white')
    removeHighlights('black')
    board.start()
    
  }

  function onClearButtonClick(){
    if(disableInteraction){
        return
    }
    removeHighlights('white')
    removeHighlights('black')
    chess.clear();
    board.clear();
  }

  function onAIButtonClick(){
    if(disableInteraction){
        return
    }
    disableInteraction = true
    makeAIMove();
    disableInteraction = false
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
    if(chess.turn() === 'w'){
      $('#queenImage').attr('src','./img/chesspieces/wikipedia/wQ.png')
      $('#rookImage').attr('src','./img/chesspieces/wikipedia/wR.png')
      $('#bishopImage').attr('src','./img/chesspieces/wikipedia/wB.png')
      $('#knightImage').attr('src','./img/chesspieces/wikipedia/wN.png')
    }else{
      $('#queenImage').attr('src','./img/chesspieces/wikipedia/bQ.png')
      $('#rookImage').attr('src','./img/chesspieces/wikipedia/bR.png')
      $('#bishopImage').attr('src','./img/chesspieces/wikipedia/bB.png')
      $('#knightImage').attr('src','./img/chesspieces/wikipedia/bN.png')
    }

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
    if(chess.turn() === 'b'){
      removeHighlights('black')
      removeHighlights('white')
      $board.find('.square-' + sourcePawn).addClass('highlight-white')
      squareToHighlight = targetSquareForPawn
      $board.find('.square-' + squareToHighlight)
    .addClass('highlight-white')
    }else{
      removeHighlights('black')
      removeHighlights('white')
      $board.find('.square-' + sourcePawn).addClass('highlight-black')
      squareToHighlight = targetSquareForPawn
      $board.find('.square-' + squareToHighlight)
    .addClass('highlight-black')
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
    if(chess.turn() === 'b'){
      removeHighlights('black')
      removeHighlights('white')
      $board.find('.square-' + sourceOfPiece).addClass('highlight-white')
      squareToHighlight = targetSquare
      $board.find('.square-' + squareToHighlight)
    .addClass('highlight-white')
    }else{
      removeHighlights('black')
      removeHighlights('white')
      $board.find('.square-' + sourceOfPiece).addClass('highlight-black')
      squareToHighlight = targetSquare
      $board.find('.square-' + squareToHighlight)
    .addClass('highlight-black')
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

  function makeAIMove(){
  if (!chess.isGameOver()) {
    const bestMove = getBestMove(4)
    const move = bestMove.move
    if(chess.turn() === 'w'){
      removeHighlights('black')
      removeHighlights('white')
      $board.find('.square-' + move.from).addClass('highlight-white')
      squareToHighlight = move.to
      $board.find('.square-' + squareToHighlight)
    .addClass('highlight-white')
    }else{
      removeHighlights('black')
      removeHighlights('white')
      $board.find('.square-' + move.from).addClass('highlight-black')
      squareToHighlight = move.to
      $board.find('.square-' + squareToHighlight)
    .addClass('highlight-black')
    }
    console.log("Turn to move: "+chess.turn()+", Best Engine Move: "+bestMove.move.san+", Engine Evaluation: "+bestMove.score/100.0+" Principle Variation: "+bestMove.pV.reverse().toString())
    chess.move(bestMove.move)
    
    board.position(chess.fen())
    }
}
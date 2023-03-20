import { Chess } from "https://unpkg.com/chess.js@1.0.0-beta.3/dist/chess.js";
import { iterativeDeepening } from "./engine.js";
const { compute } = dcp;

export const chess = new Chess();

var board = Chessboard("chessBoard", {
  //Do onChange to reset eval
  draggable: true,
  dropOffBoard: "snapback",
  sparePieces: false,
  position: "start",
  showErrors: "console",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
});
let $board = $("#chessBoard");
let $analysis = $("#analysis");
let $recMove = $("#reccomendedMove");
let $eval = $("#evaluation");
let $pV = $("#pV");
let $fen = $("#fen");
export let $progress = $("#progressBar");
export let searchDepth = parseInt($("#depthSelect").val());
let whiteSquareGrey = "#a9a9a9";
let blackSquareGrey = "#696969";
let desiredPromotion = "";
let disableInteraction = false;
let sourcePawn = "";
let targetSquareForPawn = "";
let squareClass = "square-55d63";
let squareToHighlight = null;
let colorToHighlight = null;

$("#startBtn").on("click", onStartButtonClick);
$("#DCPBtn").on("click", onDCPButtonClick);
$("#aiMoveButton").on("click", onAIButtonClick);
$("#queenButton").on("click", onQueenButtonClick);
$("#rookButton").on("click", onRookButtonClick);
$("#bishopButton").on("click", onBishopButtonClick);
$("#knightButton").on("click", onKnightButtonClick);
$("#depthSelect").on("change", updateDepth);
$("#loadPosition").on("click", loadFen);

function loadFen() {
  if (disableInteraction) {
    return;
  }
  try {
    chess.load($fen.val());
  } catch (e) {
    $fen.val("");
    $fen.attr("placeholder", "Error: Invalid FEN");
  }
  resetAnalysisHints();
  removeHighlights("white");
  removeHighlights("black");
  board.position(chess.fen());
}

function updateDepth() {
  searchDepth = parseInt(this.value);
}

function removeHighlights(color) {
  $board.find("." + squareClass).removeClass("highlight-" + color);
}

function onQueenButtonClick() {
  hidePromotionButtons();
  desiredPromotion = "q";
  disableInteraction = false;
  attemptPromotionMove();
}

function onRookButtonClick() {
  hidePromotionButtons();
  desiredPromotion = "r";
  disableInteraction = false;
  attemptPromotionMove();
}

function onBishopButtonClick() {
  hidePromotionButtons();
  desiredPromotion = "b";
  disableInteraction = false;
  attemptPromotionMove();
}

function onKnightButtonClick() {
  hidePromotionButtons();
  desiredPromotion = "n";
  disableInteraction = false;
  attemptPromotionMove();
}

function onStartButtonClick() {
  if (disableInteraction) {
    return;
  }
  try {
    chess.reset();
  } catch (e) {
    console.log(e);
  }
  removeHighlights("white");
  removeHighlights("black");
  resetAnalysisHints();
  board.start();
}

function onDCPButtonClick() {
  if (disableInteraction) {
    return;
  }
  removeHighlights("white");
  removeHighlights("black");
  deploy();
}

async function onAIButtonClick() {
  if (disableInteraction) {
    return;
  }
  disableInteraction = true;
}

function removeGreySquares() {
  $("#chessBoard .square-55d63").css("background", "");
}

function makeSquareGrey(square) {
  let $square = $("#chessBoard .square-" + square);

  let backgroundColour = whiteSquareGrey;
  if ($square.hasClass("black-3c85d")) {
    backgroundColour = blackSquareGrey;
  }

  $square.css("background", backgroundColour);
}

function onMouseoverSquare(square, piece) {
  let possibleMoves = chess.moves({
    square: square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (possibleMoves.length === 0) return;

  // highlight the square they moused over
  makeSquareGrey(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < possibleMoves.length; i++) {
    makeSquareGrey(possibleMoves[i].to);
  }
}

function showPromotionButtons() {
  if (chess.turn() === "w") {
    $("#queenImage").attr("src", "./img/chesspieces/wikipedia/wQ.png");
    $("#rookImage").attr("src", "./img/chesspieces/wikipedia/wR.png");
    $("#bishopImage").attr("src", "./img/chesspieces/wikipedia/wB.png");
    $("#knightImage").attr("src", "./img/chesspieces/wikipedia/wN.png");
  } else {
    $("#queenImage").attr("src", "./img/chesspieces/wikipedia/bQ.png");
    $("#rookImage").attr("src", "./img/chesspieces/wikipedia/bR.png");
    $("#bishopImage").attr("src", "./img/chesspieces/wikipedia/bB.png");
    $("#knightImage").attr("src", "./img/chesspieces/wikipedia/bN.png");
  }

  $("#promotionDiv").css("visibility", "visible");
}

function hidePromotionButtons() {
  $("#promotionDiv").css("visibility", "hidden");
}

function onDragStart(sourceOfPiece, piece, boardPosition, boardOrientation) {
  if (chess.isGameOver() || disableInteraction) {
    return false;
  }
  if (
    (chess.turn() === "w" && chess.get(sourceOfPiece).color !== "w") ||
    (chess.turn() === "b" && chess.get(sourceOfPiece).color !== "b")
  ) {
    return false;
  }
  return true;
}

function attemptPromotionMove() {
  let moveSuccessful = false;
  try {
    moveSuccessful = chess.move({
      from: sourcePawn,
      to: targetSquareForPawn,
      promotion: desiredPromotion,
    });
  } catch (error) {}
  sourcePawn = "";
  targetSquareForPawn = "";
  desiredPromotion = "";
  board.position(chess.fen());
  if (moveSuccessful === false) {
    return;
  }
  resetAnalysisHints();
  if (chess.turn() === "b") {
    removeHighlights("black");
    removeHighlights("white");
    $board.find(".square-" + sourcePawn).addClass("highlight-white");
    squareToHighlight = targetSquareForPawn;
    $board.find(".square-" + squareToHighlight).addClass("highlight-white");
  } else {
    removeHighlights("black");
    removeHighlights("white");
    $board.find(".square-" + sourcePawn).addClass("highlight-black");
    squareToHighlight = targetSquareForPawn;
    $board.find(".square-" + squareToHighlight).addClass("highlight-black");
  }
}

function onDrop(
  sourceOfPiece,
  targetSquare,
  piece,
  positionAfterDrop,
  positionBeforeDrop,
  boardOrientation
) {
  removeGreySquares();
  let regex8thRank = /8/;
  let regex1stRank = /1/;
  if (
    chess.get(sourceOfPiece).type === "p" &&
    ((regex8thRank.test(targetSquare) === true &&
      chess.get(sourceOfPiece).color === "w") ||
      (regex1stRank.test(targetSquare) === true &&
        chess.get(sourceOfPiece).color === "b"))
  ) {
    showPromotionButtons();
    disableInteraction = true;
    sourcePawn = sourceOfPiece;
    targetSquareForPawn = targetSquare;
    return;
  }
  try {
    let moveSuccessful = chess.move({ from: sourceOfPiece, to: targetSquare });
  } catch (error) {
    return "snapback";
  }
  if (chess.turn() === "b") {
    removeHighlights("black");
    removeHighlights("white");
    $board.find(".square-" + sourceOfPiece).addClass("highlight-white");
    squareToHighlight = targetSquare;
    $board.find(".square-" + squareToHighlight).addClass("highlight-white");
  } else {
    removeHighlights("black");
    removeHighlights("white");
    $board.find(".square-" + sourceOfPiece).addClass("highlight-black");
    squareToHighlight = targetSquare;
    $board.find(".square-" + squareToHighlight).addClass("highlight-black");
  }
  resetAnalysisHints();
  return;
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

function onSnapEnd() {
  if (disableInteraction) {
    return;
  }
  board.position(chess.fen());
}

function updateProgress(value) {
  $progress.val(value);
}

function resetAnalysisHints() {
  $analysis.text("Analysis: None");
  $recMove.text("Reccomended Move: None");
  $eval.text("Evaluation: None");
  $pV.text("Principle Variation: None");
  $progress.val("0");
}

function makeAIMove() {
  if (!chess.isGameOver()) {
    resetAnalysisHints();
    const bestMove = iterativeDeepening(searchDepth);
    const move = bestMove.move;
    if (chess.turn() === "w") {
      removeHighlights("black");
      removeHighlights("white");
      $board.find(".square-" + move.from).addClass("highlight-white");
      squareToHighlight = move.to;
      $board.find(".square-" + squareToHighlight).addClass("highlight-white");
    } else {
      removeHighlights("black");
      removeHighlights("white");
      $board.find(".square-" + move.from).addClass("highlight-black");
      squareToHighlight = move.to;
      $board.find(".square-" + squareToHighlight).addClass("highlight-black");
    }
    $analysis.text("Analysis: Local");
    $recMove.text("Reccomended Move: " + bestMove.move.san);
    $eval.text("Evaluation: " + bestMove.score / 100.0);
    $pV.text(
      "Principle Variation: " +
        bestMove.pV.reverse().toString().replaceAll(",", ", ")
    );
    //chess.move(bestMove.move)

    board.position(chess.fen());
  }
}
process.on("unhandledRejection", (e) => {
  console.trace("****got a reject", e);
});

function addJobEventListeners(job) {
  job.on("readystatechange", (event) => {
    console.log(`New ready state: ${event}`);
  });

  job.on("accepted", () => {
    console.log(`Job accepted by scheduler, waiting for results...`);
    console.log(`Job has id ${job.id}`);
  });

  job.on("console", (event) => {
    console.log("Job console event:", event.message);
  });

  job.on("result", ({ sliceNumber, result }) => {
    console.log(`Received result for slice ${sliceNumber}:`, result);
    console.log(
      "-----------------------------------------------------------------------------\n"
    );
  });
  job.on("complete", (complete) =>
    console.log(`Job completed ${complete.length} slices`)
  );
  job.on("error", (error) => console.log(error));
  job.on("status", (status) => console.log("Status:", status));
}

async function deploy() {
  $progress.val(0);
  resetAnalysisHints();
  const moves = chess.moves();
  const inputSet = [];
  for (let i = 0; i < moves.length; i++) {
    chess.move(moves[i]);
    inputSet.push([chess.pgn(), moves[i]]);
    chess.undo();
  }

  async function workFunction(_input, depth) {
    progress(0);

    const Chess = require("chess.js").Chess;
    const chess = new Chess();
    chess.loadPgn(_input[0]);
    const maxDepth = depth;
    return { result: iterativeDeepening(maxDepth), movePlayed: _input[1] };

    function maximizing(depth, alpha, beta, variation) {
      if (depth === 0) {
        return { score: evaluatePosition(), pV: [] };
      } else {
        const moves = chess.moves();
        if (variation !== undefined) {
          makeMoveFirst(variation.pop(), moves);
        }
        let principleVariation = [moves[0]];
        for (let i = 0; i < moves.length; i++) {
          chess.move(moves[i]);
          let result;
          if (i === 0) {
            result = minimizing(depth - 1, alpha, beta, variation);
          } else {
            result = minimizing(depth - 1, alpha, beta, undefined);
          }
          let score = result.score;
          if (score >= beta) {
            chess.undo();
            return { score: beta, pV: principleVariation };
          }
          if (score > alpha) {
            alpha = score;
            result.pV.push(moves[i]);
            principleVariation = result.pV;
          }
          chess.undo();
        }
        return { score: alpha, pV: principleVariation };
      }
    }

    function minimizing(depth, alpha, beta, variation) {
      if (depth === 0) {
        return { score: evaluatePosition(), pV: [] };
      } else {
        const moves = chess.moves();
        if (variation !== undefined) {
          makeMoveFirst(variation.pop(), moves);
        }
        let principleVariation = [moves[0]];
        for (let i = 0; i < moves.length; i++) {
          chess.move(moves[i]);
          let result;
          if (i === 0) {
            result = maximizing(depth - 1, alpha, beta, variation);
          } else {
            result = maximizing(depth - 1, alpha, beta, undefined);
          }
          let score = result.score;
          if (score <= alpha) {
            chess.undo();
            return { score: alpha, pV: principleVariation };
          }
          if (score < beta) {
            beta = score;
            result.pV.push(moves[i]);
            principleVariation = result.pV;
          }
          chess.undo();
        }
        return { score: beta, pV: principleVariation };
      }
    }

    function iterativeDeepening(depth) {
      let bestMove = getBestMove(0, undefined);
      for (let i = 1; i < depth + 1; i++) {
        bestMove = getBestMove(i, bestMove.pV);
        //console.log("IterativeDeepening best move: "+bestMove.pV)
      }

      return { move: bestMove.move, score: bestMove.score, pV: bestMove.pV };
    }

    function makeMoveFirst(move, moveArray) {
      if (move === undefined) {
        return;
      }
      for (let i = 0; i < moveArray.length; i++) {
        if (moveArray[i] === move) {
          let temp = moveArray[0];
          moveArray[0] = moveArray[i];
          moveArray[i] = temp;
          //console.log("Moved "+moveArray[0]+" to the front")
          return moveArray;
        }
      }
      return moveArray;
    }

    function getBestMove(depth, variation) {
      if (depth < 1) {
        return { move: undefined, score: 0, pV: undefined };
      }
      let moves = chess.moves({ verbose: true });
      if (variation !== undefined) {
        let pVMove = variation.pop();
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].san === pVMove) {
            let temp = moves[0];
            moves[0] = moves[i];
            moves[i] = temp;
            //console.log("Moved "+moves[0]+" to the front")
          }
        }
        //moves = makeMoveFirst(variation.pop(), moves)
      }
      //console.log("move array in getBestMove(): "+moves[0].san)
      let moveScores = [];
      for (let i = 0; i < moves.length; i++) {
        if (depth === maxDepth) {
          progress(i / moves.length);
        }
        //------------------------------------------------------------------------------------------------progress
        chess.move(moves[i]);
        //console.log(i+"th move: "+moves[i].san)
        if (chess.turn() === "w") {
          moveScores.push(
            maximizing(depth - 1, -1000000000, 1000000000, variation)
          );
        } else {
          moveScores.push(
            minimizing(depth - 1, -1000000000, 1000000000, variation)
          );
        }
        chess.undo();
      }
      let bestMoveIndex = 0;

      if (chess.turn() === "w") {
        let max = -100000000;
        for (let i = 0; i < moveScores.length; i++) {
          if (moveScores[i].score > max) {
            max = moveScores[i].score;
            bestMoveIndex = i;
            moveScores[bestMoveIndex].pV.push(moves[bestMoveIndex].san);
          }
        }
      } else {
        let min = 100000000;
        for (let i = 0; i < moveScores.length; i++) {
          if (moveScores[i].score < min) {
            min = moveScores[i].score;
            bestMoveIndex = i;
            moveScores[bestMoveIndex].pV.push(moves[bestMoveIndex].san);
          }
        }
      }
      return {
        move: moves[bestMoveIndex],
        score: moveScores[bestMoveIndex].score,
        pV: moveScores[bestMoveIndex].pV,
      };
    }

    function evaluatePosition() {
      const whitePawnPieceSquareTable = [
        0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30,
        30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5,
        -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0,
        0, 0, 0, 0,
      ];

      const whiteKnightPieceSquareTable = [
        -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40,
        -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0,
        15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5,
        5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50,
      ];

      const whiteBishopPieceSquareTable = [
        -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10,
        0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10,
        10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5,
        -10, -20, -10, -10, -10, -10, -10, -10, -20,
      ];

      const whiteRookPieceSquareTable = [
        0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0,
        0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0,
        0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
      ];

      const whiteQueenPieceSquareTable = [
        -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10,
        0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0,
        -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10,
        -10, -5, -5, -10, -10, -20,
      ];

      const whiteKingPieceSquareTable = [
        -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
        -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50,
        -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20,
        -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0,
        0, 10, 30, 20,
      ];

      const blackPawnPieceSquareTable = [
        0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, -20, -20, 10, 10, 5, 5, -5, -10, 0,
        0, -10, -5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, 5, 10, 25, 25, 10, 5, 5, 10,
        10, 20, 30, 30, 20, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0,
        0, 0, 0, 0,
      ];

      const blackKnightPieceSquareTable = [
        -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 5, 5, 0, -20, -40,
        -30, 5, 10, 15, 15, 10, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5,
        15, 20, 20, 15, 5, -30, -30, 0, 10, 15, 15, 10, 0, -30, -40, -20, 0, 0,
        0, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50,
      ];

      const blackBishopPieceSquareTable = [
        -20, -10, -10, -10, -10, -10, -10, -20, -10, 5, 0, 0, 0, 0, 5, -10, -10,
        10, 10, 10, 10, 10, 10, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 5, 5,
        10, 10, 5, 5, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0,
        -10, -20, -10, -10, -10, -10, -10, -10, -20,
      ];

      const blackRookPieceSquareTable = [
        0, 0, 0, 5, 5, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
        -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0,
        0, 0, -5, 5, 10, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
      ];

      const blackQueenPieceSquareTable = [
        -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 5, 0, 0, 0, 0, -10, -10,
        5, 5, 5, 5, 5, 0, -10, 0, 0, 5, 5, 5, 5, 0, -5, -5, 0, 5, 5, 5, 5, 0,
        -5, -10, 0, 5, 5, 5, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0, -10, -20, -10,
        -10, -5, -5, -10, -10, -20,
      ];

      const blackKingPieceSquareTable = [
        20, 30, 10, 0, 0, 10, 30, 20, 20, 20, 0, 0, 0, 0, 20, 20, -10, -20, -20,
        -20, -20, -20, -20, -10, -20, -30, -30, -40, -40, -30, -30, -20, -30,
        -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
        -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50,
        -40, -40, -30,
      ];
      let sumEval = 0;
      let squareEval = 0;
      if (chess.isDraw()) {
        return 0;
      }
      let boardArray = chess.board();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (boardArray[i][j] === null) {
          } else {
            squareEval = 0;

            switch (boardArray[i][j].color) {
              case "w":
                switch (boardArray[i][j].type) {
                  case "p":
                    squareEval = 100 + whitePawnPieceSquareTable[i * 8 + j];
                    break;
                  case "n":
                    squareEval = 300 + whiteKnightPieceSquareTable[i * 8 + j];
                    break;
                  case "b":
                    squareEval = 325 + whiteBishopPieceSquareTable[i * 8 + j];
                    break;
                  case "r":
                    squareEval = 500 + whiteRookPieceSquareTable[i * 8 + j];
                    break;
                  case "q":
                    squareEval = 900 + whiteQueenPieceSquareTable[i * 8 + j];
                    break;
                  case "k":
                    squareEval = 1000000 + whiteKingPieceSquareTable[i * 8 + j];
                    break;
                  default:
                    squareEval = 0;
                    break;
                }
                sumEval += squareEval;
                break;
              case "b":
                switch (boardArray[i][j].type) {
                  case "p":
                    squareEval = 100 + blackPawnPieceSquareTable[i * 8 + j];
                    break;
                  case "n":
                    squareEval = 300 + blackKnightPieceSquareTable[i * 8 + j];
                    break;
                  case "b":
                    squareEval = 325 + blackBishopPieceSquareTable[i * 8 + j];
                    break;
                  case "r":
                    squareEval = 500 + blackRookPieceSquareTable[i * 8 + j];
                    break;
                  case "q":
                    squareEval = 900 + blackQueenPieceSquareTable[i * 8 + j];
                    break;
                  case "k":
                    squareEval = 1000000 + blackKingPieceSquareTable[i * 8 + j];
                    break;
                  default:
                    squareEval = 0;
                    break;
                }
                sumEval -= squareEval;
                break;
              default:
                break;
            }
          }
        }
      }
      return sumEval;
    }
  }

  const sliceDepth = searchDepth - 1;
  const job = compute.for(inputSet, workFunction, [sliceDepth]);
  addJobEventListeners(job);
  job.public.name = "Distributed Chess Engine";
  job.public.description = "Making pro-level analysis more accessible";
  job.public.link = "https://github.com/SophiaPerzan/JS-Chess";
  job.estimationSlices = Infinity;
  job.greedyEstimation = true;
  job.requires("dcp-chess/chess.js");
  job.computeGroups = [{ joinKey: "insight", joinSecret: "dcp" }];

  const moveScores = await job.exec(0.005);
  //const moveScores = await job.localExec(31);

  let bestMoveIndex = 0;
  if (chess.turn() === "w") {
    let max = -100000000;
    for (let i = 0; i < moveScores.length; i++) {
      if (moveScores[i].result.score > max) {
        max = moveScores[i].result.score;
        bestMoveIndex = i;
        moveScores[bestMoveIndex].result.pV.push(
          moveScores[bestMoveIndex].movePlayed
        );
      }
    }
  } else {
    let min = 100000000;
    for (let i = 0; i < moveScores.length; i++) {
      if (moveScores[i].result.score < min) {
        min = moveScores[i].result.score;
        bestMoveIndex = i;
        moveScores[bestMoveIndex].result.pV.push(
          moveScores[bestMoveIndex].movePlayed
        );
      }
    }
  }
  $analysis.text("Analysis: Distributed");
  $recMove.text("Reccomended Move: " + moveScores[bestMoveIndex].movePlayed);
  $eval.text("Evaluation: " + moveScores[bestMoveIndex].result.score / 100.0);
  $pV.text(
    "Principle Variation: " +
      moveScores[bestMoveIndex].result.pV
        .reverse()
        .toString()
        .replaceAll(",", ", ")
  );

  let movList = chess.moves({ verbose: true });
  let move = movList[0];
  for (let j = 0; j < movList.length; j++) {
    if (moveScores[bestMoveIndex].movePlayed === movList[j].san) {
      move = movList[j];
    }
  }

  if (chess.turn() === "w") {
    removeHighlights("black");
    removeHighlights("white");
    $board.find(".square-" + move.from).addClass("highlight-white");
    squareToHighlight = move.to;
    $board.find(".square-" + squareToHighlight).addClass("highlight-white");
  } else {
    removeHighlights("black");
    removeHighlights("white");
    $board.find(".square-" + move.from).addClass("highlight-black");
    squareToHighlight = move.to;
    $board.find(".square-" + squareToHighlight).addClass("highlight-black");
  }
}

const scheduler = "https://scheduler.distributed.computer";
require("dcp-client")
  .init(scheduler)
  .then(deploy)
  .finally(() => setImmediate(process.exit));

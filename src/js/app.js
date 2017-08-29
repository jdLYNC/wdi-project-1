// _____________________________Global Variables________________________________
// Board size/position variables.
const boardHeightMax = 700;
const boardHeightMin = 200;
const boardLeftPositonMax = 500;
const boardLeftPositonMin = 100;
const boardTopPositionMax = 300;
const boardTopPositionMin = 200;
let boardRotation = 0;
// Board global variables.
let boardHeight = null;
let boardWidth = null;

// Hole size/position minimum constants.
const holeHeightMin = 50;
const holeWidthMin = 50;
const holeLeftPositionMin = 10;
const holeTopPositionMin = 10;
// Hole global variables.
let holeHeight = null;
let holeWidth = null;

// Win condition global variables.
let lives = 2;
let score = 0;

// Timer global variables.
let time = 5.0;
let timer = null;

// ________________________________On DOM Load__________________________________
$(() => {

  // ______________________________DOM Elements_________________________________
  const $window = $(window);
  const $main = $('.game');
  const $lives = $('.lives');
  const $time = $('.time');
  const $score = $('.score');
  let $board = null;
  let $shape = null;
  let $hole = null;

  // _______________________________FUNCTIONS___________________________________
  // Game set up functions.
  function newBoard() {
    // Board size/position generation.
    const boardTopPosition = Math.floor(Math.random() * (boardTopPositionMax - boardTopPositionMin) + boardTopPositionMin);
    const boardLeftPosition = Math.floor(Math.random() * (boardLeftPositonMax - boardLeftPositonMin) + boardLeftPositonMin);
    boardHeight = Math.floor(Math.random() * (boardHeightMax - boardHeightMin) + boardHeightMin);
    boardWidth = Math.floor(Math.random() * (boardHeightMax - boardHeightMin) + boardHeightMin);
    // Board DOM element creation.
    const board = $('<div></div>').height(boardHeight).width(boardWidth).css({ top: boardTopPosition, left: boardLeftPosition }).addClass('board');
    $main.append(board);

    $board = $('.board');
  }

  function newHole() {
    // Hole size/position maximum variables.
    const holeHeightMax = boardHeight/2;
    const holeWidthMax = boardWidth/2;
    const holeLeftPositionMax = boardWidth/2;
    const holeTopPositionMax = boardHeight/2;
    // Hole size/position generation.
    const holeTopPosition = Math.floor(Math.random() * (holeTopPositionMax - holeTopPositionMin) + holeTopPositionMin);
    const holeLeftPosition = Math.floor(Math.random() * (holeLeftPositionMax - holeLeftPositionMin) + holeLeftPositionMin);
    holeHeight = Math.floor(Math.random() * (holeHeightMax - holeHeightMin) + holeHeightMin);
    holeWidth = Math.floor(Math.random() * (holeWidthMax - holeWidthMin) + holeWidthMin);
    // Hole DOM element creation.
    const hole = $('<div></div>').height(holeHeight).width(holeWidth).css({ top: holeTopPosition, left: holeLeftPosition }).addClass('hole');
    $board.append(hole);

    $hole = $('.hole');
  }

  function newShape() {
    // Shape DOM element creation.
    const shape = $('<div></div>').height(holeHeight).width(holeWidth).addClass('shape');
    $main.append(shape);

    $shape = $('.shape');
  }

  // Shape movement functions.
  function mousePositionUpdate(e) {
    $shape.css({ left: Math.floor(e.clientX - (holeWidth / 2)), top: Math.floor(e.clientY - (holeHeight / 2)) });
  }

  function rotateShape(e) {
    const shapeRotation = $window.scrollTop() / 1000 % Math.PI;
    $shape.css({ transform: 'rotate(' + shapeRotation + 'rad)' });
  }

  function rotateBoard() {
    boardRotation += 0.01;
    $board.css({ transform: 'rotate(' + boardRotation + 'rad)' });
  }

  // Game space functions.
  function newGameSpace() {
    newBoard();
    newHole();
    newShape();
  }

  function clearGameSpace() {
    $hole.remove();
    $board.remove();
    $shape.remove();
  }

  // GUI functions.
  function scoreAnimation(color) {
    $score.animate({
      color: color,
      fontSize: '32'
    }, 'fast');
    $score.animate({
      color: color,
      fontSize: '30'
    }, 'slow');
  }

  function checkWin () {
    const holeLocation = $hole.offset();
    const shapeLocation = $shape.offset();
    if ((shapeLocation.left <= holeLocation.left + 10) && (shapeLocation.left >= holeLocation.left - 10) && (shapeLocation.top <= holeLocation.top + 10) && (shapeLocation.top >= holeLocation.top - 10)) {
      score++;
      $score.text(score);
      scoreAnimation('green');
      clearGameSpace();
      newGameSpace();
      startTimer();
    } else if (lives > 0) {
      lives--;
      $lives.text(lives);
      scoreAnimation('red');
      clearGameSpace();
      newGameSpace();
      startTimer();
    } else {
      alert('Game Over');
    }
  }

  function timeDown() {
    if (time >= 0) {
      $time.text(time);
      time = (time - 0.1).toFixed(1);
    } else {
      clearInterval(timer);
      checkWin();
    }
  }

  function startTimer() {
    time = 5.0;
    timer = setInterval(timeDown, 100);
  }

  // Start game.
  newGameSpace();
  startTimer();
  // setInterval(rotateBoard, 25);

  // _____________________________Event Listeners_______________________________
  $window.on('mousemove', mousePositionUpdate);
  $window.scroll(rotateShape);

});

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
let boardRotationSpeed = 0;

// Hole size/position minimum constants.
const holeHeightMin = 50;
const holeWidthMin = 50;
const holeLeftPositionMin = 10;
const holeTopPositionMin = 10;
// Hole global variables.
let holeHeight = null;
let holeWidth = null;
let holeRotation = 0;

// Shape global variables.
let shapeRotation = 0;
const differential = 20;
let heightDifferential = null;
let widthDifferential = null;

// Win condition global variables.
let lives = 2;
let score = 0;

// Timer global variables.
let time = null;
let timer = null;

// Other game global variables.
let xPosition = null;
let yPosition = null;
let gameActive = false;
let gamePaused = false;
let highScore = 0;

// ________________________________On DOM Load__________________________________
$(() => {

  // ______________________________DOM Elements_________________________________
  const $window = $(window);
  const $document = $(document);
  const $main = $('.game');
  const $lives = $('.lives');
  const $time = $('.time');
  const $score = $('.score');
  const $startScreen = $('.startScreen');
  const $endScreen = $('.endScreen');
  const $start = $('.start');
  const $reveal = $('.reveal');
  const $reset = $('.reset');
  const $highScore = $('.highScore');
  const blip = document.getElementById('blip');
  const thud = document.getElementById('thud');
  const endSound = document.getElementById('gameEnd');
  let $board = null;
  let $shape = null;
  let $hole = null;

  // _______________________________FUNCTIONS___________________________________

  function rangePointSelector(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function matrixToDegrees(gameItem) {
    let rotation = gameItem
      .css('transform')
      .replace('matrix(','')
      .replace(')','')
      .split(',');
    rotation = parseFloat(rotation[1]);
    return Math.round(Math.asin(rotation) * (180 / Math.PI));
  }

  // Game set up functions.
  function newBoard() {
    // Board size/position generation.
    const boardTopPosition = rangePointSelector(boardTopPositionMax, boardTopPositionMin);
    const boardLeftPosition = rangePointSelector(boardLeftPositonMax, boardLeftPositonMin);
    boardHeight = rangePointSelector(boardHeightMax, boardHeightMin);
    boardWidth = rangePointSelector(boardHeightMax, boardHeightMin);
    boardRotation = rangePointSelector(-90, 90);
    // Board DOM element creation.
    const board = $('<div></div>')
      .height(boardHeight)
      .width(boardWidth)
      .css({ top: boardTopPosition, left: boardLeftPosition, transform: 'rotate(' + boardRotation + 'deg)' })
      .addClass('board');
    $main.append(board.hide().fadeIn(1000));

    $board = $('.board');
  }

  function newHole() {
    // Hole size/position maximum variables.
    const holeHeightMax = boardHeight/2;
    const holeWidthMax = boardWidth/2;
    const holeLeftPositionMax = boardWidth/2;
    const holeTopPositionMax = boardHeight/2;
    // Hole size/position generation.
    const holeTopPosition = rangePointSelector(holeTopPositionMax, holeTopPositionMin);
    const holeLeftPosition = rangePointSelector(holeLeftPositionMax, holeLeftPositionMin);
    holeHeight = rangePointSelector(holeHeightMax, holeHeightMin);
    holeWidth = rangePointSelector(holeWidthMax, holeWidthMin);
    holeRotation = rangePointSelector(0, 0);
    // Hole DOM element creation.
    const hole = $('<div/>')
      .height(holeHeight)
      .width(holeWidth)
      .css({ top: holeTopPosition, left: holeLeftPosition, transform: 'rotate(' + holeRotation + 'deg)' })
      .addClass('hole');
    $board.append(hole);

    $hole = $('.hole');

    // console.log( 'Hole rotation/transform at ' + Math.abs(matrixToDegrees($board) +   matrixToDegrees($hole)) + ', composed of BOARD: ' + matrixToDegrees($board) + ' and HOLE: ' + matrixToDegrees($hole));
  }

  function newShape() {
    // Shape DOM element creation.
    heightDifferential = (holeHeight / 100) * differential;
    widthDifferential = (holeWidth / 100) * differential;
    const shape = $('<div/>', { class: 'shape' })
      .height(holeHeight - heightDifferential)
      .width(holeWidth - widthDifferential);

    if (xPosition && yPosition) {
      shape.css({ left: Math.floor(xPosition - (holeWidth / 2)), top: Math.floor(yPosition - (holeHeight / 2)) });
    }
    $main.append(shape.hide().fadeIn(1000));

    $shape = $('.shape');

    // const testerDiv = $('<div></div>')
    //   .height(heightDifferential)
    //   .width(widthDifferential)
    //   .addClass('testerDiv');
    // $hole.append(testerDiv);
  }

  // Shape movement functions.
  function mousePositionUpdate(e) {
    xPosition = e.clientX;
    yPosition = e.clientY;
    if (gameActive) {
      $shape.css({ left: Math.floor(xPosition - (holeWidth / 2)), top: Math.floor(yPosition - (holeHeight / 2)) });
    } else {
      // console.log(e.clientX, e.clientY);
    }
  }

  function rotateShape(e) {
    e.preventDefault();
    const shapeRotation = $window.scrollTop() / 1000 % Math.PI;
    $shape.css({ transform: 'rotate(' + shapeRotation + 'rad)' });
    if (document.documentElement.clientHeight + $window.scrollTop() >= $document.height()) {
      $document.scrollTop(0)
    } else if ($window.scrollTop() < 1) {
      $document.scrollTop($document.height())
    }
    // console.log('Shape rotation/transform at ' + matrixToDegrees($shape));

    // if(
    //   matrixToDegrees($shape) <= Math.abs(matrixToDegrees($board)) + 2 &&
    //   matrixToDegrees($shape) >= Math.abs(matrixToDegrees($board)) - 2
    // ) console.log('nailed it!');
  }

  function rotateBoard() {
    if (!gamePaused && gameActive) {
      boardRotation += boardRotationSpeed;
      $board.css({ transform: 'rotate(' + boardRotation + 'deg)' });
      // console.log( 'Hole rotation/transform at ' + Math.abs(matrixToDegrees($board) +   matrixToDegrees($hole)) + ', composed of BOARD: ' + matrixToDegrees($board) + ' and HOLE: ' + matrixToDegrees($hole));
    }
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

  function runFadeOuts() {
    $board.fadeOut(1000);
    $shape.fadeOut(1000);
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

  // Game logic functions.
  function gameOver () {
    gameActive = !gameActive;
    if (score > highScore) {
      highScore = score;
    }
    $highScore.text(highScore);
    endSound.play();
    $endScreen.toggleClass('hidden');
    $main.toggleClass('mouseHider');
  }

  function nextLevel() {
    clearGameSpace();
    newGameSpace();
    startTimer();
  }

  function checkWin () {
    const holeLocation = $hole.offset();
    const shapeLocation = $shape.offset();
    const holeSides = [holeHeight, holeWidth].sort((a, b) => {
      return a - b;
    });
    const rotationDifferential = Math.round(15 / (holeSides[1] / holeSides[0]));
    holeRotation = Math.abs(matrixToDegrees($board) + matrixToDegrees($hole));
    shapeRotation = matrixToDegrees($shape);

    console.log(`Win condition as follows:
      LEFT Window: ${holeLocation.left.toFixed(0)} - ${ (holeLocation.left + widthDifferential + (widthDifferential / 7)).toFixed(0) }
      TOP Window: ${holeLocation.top.toFixed(0)} - ${ (holeLocation.top + heightDifferential + (heightDifferential / 7)).toFixed(0) }
      ROTATION Window: ${Math.abs(holeRotation - rotationDifferential)} - ${Math.abs(holeRotation + rotationDifferential)}

      Shape position as follows:
      LEFT: ${shapeLocation.left.toFixed(0)}
      TOP: ${shapeLocation.top.toFixed(0)}
      ROTATION: ${shapeRotation}

      LEFT: ${(shapeLocation.left <= holeLocation.left + widthDifferential) &&
      (shapeLocation.left >= holeLocation.left)}
      TOP: ${(shapeLocation.top <= holeLocation.top + heightDifferential) &&
      (shapeLocation.top >= holeLocation.top)}
      ROTATION: ${(shapeRotation <= holeRotation + rotationDifferential) &&
      (shapeRotation >= holeRotation - rotationDifferential)}

      holeRotation = ${holeRotation}, rotationDifferential = ${rotationDifferential}`);

    if (
      (shapeLocation.left <= holeLocation.left + widthDifferential + (widthDifferential / 7)) &&
      (shapeLocation.left >= holeLocation.left) &&
      (shapeLocation.top <= holeLocation.top + heightDifferential + (heightDifferential / 7)) &&
      (shapeLocation.top >= holeLocation.top) &&
      (shapeRotation <= holeRotation + rotationDifferential) &&
      (shapeRotation >= holeRotation - rotationDifferential)) {
      score++;
      console.log('Points Scored');
      $score.text(score);
      blip.play();
      scoreAnimation('green');
      if (score === 1) {
        boardRotationSpeed = boardRotationSpeed + 0.15;
      }
      if (score === 5) {
        boardRotationSpeed = boardRotationSpeed + 0.1;
      } else if (score % 5 === 0) {
        boardRotationSpeed = boardRotationSpeed + 0.25;
      }
      if (score % 10 === 0) {
        lives++;
        $lives.text(lives);
      }
      $board.animate({
        backgroundColor: '#DDFFDD'
      }, 'slow');
      $hole.animate({
        backgroundColor: '#DDFFDD'
      });
      $shape.animate({
        opacity: 0
      });
      setTimeout(runFadeOuts, 1000);
      setTimeout(nextLevel, 2500);
    } else if (lives > 0) {
      lives--;
      $lives.text(lives);
      thud.play();
      scoreAnimation('red');
      $shape.animate({
        backgroundColor: '#A14545'
      });
      $board.animate({
        backgroundColor: '#A14545'
      });
      setTimeout(nextLevel, 2000);
    } else {
      thud.play();
      $shape.animate({
        backgroundColor: '#A14545'
      });
      $board.animate({
        backgroundColor: '#A14545'
      });
      setTimeout(runFadeOuts, 1000);
      setTimeout(gameOver, 750);
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
    time = 5;
    timer = setInterval(timeDown, 100);
  }

  function reset() {
    score = 0;
    lives = 2;
    boardRotationSpeed = 0;
    $score.text(score);
    $lives.text(lives);
    $endScreen.toggleClass('hidden');
    $main.toggleClass('mouseHider');
    gameActive = true;
    clearInterval(timer);
    clearGameSpace();
    newGameSpace();
    startTimer();
  }

  function pause() {
    if (!gamePaused) {
      clearInterval(timer);
      gamePaused = true;
    } else {
      timer = setInterval(timeDown, 100);
      gamePaused = false;
    }
    // $endScreen.toggleClass('hidden');
    $main.toggleClass('mouseHider');
  }

  function revealInstructions() {
    if ($reveal.text() === '') {
      $reveal.text('Show Me');
    } else {
      $reveal.text('');
    }
    $reveal.toggleClass('reveal revealed', 1000);
  }

  // Start game.
  function start() {
    $startScreen.toggleClass('hidden');
    $main.toggleClass('mouseHider');
    startTimer();
    setInterval(rotateBoard, 50);
    gameActive = true;
  }

  newGameSpace();

  // _____________________________Event Listeners_______________________________
  $window.on('mousemove', mousePositionUpdate);
  $window.scroll(rotateShape);
  $start.on('click', start);
  $reset.on('click', reset);
  $reveal.on('click', revealInstructions);
  $time.on('click', pause);
});

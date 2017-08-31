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
let boardRotationSpeed = 0.1;

// Hole size/position minimum constants.
const holeHeightMin = 50;
const holeWidthMin = 50;
const holeLeftPositionMin = 10;
const holeTopPositionMin = 10;
// Hole global variables.
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
let topPosition = null;
let leftPosition = null;
let height = null;
let width = null;
let rotationAngle = null;

let xPosition = null;
let yPosition = null;
let gameActive = false;
let gamePaused = false;
let highScore = 0;

let holeLocation = null;
let shapeLocation = null;
let rotationDifferential = null;
let levelWon = null;

// ________________________________On DOM Load__________________________________
$(() => {

  // ______________________________DOM Elements_________________________________
  const $window = $(window);
  const $document = $(document);
  const $body = $('body');
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
  const music = document.getElementById('music');
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

  function dimensionMaker(heightMax, heightMin, widthMax, widthMin, topPositionMax, topPositionMin, leftPositionMax, leftPositionMin,  rotationMax, rotationMin) {
    height = rangePointSelector(heightMax, heightMin);
    width = rangePointSelector(widthMax, widthMin);
    topPosition = rangePointSelector(topPositionMax, topPositionMin);
    leftPosition = rangePointSelector(leftPositionMax, leftPositionMin);
    rotationAngle = rangePointSelector(rotationMax, rotationMin);
  }

  function appender(destination, itemClass, height, width, topPosition, leftPosition, rotationAngle) {
    const gameItem = $('<div/>', { class: itemClass })
      .height(height)
      .width(width)
      .css({ top: topPosition, left: leftPosition, transform: 'rotate(' + rotationAngle + 'deg)' });
    if (itemClass === 'hole') {
      destination.append(gameItem);
    } else {
      destination.append(gameItem.hide().fadeIn(1000));
    }
  }

  function differentialMaker(){
    heightDifferential = (height / 100) * differential;
    widthDifferential = (width / 100) * differential;
  }

  function rotationDifferentialMaker() {
    const holeSides = [height, width].sort((a, b) => {
      return a - b;
    });
    rotationDifferential = Math.round(15 / (holeSides[1] / holeSides[0]));
  }

  // Shape movement functions.
  function mousePositionUpdate(e) {
    xPosition = e.clientX - ((width - widthDifferential) / 2);
    yPosition = e.clientY - ((height - heightDifferential) / 2);
    if (gameActive) {
      $shape.css({ left: xPosition, top: yPosition });
    }
  }

  function rotateShape() {
    const shapeRotation = $window.scrollTop() / 1000 % Math.PI;
    $shape.css({ transform: 'rotate(' + shapeRotation + 'rad)' });
    if (document.documentElement.clientHeight + $window.scrollTop() >= $document.height()) {
      $document.scrollTop(0);
    } else if ($window.scrollTop() < 1) {
      $document.scrollTop($document.height());
    }

    // if(
    //   matrixToDegrees($shape) <= Math.abs(matrixToDegrees($board)) + 2 &&
    //   matrixToDegrees($shape) >= Math.abs(matrixToDegrees($board)) - 2
    // ) console.log('nailed it!');
  }

  function rotateBoard() {
    if (!gamePaused && gameActive) {
      boardRotation += boardRotationSpeed;
      $board.css({ transform: 'rotate(' + boardRotation + 'deg)' });
    }
  }

  // Game space functions.
  function newGameSpace() {
    dimensionMaker(boardHeightMax, boardHeightMin, boardHeightMax, boardHeightMin, boardTopPositionMax, boardTopPositionMin, boardLeftPositonMax, boardLeftPositonMin, 90, -90);
    appender($main, 'board', height, width, topPosition, leftPosition, rotationAngle);
    $board = $('.board');
    dimensionMaker(height/2, holeHeightMin, width/2, holeWidthMin, topPosition/2, holeTopPositionMin, leftPosition/2, holeLeftPositionMin, 0, 0);
    appender($board, 'hole', height, width, topPosition, leftPosition, rotationAngle);
    $hole = $('.hole');
    differentialMaker();
    appender($main, 'shape', height - heightDifferential, width - widthDifferential, yPosition, xPosition, shapeRotation);
    $shape = $('.shape');
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
      color: 'black',
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
    $body.toggleClass('noScroll');
  }

  function nextLevel() {
    clearGameSpace();
    newGameSpace();
    startTimer();
  }

  function winChecker() {
    if ((shapeLocation.left <= holeLocation.left + widthDifferential + (widthDifferential / 7)) &&
    (shapeLocation.left >= holeLocation.left) &&
    (shapeLocation.top <= holeLocation.top + heightDifferential + (heightDifferential / 7)) &&
    (shapeLocation.top >= holeLocation.top) &&
    (shapeRotation <= holeRotation + rotationDifferential) &&
    (shapeRotation >= holeRotation - rotationDifferential)) {
      return true;
    } else {
      return false;
    }
  }

  function levelManager() {
    if (score === 1) {
      boardRotationSpeed = boardRotationSpeed + 0.15;
    } else if (score % 5 === 0) {
      boardRotationSpeed = boardRotationSpeed + 0.25;
    }
    if (score % 10 === 0) {
      lives++;
      $lives.text(lives);
    }
  }

  function gameAnimator(color) {
    $board.animate({
      backgroundColor: color
    }, 'slow');
    if (levelWon) {
      $hole.animate({
        backgroundColor: color
      });
      $shape.animate({
        opacity: 0
      });
    } else {
      $shape.animate({
        backgroundColor: color
      });
    }
    setTimeout(runFadeOuts, 1000);
  }

  function win() {
    score++;
    $score.text(score);
    blip.play();
    scoreAnimation('green');
    gameAnimator('#DDFFDD');
    levelManager();
    setTimeout(nextLevel, 2500);
  }

  function lose() {
    lives--;
    $lives.text(lives);
    thud.play();
    scoreAnimation('red');
    gameAnimator('#A14545');
    setTimeout(nextLevel, 2000);
  }

  function endLevel () {
    holeLocation = $hole.offset();
    shapeLocation = $shape.offset();
    rotationDifferentialMaker();
    holeRotation = Math.abs(matrixToDegrees($board));
    shapeRotation = matrixToDegrees($shape);
    winReporter();
    levelWon = winChecker();
    if (levelWon) {
      win();
    } else if (lives > 0) {
      lose();
    } else {
      thud.play();
      scoreAnimation('red');
      gameAnimator('#A14545');
      setTimeout(gameOver, 750);
    }
  }

  function timeDown() {
    if (time >= 0) {
      $time.text(time);
      time = (time - 0.1).toFixed(1);
    } else {
      clearInterval(timer);
      endLevel();
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
    $body.toggleClass('noScroll');
    gameActive = true;
    clearInterval(timer);
    clearGameSpace();
    newGameSpace();
    startTimer();
  }

  function pause() {
    if (!gamePaused) {
      clearInterval(timer);
      music.pause();
      gamePaused = true;
      gameActive = false;
    } else {
      timer = setInterval(timeDown, 100);
      gamePaused = false;
      gameActive = true;
      music.play();
    }
    $main.toggleClass('mouseHider');
    $body.toggleClass('noScroll');
  }

  function revealInstructions() {
    if ($reveal.text() === '') {
      $reveal.text('Show Me');
    } else {
      $reveal.text('');
    }
    $reveal.toggleClass('reveal revealed', 1000);
  }

  function winReporter() {
    console.log(`Win condition as follows:
      LEFT Window: ${holeLocation.left.toFixed(0)} - ${ (holeLocation.left + widthDifferential + (widthDifferential / 7)).toFixed(0) }
      TOP Window: ${holeLocation.top.toFixed(0)} - ${ (holeLocation.top + heightDifferential + (heightDifferential / 7)).toFixed(0) }
      ROTATION Window: ${Math.abs(holeRotation - rotationDifferential)} - ${Math.abs(holeRotation + rotationDifferential)}

      Shape position as follows:
      LEFT: ${shapeLocation.left.toFixed(0)}
      TOP: ${shapeLocation.top.toFixed(0)}
      ROTATION: ${shapeRotation}

      LEFT: ${(shapeLocation.left <= holeLocation.left + widthDifferential + (widthDifferential / 7)) &&
      (shapeLocation.left >= holeLocation.left)}
      TOP: ${(shapeLocation.top <= holeLocation.top + heightDifferential + (heightDifferential / 7)) &&
      (shapeLocation.top >= holeLocation.top)}
      ROTATION: ${(shapeRotation <= holeRotation + rotationDifferential) &&
      (shapeRotation >= holeRotation - rotationDifferential)}

      WIN: ${levelWon}

      holeRotation = ${holeRotation}, rotationDifferential = ${rotationDifferential}`);
  }

  // Start game.
  function start() {
    $startScreen.toggleClass('hidden');
    $main.toggleClass('mouseHider');
    $body.toggleClass('noScroll');
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

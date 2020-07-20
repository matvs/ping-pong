let leftPlayer;
let rightPlayer;
let ball;
let hitWallSound;
let hitPaddleSound;
let isRunning = false;
let leftButton;
let rightButton;
let goingUp = false;
let goingDown = false;
const margin = 10;
const url = 'http://192.168.178.48';
const port = 8090;
const socket = io(url + ':' + port);

window.addEventListener('load', function() {
  leftButton = document.getElementById('leftPlayer');
  rightButton = document.getElementById('rightPlayer');
});

function joinGame(player, button) {
  socket.emit('newplayer', { player });
  // if (button.classList.contains('left')) {
  //   // leftButton = button;
  // } else {
  //   // rightButton = button;
  //   button.style.left = '600px'
  // }

}

function startLeftButton() {
  leftButton.innerText = "Seat taken"
  leftButton.style.width = '150px'
  leftButton.style.background = '#f37736'
  leftButton.setAttribute('disabled', '');
}

function startRightButton() {
  rightButton.innerText = "Seat taken"
  rightButton.style.width = '150px'
  rightButton.style.left = '600px'
  rightButton.style.background ='#0392cf'
  rightButton.setAttribute('disabled', '');
}

socket.on('players', (data) => {
  console.log(data)
  if (data.left) {
    startLeftButton();
  }
  if (data.right) {
    startRightButton();
  }
});

socket.on('startGame', (data) => {
  isRunning = true;
  leftPlayer = new Paddle(data.left);
  rightPlayer = new Paddle(data.right);
  ball = new Ball(data.ball);
  startLeftButton();
  startRightButton();
});


socket.on('customError', (data) => {
  alert(data.msg)
});

socket.on('update', (data) => {
  // console.log(data);
  leftPlayer.update(data.left);
  rightPlayer.update(data.right);
  ball.update(data.ball)
  if (data.didHitPaddle) {
    hitPaddleSound.play();
  } else if (data.didHitWall) {
    hitWallSound.play();
  }
});

socket.on('remove', (data) => {
  isRunning = false;
  if (data === 'left') {
    // leftPlayer = null;
    leftButton.innerText = "Join";
    leftButton.style.width = '100px';
    leftButton.style.background = '#7bc043'
    leftButton.removeAttribute('disabled');
  } else if (data === 'right') {
    // rightPlayer = null;
    rightButton.innerText = "Join";
    rightButton.style.width = '100px'
    rightButton.style.left = '600px'
    rightButton.style.background = '#7bc043'
    rightButton.removeAttribute('disabled');
  }
});

function preload() {
  soundFormats('ogg');
  hitWallSound = loadSound('./wall.ogg');
  hitPaddleSound = loadSound('./paddle.ogg');
}

function setup() {
  createCanvas(750, 400);
}

const KEY_W = 87;
const KEY_S = 83;
const SPACEBAR = 32;
function draw() {
  background(51, 51, 51);

  if (isRunning) {
    if (keyIsDown(UP_ARROW) || keyIsDown(KEY_W) || goingUp) {
      socket.emit('goUp');
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_S) || goingDown) {
      socket.emit('goDown');
    }
    leftPlayer.draw();
    rightPlayer.draw();
    ball.draw();
  }


  stroke('#ffffff');
  line(width / 2, 0, width / 2, height)
}

class Paddle {
  width = 10;
  height = 80;

  constructor(json) {
    this.update(json)
  }

  update(json) {
    this.x = json.x;
    this.y = json.y;
    this.points = json.points;
  }

  draw() {
    fill('#ffffff');
    textSize(38)
    text(this.points, this.x < width / 2 ? width / 2 - this.width * 6 : width / 2 + this.width * 4, 30)
    stroke('#ffffff');
    rect(this.x, this.y, this.width, this.height);
  }
}




class Ball {
  r = 14;
  constructor(json) {
    this.update(json)
  }

  update(json) {
    this.x = json.x;
    this.y = json.y;
  }

  draw() {
    stroke('#ffffff');
    fill('#ffffff');
    circle(this.x, this.y, this.r);
  }
}

function movePaddle(up) {
  if (up) {
    goingUp = true;
  } else {
    goingDown = true
  }
  
}

function stopMovingPaddle(up) {
  if (up) {
    goingUp = false;
  } else {
    goingDown = false
  }
  
}
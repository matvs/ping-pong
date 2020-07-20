let playerA;
let playerB;
let ball;
const AI = false;
const margin = 10;
function setup() {
  createCanvas(750, 400);
  //  createCanvas(1800, 1800, WEBGL);
  playerA = new Paddle(margin)
  playerB = new Paddle(width - margin*2)

  ball = new Ball(playerA.x + playerA.width + 10, playerA.y + playerA.height / 2)


}
let isRunning = false;
const KEY_W = 87;
const KEY_S = 83;
const SPACEBAR = 32;
function draw() {
  background(51, 51, 51);

  if (isRunning && AI) {
    playerA.follow(ball);
  } 

  if (keyIsDown(UP_ARROW)) {
    playerB.goUp();
  }

  if (keyIsDown(DOWN_ARROW)) {
    playerB.goDown();
  }

  if (keyIsDown(KEY_W)) {
    playerA.goUp();
  }

  if (keyIsDown(KEY_S)) {
    playerA.goDown();
  }

  if (keyIsDown(SPACEBAR)) {
    isRunning = !isRunning;
  }

  playerA.draw();
  playerB.draw();

  ball.draw();

  if(isRunning) {
    ball.update();
  }
  stroke('#ffffff');
  line(width / 2, 0, width / 2, height)
}


// const SPACEBAR = 32;
// function keyPressed() {
//   if(keyCode === UP_ARROW) {
//     playerB.goUp();
//   } else if(keyCode === DOWN_ARROW) {
//     playerB.goDown();
//   }

// }

class Paddle {
  width = 10;
  height = 80;

  constructor(x) {
    this.x = x;
    this.y = height/2 - this.height / 2;
    this.points = 0;
  }

  draw() {
    // noStroke();
    fill('#ffffff');
    textSize(38)
    // text(this.points, this.x < width/2 ? width/2 - this.width*3 : width/2 + this.width, 30)
    text(this.points, this.x < width/2 ? width/2 - this.width*6 : width/2 + this.width*4, 30)
    stroke('#ffffff');
    rect(this.x, this.y, this.width, this.height);
  }

  goUp() {
    isRunning = true;
    this.y -= 5;
    if (this.y < 0) {
      this.y = 0;
    }
  }

  goDown() {
    isRunning = true;
    this.y += 5;
    if(this.y + this.height > height) {
        this.y = height - this.height;
    }
  }

  follow(ball) {
    if (ball.y + ball.r < this.y) {
      this.y -= 8;
    } else if (ball.y - ball.r > this.y + this.height) {
      this.y += 8;
    }
  }
}




class Ball {
  r = 14;
  angle = Math.PI/4;
  v = 7;
  constructor(x, y) {
    this.x = x + this.r/2;
    this.y = y;

    
  }

  draw() {
    stroke('#ffffff');
    fill('#ffffff');
    circle(this.x, this.y, this.r);
  }

  update() {
      this.y += this.v * Math.sin(this.angle);
      this.x += this.v * Math.cos(this.angle);
      
      if (this.collision(playerA) || this.collision(playerB, false) || this.didHitTheWall()) {
        if (this.x <= 0) {
          playerB.points ++;
          isRunning = false;
          this.x = playerA.x + playerA.width + this.r/2 + 10;
          // this.x = width/2;
          this.y = playerA.y + playerA.height / 2;
        } else if(this.x >= width) {
          playerA.points ++;
          isRunning = false;
          this.x = playerB.x - this.r/2 - 10;
          // this.x = width/2;
          this.y = playerB.y + playerB.height / 2;
        }
        if(this.collision(playerA)) {
          const ratio = ((playerA.y + playerA.height/2) - this.y) / (playerA.height/2)
          console.log(ratio)
          this.angle = -ratio*(Math.PI/4) ;

        } else if ( this.collision(playerB, false) ) {
          const ratio = ((playerB.y + playerB.height/2) - this.y) / (playerB.height/2)
          console.log(ratio)
          this.angle = ratio*(Math.PI/4) + Math.PI;
        } else {
          // this.angle += Math.PI/2;
          this.angle = 2*Math.PI - this.angle;
        }
       
        
   
        this.angle = this.angle >= 2*Math.PI ? this.angle -  2*Math.PI  : this.angle;
      }
  }

  didHitTheWall() {
    return this.x <= 0 || this.x >= width || this.y <= 0 || this.y >= height; 
  }


  collision(player, isPlayerA = true) {
    // return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) <= this.r*this.r;
    if(isPlayerA) {
      return ((this.y + this.r) > player.y && (this.y - this.r) < player.y + player.height) && (this.x - this.r <= player.x + player.width);
    } else {
      return ((this.y + this.r) > player.y && (this.y - this.r) < player.y + player.height) && (this.x + this.r >= player.x);
    }
  }
}
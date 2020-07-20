

window.addEventListener('load', function(event) {

  const PingPongGame = (function() {

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
    ctx.fillStyle = '#ffffff';
    ctx.font = '38px sans-serif';
    // text(this.points, this.x < width/2 ? width/2 - this.width*3 : width/2 + this.width, 30)
    ctx.fillText(this.points, this.x < width/2 ? width/2 - this.width*6 : width/2 + this.width*4, 30)
    ctx.strokeStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
  r = 7;
  angle = Math.PI/4;
  v = 7;
  constructor(x, y) {
    this.x = x + this.r/2;
    this.y = y;


  }

  draw() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
      this.y += this.v * Math.sin(this.angle);
      this.x += this.v * Math.cos(this.angle);

      if (this.collision(leftPlayer) || this.collision(rightPlayer, false) || this.didHitTheWall()) {
        if (this.x <= 0) {
          rightPlayer.points ++;
          isRunning = false;
          this.x = leftPlayer.x + leftPlayer.width + this.r/2 + 10;
          // this.x = width/2;
          this.y = leftPlayer.y + leftPlayer.height / 2;
        } else if(this.x >= width) {
          leftPlayer.points ++;
          isRunning = false;
          this.x = rightPlayer.x - this.r/2 - 10;
          // this.x = width/2;
          this.y = rightPlayer.y + rightPlayer.height / 2;
        }
        if(this.collision(leftPlayer)) {
          const ratio = ((leftPlayer.y + leftPlayer.height/2) - this.y) / (leftPlayer.height/2)
          console.log(ratio)
          this.angle = -ratio*(Math.PI/4) ;

        } else if ( this.collision(rightPlayer, false) ) {
          const ratio = ((rightPlayer.y + rightPlayer.height/2) - this.y) / (rightPlayer.height/2)
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


  collision(player, isleftPlayer = true) {
    // return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) <= this.r*this.r;
    if(isleftPlayer) {
      return ((this.y + this.r) > player.y && (this.y - this.r) < player.y + player.height) && (this.x - this.r <= player.x + player.width);
    } else {
      return ((this.y + this.r) > player.y && (this.y - this.r) < player.y + player.height) && (this.x + this.r >= player.x);
    }
  }
}

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 10;

    let isRunning = false;
    const KEY_W = 87;
    const KEY_S = 83;
    const SPACEBAR = 32;
    const UP_ARROW = 38;
    const DOWN_ARROW = 40;

    let leftPlayer  = new Paddle(margin);
    let rightPlayer = new Paddle(width - margin*2);
    let ball = new Ball(leftPlayer.x + leftPlayer.width + 10, leftPlayer.y + leftPlayer.height / 2);
    const AI = false;
    let currentKey;
  // TODO: should be an array
    window.addEventListener("keydown", event => {
      currentKey = event.keyCode
    });

    window.addEventListener("keyup", event => {
      currentKey = event.keyCode
    });

    const keyIsDown = key => key === currentKey;

    function draw() {
      ctx.clearRect(0,0, width, height);
      ctx.fillStyle = 'rgb(51, 51, 51)';
      ctx.fillRect(0,0, width, height);

      if (isRunning && AI) {
        leftPlayer.follow(ball);
      }

      if (keyIsDown(UP_ARROW)) {
        rightPlayer.goUp();
      }

      if (keyIsDown(DOWN_ARROW)) {
        rightPlayer.goDown();
      }

      if (keyIsDown(KEY_W)) {
        leftPlayer.goUp();
      }

      if (keyIsDown(KEY_S)) {
        leftPlayer.goDown();
      }

      if (keyIsDown(SPACEBAR)) {
        isRunning = !isRunning;
      }

      leftPlayer.draw();
      rightPlayer.draw();

      ball.draw();

      if(isRunning) {
        ball.update();
      }
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    return {
      msg: "I protect this game from cheaters"
    }
  })()
});

class TestKlass {
  width = 10;
  height = 80;

  constructor(x) {
   
  }
}
  
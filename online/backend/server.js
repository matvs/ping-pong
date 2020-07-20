var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


server.listen(8090, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = {
    left: null,
    right: null
}
server.game = {
    started: false,

};

const margin = 10;
const width = 750;
const height = 400;

io.on('connection', function (socket) {
    console.log('connected')
    socket.emit('players', {
        left: server.players.left != null,
        right: server.players.right != null
    })
    socket.on('newplayer', function (data) {
        console.log(data);
        if (socket.type != null) {
            socket.emit('customError', {
                msg: 'You have already joined'
            })
            return;
        }
        if (data.player === 'left') {
            if (server.players.left == null) {
                server.players.left = new Paddle(margin);
                socket.type = data.player;
            }
        } else if (data.player === 'right' && server.players.right == null) {
            server.players.right = new Paddle(width - margin * 2);
            socket.type = data.player;
        }

        socket.on('goUp', function () {
            if (server.players[socket.type]) {
                server.players[socket.type].goUp();
            }
        })

        io.emit('players', {
            left: server.players.left != null,
            right: server.players.right != null
        })

        socket.on('goDown', function () {
            if (server.players[socket.type]) {
                server.players[socket.type].goDown();
            }
        })

        socket.on('disconnect', function () {
            console.log('Disonnected')
            if (socket.type) {
                server.game.started = false;
                // clearInterval(server.game.loop);
                clearTimeout(server.game.loop);
                server.players[socket.type] = null;
                io.emit('remove', socket.type);
            }

        });

        if (server.players.left != null && server.players.right != null) {
            server.game.started = true;
            server.game.ball = new Ball(width/2, height/2)
            io.emit('startGame', {
                left: server.players.left.toJSON(),
                right: server.players.right.toJSON(),
                ball: server.game.ball.toJSON()
            });
            // server.game.loop = setInterval(gameLoop, 10);
            server.game.loop = setTimeout(gameLoop);
        }
    });


});


function Paddle(x) {
    this.width = 10;
    this.height = 80;
    this.x = x;
    this.y = height / 2 - this.height / 2;
    this.points = 0;
    this.dy = 5;
}

Paddle.prototype.toJSON = function () {
    return {
        x: this.x,
        y: this.y,
        points: this.points,
    }
}

Paddle.prototype.goUp = function () {
    this.y -= this.dy;
    if (this.y < 0) {
        this.y = 0;
    }
}

Paddle.prototype.goDown = function () {
    this.y += this.dy;
    if (this.y + this.height > height) {
        this.y = height - this.height;
    }
}

function Ball(x, y) {
    this.r = 14;
    this.angle = 0
    // this.v = 7;
    this.v = 1;
    this.x = x + this.r / 2;
    this.y = y;
}

Ball.prototype.toJSON = function() {
    return {
        x: this.x,
        y: this.y
    }
}

Ball.prototype.update = function (playerA, playerB) {
    this.y += this.v * Math.sin(this.angle);
    this.x += this.v * Math.cos(this.angle);
    let didHitPaddle = false;
    let didHitWall = false;

    if (this.collision(playerA) || this.collision(playerB, false) || this.didHitTheWall()) {
        if ((this.x - this.r) <= 0) {
            playerB.points++;
            this.x = playerA.x + playerA.width + this.r / 2 + 10;
            this.y = playerA.y + playerA.height / 2;
            // this.x = width/2;
            // this.y = height/2;
            this.angle = 0;

            io.emit('update', {
                left: server.players.left.toJSON(),
                right: server.players.right.toJSON(),
                ball: server.game.ball.toJSON(),
                didHitPaddle,
                didHitWall
            });

            return;
        } else if ((this.x + this.r) >= width) {
            playerA.points++;
            this.x = playerB.x - this.r / 2 - 10;
            this.y = playerB.y + playerB.height / 2;
            // this.x = width/2;
            // this.y = height/2;
            this.angle = 2*Math.PI;

            io.emit('update', {
                left: server.players.left.toJSON(),
                right: server.players.right.toJSON(),
                ball: server.game.ball.toJSON(),
                didHitPaddle,
                didHitWall
            });

            return;
        }
        if (this.collision(playerA)) {
            didHitPaddle = true;
            const ratio = ((playerA.y + playerA.height / 2) - this.y) / (playerA.height / 2)
            this.angle = -ratio * (Math.PI / 4);

        } else if (this.collision(playerB, false)) {
            didHitPaddle = true;
            const ratio = ((playerB.y + playerB.height / 2) - this.y) / (playerB.height / 2)
            this.angle = ratio * (Math.PI / 4) + Math.PI;
        } else {
            didHitWall = true;
            this.angle = 2 * Math.PI - this.angle;
        }



        this.angle = this.angle = 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
    }

    io.emit('update', {
        left: server.players.left.toJSON(),
        right: server.players.right.toJSON(),
        ball: server.game.ball.toJSON(),
        didHitPaddle,
        didHitWall
    });
}

Ball.prototype.didHitTheWall = function () {
    const offset = 15;
    return (this.x - this.r) <= -offset || (this.x + this.r) >= width + offset || (this.y - this.r) <= -offset|| (this.y + this.r) >= height + offset;
}


Ball.prototype.collision = function (player, isPlayerA = true) {
    // return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) <= this.r*this.r;
      const offset = 15;
    if (isPlayerA) {
        return ((this.y + this.r) > player.y && (this.y - this.r) < player.y + player.height) && (this.x - this.r <= player.x + player.width - offset);
    } else {
        return ((this.y + this.r) > player.y && (this.y - this.r) < player.y + player.height) && (this.x + this.r >= player.x + offset);
    }
}


function gameLoop() {
    if(server.game.ball && server.players.left && server.players.right) {
        server.game.ball.update( server.players.left,server.players.right);
        server.game.loop = setTimeout(gameLoop);
    }
}
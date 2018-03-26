let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const para = document.querySelector("p");
let count = 0;

function random(min, max) {
   let num = Math.floor(Math.random() * (max - min)) + min;
   return num;
}

// define Shape constructor
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;



// define ball draw method

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

// define ball update method
Ball.prototype.update = function() {
    if(((this.x + this.size) >= width) || ((this.x - this.size) <= 0)) {
        this.velX = -(this.velX);
    }
    if(((this.y + this.size) >= height) || ((this.y - this.size) <= 0)) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

// define ball colission
Ball.prototype.collisionDetect = function() {
    for (let j =0; j < balls.length; j++) {
        if(!(this === balls[j])) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy );

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
            }
        }
    }
}

// define EvilCircle
function evilCircle(x,y, exists) {
    Shape.call(this, x,y, exists);
    this.color = "white";
    this.size = 50;
    this.velX = 20;
    this.velY = 20;
}

evilCircle.prototype = Object.create(Shape.prototype);
evilCircle.prototype.constructor = evilCircle;

evilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI );
    ctx.stroke();
}
evilCircle.prototype.checkBounds = function() {
    if((this.x + this.size) >= width)  {
        this.x -= this.size;
    }
    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }
    if((this.y + this.size) >= height) {
        this.y -= this.size;
    }
    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }
};

evilCircle.prototype.setControls = function() {
    let _this = this;
    window.onkeydown = function(e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
}

evilCircle.prototype.collisionDetect = function() {
    for (let j =0; j < balls.length; j++) {
        if (balls[j].exists) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy );

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                para.textContent = "Ball count: " + count;
            }
        }
    }
}


// define array to store balls
let balls = [];

// defining new object for evilCircle and run setControl method

let evil = new evilCircle(random(0, width), random(0, height), true);
evil.setControls();

//  define loop that keeps drawing the scene constantly

function loop() {
    ctx.fillStyle = "rgb(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 25) {
        let ball =  new Ball (
        random(0, width),
        random(0, height),
        random(-7, 7),
        random(-7, 7),
        true,
        "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")",
        random(10, 20)
    );
    balls.push(ball);
    count++;
    para.textContent = "Ball count: " + count;
}
    for (let i=0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    requestAnimationFrame(loop);
}

loop();



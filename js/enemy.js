class Enemy {
    constructor(x, y, canvasWidth, canvasHeight, player, imgSrc, imgInvSrc) {
        //What will go in the base class?
        this.__sprite = new createjs.Bitmap(imgSrc);
        this.__sprite.x = x;
        this.__sprite.y = y;

        this.__player = player;

        this.__image = new Image();
        this.__image.src = imgSrc;
        this.__imageInverted = new Image();
        this.__imageInverted.src = imgInvSrc;

        this.__speed = 0;
        this.__speedX = 0;
        this.__speedY = 0;
        this.__angle = 0;

        this.__isHit = false;
        this.__isDead = false;

        this.__xBoundary = canvasWidth;
        this.__yBoundary = canvasHeight;
    }

    set displayObject (displayObject) { this.__displayObject = displayObject }
    get displayObject ()              { return this.__displayObject }
    get sprite        ()              { return this.__sprite }
    get health        ()              { return this.__health }
    get x             ()              { return this.__sprite.x }
    get y             ()              { return this.__sprite.y }
    get width         ()              { return this.__sprite.image.width * this.__sprite.scaleX }
    get height        ()              { return this.__sprite.image.height * this.__sprite.scaleY }
    get isDead        ()              { return this.__isDead }

    update() {
        if (this.__isHit) {
            this.__sprite.image = this.__imageInverted;
            this.__isHit = false;
        }
        else {
            this.__sprite.image = this.__image; 
        }
    }

    hit(damage) {
        //blink and decrement health
        this.__health -= damage;
        this.__isHit = true;
        if (this.__health <= 0) {
            this.destroy();
        }
    }

    shoot() {}

    destroy() {
        this.__isDead = true;
    }

    rotate(x, y) {
        this.__angle = Math.atan2(y- this.__sprite.y, x - this.__sprite.x);
        this.__angle = this.__angle * (180/Math.PI);

        if(this.__angle < 0) {
            this.__angle = 360 - (-this.__angle);
        }

        this.__sprite.rotation = 90 + this.__angle;
    }

    moveToward(x, y) {
        if (this.__speed <= this.__maxSpeed) {
            this.__speed += this.__accel;
        }

        let angleToTarget = calculateAngle(this.sprite.x, this.sprite.y, this.__player.sprite.x, this.__player.sprite.y);
        let xVel = this.__speed * Math.cos(this.__angle * Math.PI/180);
        let yVel = this.__speed * Math.sin(this.__angle * Math.PI/180);

        this.__sprite.x += xVel;
        this.__sprite.y += yVel;
    }

    enforceBoundaries() {}

}

class BasicEnemy extends Enemy {
    constructor(x, y, canvasWidth, canvasHeight, player) {
        var imgSrc = "resources/testicles.png";
        var imgInvSrc = "resources/testiclesInverted.png";

        super(x, y, canvasWidth, canvasHeight, player, imgSrc, imgInvSrc);

        this.__sprite.scaleX = .25;
        this.__sprite.scaleY = .25;
        this.__sprite.regX = 360;
        this.__sprite.regY = 360;
        
        this.__accel = 0.25;
        this.__friction = 0.96;
        this.__maxSpeed = 4;
        
        this.__health = 100;
        
    }

    update() {
        super.update();
        this.attack();
    }

    attack() {
        let targetX = this.__player.sprite.x;
        let targetY = this.__player.sprite.y;

        this.rotate(targetX, targetY); //face the target
        this.moveToward(targetX, targetY);
    }
}
class Enemy {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.__sprite = new createjs.Bitmap("resources/testicles.png");
        this.__sprite.x = x;
        this.__sprite.y = y;
        this.__sprite.scaleX = .25;
        this.__sprite.scaleY = .25;
        this.__sprite.regX = 360;
        this.__sprite.regY = 360;

        this.__image = new Image();
        this.__image.src = "resources/testicles.png";
        this.__imageInverted = new Image();
        this.__imageInverted.src = "resources/testiclesInverted.png";

        this.__speed = 0;
        this.__speedX = 0;
        this.__speedY = 0;
        this.__accel = 0.25;
        this.__angle = 0;
        this.__friction = 0.96;
        this.__maxSpeed = 5;

        this.__xBoundary = canvasWidth;
        this.__yBoundary = canvasHeight;

        this.__isHit = false;
        this.__health = 100;
        this.__isDead = false;
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
    rotate() {}
    enforceBoundaries() {}


}
class Projectile {
	constructor(x, y, angle, canvasWidth, canvasHeight) {
		this.__sprite = new createjs.Bitmap("resources/projectilesprite.png");

		this.__sprite.x = x;
		this.__sprite.y = y

		this.__sprite.scaleX = .2;
		this.__sprite.scaleY = .2;
		this.__sprite.regX = 86;
		this.__sprite.regY = 192;
		this.__angle = angle;
		this.__speed = 20;
		this.__accel = 1;
		this.__maxSpeed = 5;
		this.__speedX = Math.cos(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
		this.__speedY = Math.sin(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
		this.__sprite.rotation = 90 + this.__angle;

		this.__maxBoundReached = false;
		this.__shouldBeDestroyed = false;
        this.__xBoundary = canvasWidth;
        this.__yBoundary = canvasHeight;

        this.__damage = 20;

		this.__displayObject;

        this.__sound = new Audio("resources/Lazer_2b.wav");
        this.__sound.volume = .1;
	}
	
	set displayObject (displayObject) { this.__displayObject = displayObject }
	get displayObject ()			  { return this.__displayObject }
	get sprite        ()			  { return this.__sprite }
    get x             ()              { return this.__sprite.x }
    get y             ()              { return this.__sprite.y }
    get width         ()              { return this.__sprite.image.width * this.__sprite.scaleX }
    get height        ()              { return this.__sprite.image.height * this.__sprite.scaleY }
    get damage        ()              { return this.__damage };

	update(mouseX, mouseY) {
		this.__sprite.x += this.__speedX;
        this.__sprite.y += this.__speedY;

        this.enforceBoundaries();

        if (!this.__shouldBeDestroyed) {
            this.__shouldBeDestroyed = this.__maxBoundReached;  
        }
	}

	enforceBoundaries() {
        if (this.__sprite.x < 0) {
            this.__sprite.x = 0;
            this.__maxBoundReached = true;
        }
        if (this.__sprite.x > this.__xBoundary) {
            this.__sprite.x = this.__xBoundary;
            this.__maxBoundReached = true;
        }
        if (this.__sprite.y < 0) {
            this.__sprite.y = 0;
            this.__maxBoundReached = true;
        }
        if (this.__sprite.y > this.__yBoundary) {
            this.__sprite.y = this.__yBoundary;
            this.__maxBoundReached = true;
        }
    }

    shouldBeDestroyed() {
    	return this.__shouldBeDestroyed;
    }

    destroy() {
        this.__shouldBeDestroyed = true;
    }

    playSound() {
        this.__sound.play();
    }
}

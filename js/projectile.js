class Projectile {
	constructor(player) {
		this.__sprite = new createjs.Bitmap("resources/projectile.png");

		this.__player = player;

		this.__sprite.x = player.__sprite.x; //TODO: Make the projectile originate at the nose instead of the center of the player
		this.__sprite.y = player.__sprite.y;

		this.__sprite.scaleX = .1;
		this.__sprite.scaleY = .1;
		this.__sprite.regX = 86;
		this.__sprite.regY = 192;
		this.__angle = player.__angle;
		this.__speed = 10;
		this.__accel = 1;
		this.__maxSpeed = 5;
		this.__speedX = Math.cos(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
		this.__speedY = Math.sin(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
		this.__sprite.rotation = 90 + this.__angle;

		this.__maxBoundReached = false;
		this.__shouldBeDestroyed = false;

		this.__displayObject;
	}
	
	set displayObject (displayObject) { this.__displayObject = displayObject }
	get displayObject ()			  { return this.__displayObject }
	get sprite        ()			  { return this.__sprite }

	update(mouseX, mouseY) {
		this.__sprite.x += this.__speedX;
        this.__sprite.y += this.__speedY;

        this.enforceBoundaries();

		this.__shouldBeDestroyed = this.__maxBoundReached;
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
}

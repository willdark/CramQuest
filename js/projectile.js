function Projectile(player) {
	me = this;
	this.__sprite = new createjs.Bitmap("resources/projectile.png");

	this.__player = player;

	this.__sprite.x = player.__sprite.x; //TODO: Make the projectile originate at the nose instead of the center of the player
	this.__sprite.y = player.__sprite.y;

	this.__sprite.scaleX = .1;
	this.__sprite.scaleY = .1;
	this.__sprite.regX = 86;
	this.__sprite.regY = 192;
	this.__angle = player.__angle;
	this.__speedX = Math.cos(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
	this.__speedY = Math.sin(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
	this.__sprite.rotation = 90 + this.__angle;

	this.__maxBoundReached = false;
	this.__shouldBeDestroyed = false;

	this.__displayObject;
	this.set_displayObject = function(displayObject) { this.__displayObject = displayObject };
	this.get_displayObject = function() { return this.__displayObject };

	this.get_sprite = function() { return this.__sprite };
}

Projectile.prototype = {
	__speed: 10,
	__accel: 1,
	__maxSpeed: 5,
	__projectiles: null,
};

Projectile.prototype.rotate = function(mouseX, mouseY) {
	this.__angle = Math.atan2(mouseY - this.__sprite.y, mouseX - this.__sprite.x);
	this.__angle = this.__angle * (180/Math.PI);

	if(this.__angle < 0) {
		this.__angle = 360 - (-this.__angle);
	}

	this.__sprite.rotation = 90 + this.__angle;
};

Projectile.prototype.update = function(mouseX, mouseY) {
	this.setPosition(this.__sprite.x += this.__speedX);
	this.setPosition(this.__sprite.y += this.__speedY);

	this.__shouldBeDestroyed = this.__maxBoundReached;
};

Projectile.prototype.setPosition = function(x, y) {
	if (this.__sprite.x < 0) {
		this.__sprite.x = 0;
		this.__maxBoundReached = true;
	}
	if (this.__sprite.x > this.__player.get_canvasWidth()) {
		this.__sprite.x = this.__player.get_canvasWidth();
		this.__maxBoundReached = true;
	}
	if (this.__sprite.y < 0) {
		this.__sprite.y = 0;
		this.__maxBoundReached = true;
	}
	if (this.__sprite.y > this.__player.get_canvasHeight()) {
		this.__sprite.y = this.__player.get_canvasHeight();
		this.__maxBoundReached = true;
	}
};

Projectile.prototype.shouldBeDestroyed = function() {
	return this.__shouldBeDestroyed;
};

function Player(x, y, canvasWidth, canvasHeight) {
	//Ugh
	var me = this;
	//sprite
	this.__sprite = new createjs.Bitmap("resources/testicles.png");
	this.__sprite.x = x;
	this.__sprite.y = y;
	this.__sprite.scaleX = .25,
	this.__sprite.scaleY = .25,
	this.__sprite.regX = 360,
	this.__sprite.regY = 360,

	this.__projectiles = [];

	this.__canvasWidth = canvasWidth;
	this.__canvasHeight = canvasHeight;
	this.get_canvasWidth = function() { return this.__canvasWidth };
	this.get_canvasHeight = function() { return this.__canvasHeight };

	//Keypress variables
	this.__movingRight = false;
	this.__movingDown = false;
	this.__movingLeft = false;
	this.__movingUp = false;

	//Set up the event reactor
	this.__playerReactor = new Reactor();
	this.get_playerReactor = function() { return this.__playerReactor };
	this.__playerReactor.registerEvent('addProjectile');
	this.__playerReactor.registerEvent('removeProjectile');

	//Add handlers
	window.addEventListener("keydown", function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				me.__movingRight = true;
				break;
			case 83: //s
				me.__movingDown = true;
				break;''
			case 65: //a
				me.__movingLeft = true;
				break;
			case 87: //w
				me.__movingUp = true;
				break;
		}
	}, false);
    window.addEventListener("keyup", function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				me.__movingRight = false;
				break;
			case 83: //s
				me.__movingDown = false;
				break;''
			case 65: //a
				me.__movingLeft = false;
				break;
			case 87: //w
				me.__movingUp = false;
				break;
		}
	}, false);

	window.addEventListener("click", function(event) {
		me.shoot();
	}, false);
}

Player.prototype = {
	__speed: 0,
	__speedX: 0,
	__speedY: 0,
	__accel: .25,
	__angle: 0,
	__friction: .96,
	__maxSpeed: 5,
	__projectiles: null,
};

Player.prototype.update = function(mouseX, mouseY) {
	var me = this;
	//Set x-axis speed
	if (Math.abs(this.__speedX) <= this.__maxSpeed && this.isMovingLeftOrRight()) {
		if (this.__movingLeft) {
			this.__speedX -= this.__accel;
		}
		if (this.__movingRight) {
			this.__speedX += this.__accel;
		}
	} 

	//Set y-axis speed
	if (Math.abs(this.__speedY) <= this.__maxSpeed && this.isMovingUpOrDown()) {
		if (this.__movingUp) {
			this.__speedY -= this.__accel;
		}
		if (this.__movingDown) {
			this.__speedY += this.__accel;
		}
	} 

	this.setPosition(this.__sprite.x += this.__speedX);
	this.setPosition(this.__sprite.y += this.__speedY);

	this.rotate(mouseX, mouseY);

	//Update projectiles. TODO: Make this its own function
	this.__projectiles.forEach(function(currentProjectile, index, projectiles) {
		currentProjectile.update();
		if(currentProjectile.shouldBeDestroyed()) {
			me.__playerReactor.dispatchEvent('removeProjectile', currentProjectile);
			//Remove reference from the array
			//TODO: make sure that memory is actually cleaned up
			me.__projectiles.splice(index, 1); //Could also call with 'this' instead of me and not need to reference projectiles directly
		}

		//TODO: Remove projectile from the array and delete it
	});

	//this.__speed *= this.__friction;
	this.__speedX *= this.__friction;
	this.__speedY *= this.__friction;

};

Player.prototype.anyKeyPressed = function() {
	return (this.__movingLeft || this.__movingUp || this.__movingDown || this.__movingRight);
};

Player.prototype.isMovingLeftOrRight = function() {
	return (this.__movingRight || this.__movingLeft);
};

Player.prototype.isMovingUpOrDown = function() {
	return (this.__movingUp || this.__movingDown);
};

Player.prototype.setPosition = function(x, y) {
	if (this.__sprite.x < 0) {
		this.__sprite.x = 0;
	}
	if (this.__sprite.x > this.__canvasWidth) {
		this.__sprite.x = this.__canvasWidth;
	}
	if (this.__sprite.y < 0) {
		this.__sprite.y = 0;
	}
	if (this.__sprite.y > this.__canvasHeight) {
		this.__sprite.y = this.__canvasHeight;
	}
};

Player.prototype.rotate = function(mouseX, mouseY) {
	this.__angle = Math.atan2(mouseY - this.__sprite.y, mouseX - this.__sprite.x);
	this.__angle = this.__angle * (180/Math.PI);

	if(this.__angle < 0) {
		this.__angle = 360 - (-this.__angle);
	}

	this.__sprite.rotation = 90 + this.__angle;
};

Player.prototype.shoot = function() {
	var projectile = new Projectile(this);
	this.__projectiles.push(projectile);
	this.__playerReactor.dispatchEvent('addProjectile', projectile); //raise an event so that the game knows to draw a new projectile
};
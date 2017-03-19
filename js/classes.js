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

	//Keypress variables
	this.__keyD = false;
	this.__keyS = false;
	this.__keyA = false;
	this.__keyW = false;

	//Set up the event reactor
	this.__playerReactor = new Reactor();
	this.__playerReactor.registerEvent('addProjectile');
	this.get_playerReactor = function() { return this.__playerReactor };

	// var addProjectileEvent = new CustomEvent("addProjectile");
	// var destroyProjectilEvent = new CustomEvent("destroyProjectile");
	
	//Add handlers
	window.addEventListener("keydown", function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				me.__keyD = true;
				break;
			case 83: //s
				me.__keyS = true;
				break;''
			case 65: //a
				me.__keyA = true;
				break;
			case 87: //w
				me.__keyW = true;
				break;
		}
	}, false);
    window.addEventListener("keyup", function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				me.__keyD = false;
				break;
			case 83: //s
				me.__keyS = false;
				break;''
			case 65: //a
				me.__keyA = false;
				break;
			case 87: //w
				me.__keyW = false;
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
	__accel: .2,
	__angle: 0,
	__friction: .96,
	__maxSpeed: 5,
	__projectiles: null,
};

Player.prototype.update = function(mouseX, mouseY) {
	if (this.__speed <= this.__maxSpeed && this.anyKeyPressed()) {
		this.__speed += this.__accel;
	}

	if (this.__keyD) {
		this.__speedX = this.__speed;
	}
	if (this.__keyS) {
		this.__speedY = this.__speed;
	}
	if (this.__keyA) {
		this.__speedX = -this.__speed;
	}
	if (this.__keyW) {
		this.__speedY = -this.__speed;
	}

	this.setPosition(this.__sprite.x += this.__speedX);
	this.setPosition(this.__sprite.y += this.__speedY);

	this.rotate(mouseX, mouseY);

	this.__projectiles.forEach(function(currentValue, index, projectiles) {
		currentValue.update();
	})

	this.__speed *= this.__friction;
	this.__speedX *= this.__friction;
	this.__speedY *= this.__friction;

};

Player.prototype.anyKeyPressed = function() {
	return (this.__keyA || this.__keyW || this.__keyS || this.__keyD)
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
}

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

function Projectile(player) {
	me = this;
	this.__sprite = new createjs.Bitmap("resources/testicles.png");
	this.__sprite.x = player.__sprite.x;
	this.__sprite.y = player.__sprite.y;
	this.__sprite.scaleX = .05;
	this.__sprite.scaleY = .05;
	this.__sprite.regX = 360;
	this.__sprite.regY = 360;
	this.__angle = player.__angle;
	this.__speedX = Math.cos(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
	this.__speedY = Math.sin(this.__angle * Math.PI/180) * this.__speed; //TODO: Use standard deg->rad function
	this.__sprite.rotation = 90 + this.__angle;

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

	//this.rotate(mouseX, mouseY);

	// this.__speed *= this.__friction;
	// this.__speedX *= this.__friction;
	// this.__speedY *= this.__friction;

};

Projectile.prototype.setPosition = function(x, y) {
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
}

// window.addEventListener("keydown", onKeyDown, false);
// window.addEventListener("keyup", onKeyUp, false);

//this.move = function() {};

	


// function projectile(stage, angle) {
// 	this.sprite.graphics.beginFill("purple").drawRect(0,0,20,20);

// 	this.onMouse

// }
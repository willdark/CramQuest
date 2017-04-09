class Player {
    constructor(x, y, canvasWidth, canvasHeight, stage) {
        var that = this;

        this.__stage = stage;

        //sprite
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

        this.__particleEmitter = new LineParticleEmitter(this.__stage, 10, 50, 60);

        this.__speed = 0;
        this.__speedX = 0;
        this.__speedY = 0;
        this.__accel = 0.25;
        this.__angle = 0;
        this.__friction = 0.96;
        this.__maxSpeed = 5;

        this.__xBoundary = canvasWidth;
        this.__yBoundary = canvasHeight;

        // Movement and keypress
        this.__movingRight = false;
        this.__movingDown = false;
        this.__movingLeft = false;
        this.__movingUp = false;

        this.__projectiles = [];
        this.__isShooting = false;
        this.__lastShotInstant = Date.now();
        this.__shotDelta = 100;
        var SideEnum = {
            left : -1,
            right: 1,
        }
        this.__lastShotSide = SideEnum.left;

        // Health and stuff
        this.__health = 100;
        this.__collisionDamage = 20;
        this.__isDead = false;
        this.__timeLastHit = 0;
        this.__timeLastBlink = 0;
        this.__isInverted = false;
        
        this.__playerReactor = new Reactor();
        this.__playerReactor.registerEvent('addProjectile');
        this.__playerReactor.registerEvent('removeProjectile');

        //Add handlers
        window.addEventListener("keydown", function(event) {
            that.keydownListener(event);
        }, false);

        window.addEventListener("keyup", function(event) {
            that.keyupListener(event);
        }, false);

        window.addEventListener("mousedown", function(event) {
            that.startShooting();
        }, false);

        window.addEventListener("mouseup", function(event) {
            that.stopShooting();
        }, false);

    }

    get sprite          ()              { return this.__sprite }
    get x               ()              { return this.__sprite.x }
    get y               ()              { return this.__sprite.y }
    get width           ()              { return this.__sprite.image.width * this.__sprite.scaleX }
    get height          ()              { return this.__sprite.image.height * this.__sprite.scaleY }
    get xBoundary       ()              { return this.__xBoundary }
    get yBoundary       ()              { return this.__yBoundary }
    get angle           ()              { return this.__angle }
    set displayObject   (displayObject) { this.__displayObject = displayObject }
    get displayObject   ()              { return this.__displayObject }
    get projectiles     ()              { return this.__projectiles }
    get isShooting      ()              { return this.__isShooting }
    get playerReactor   ()              { return this.__playerReactor }
    get collisionDamage ()              { return this.__collisionDamage }

    update(mouseX, mouseY) {
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

        this.__sprite.x += this.__speedX;
        this.__sprite.y += this.__speedY;

        this.enforceBoundaries(); // Make sure the player doesn't go off the level
        this.rotate(mouseX, mouseY);
        this.applyFriction();

        if (this.__isShooting) {
            this.shoot();
        }

        this.updateParticles();

        this.updateProjectiles();

        this.updateDisplay();
    }

    updateDisplay() {
        // TODO: Fix this so that the number of blinks is consistent
        if (this.shouldBlink()) {
            this.__timeLastBlink = Date.now();
            if (this.__isInverted) {
                this.__sprite.image = this.__image;
                this.__isInverted = false;
            }
            else {
                this.__sprite.image = this.__imageInverted;
                this.__isInverted = true;
            }
        }
        else if (!this.isHit() && this.__isInverted) {
            this.__sprite.image = this.__image;
            this.__isInverted = false;
        }
    }

    updateProjectiles() {
        var that = this;
        this.__projectiles.forEach(function(currentProjectile, index) {
            currentProjectile.update();
            if(currentProjectile.shouldBeDestroyed()) {
                that.__playerReactor.dispatchEvent('removeProjectile', currentProjectile);
                //Remove reference from the array
                //TODO: make sure that memory is actually cleaned up
                that.__projectiles.splice(index, 1); //Could also call with 'this' instead of me and not need to reference projectiles directly
            }
            //TODO: Remove projectile from the array and delete it
        });
    }

    updateParticles() {
        if (this.isMoving()) {
            this.__particleEmitter.emit(this.__sprite.x - 90 * Math.cos(this.__angle * Math.PI/180), this.__sprite.y - 90 * Math.sin(this.__angle * Math.PI/180), this.__angle - 90);
        }
        this.__particleEmitter.update();
    }

    shoot() {
        if (Date.now() - this.__lastShotInstant >= this.__shotDelta) {
            var projectile = new Projectile(
                this.__sprite.x + (90 * Math.cos(this.__angle * Math.PI/180)),
                this.__sprite.y + (90 * Math.sin(this.__angle * Math.PI/180)),
                this.__angle,
                this.__xBoundary, this.yBoundary);
            // should tell the projectile the side and should take care of the delta.
            this.__projectiles.push(projectile);
            this.__playerReactor.dispatchEvent('addProjectile', projectile); //raise an event so that the game knows to draw a new projectile
            projectile.playSound();

            this.__lastShotInstant = Date.now();
        }

    }

    // Returns is the player is currently hit and invulnerable
    isHit() {
        return Date.now() - this.__timeLastHit < 2000;
    }

    hit(damage) {
        //blink and decrement health
        if (!this.isHit()) {
            this.__health -= damage;
            this.__timeLastHit = Date.now();
            if (this.__health <= 0) {
                this.destroy();
            }
        }
    }

    shouldBlink() {
        return this.isHit() && Date.now() - this.__timeLastBlink > 200;
    }

    destroy() {
        this.__isDead = true;
    }

    startShooting() {
        this.__isShooting = true;
    }

    stopShooting() {
        this.__isShooting = false;
    }

    rotate(mouseX, mouseY) {
        this.__angle = Math.atan2(mouseY - this.__sprite.y, mouseX - this.__sprite.x);
        this.__angle = this.__angle * (180/Math.PI);

        if(this.__angle < 0) {
            this.__angle = 360 - (-this.__angle);
        }

        this.__sprite.rotation = 90 + this.__angle;
    }

    keydownListener(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 68: //d
                this.__movingRight = true;
                break;
            case 83: //s
                this.__movingDown = true;
                break;
            case 65: //a
                this.__movingLeft = true;
                break;
            case 87: //w
                this.__movingUp = true;
                break;
        }
    }

    keyupListener(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 68: //d
                this.__movingRight = false;
                break;
            case 83: //s
                this.__movingDown = false;
                break;''
            case 65: //a
                this.__movingLeft = false;
                break;
            case 87: //w
                this.__movingUp = false;
                break;
        }
    }

    enforceBoundaries() {
        if (this.__sprite.x < 0) {
            this.__sprite.x = 0;
        }
        if (this.__sprite.x > this.__xBoundary) {
            this.__sprite.x = this.__xBoundary;
        }
        if (this.__sprite.y < 0) {
            this.__sprite.y = 0;
        }
        if (this.__sprite.y > this.__yBoundary) {
            this.__sprite.y = this.__yBoundary;
        }
    }

    applyFriction() {
        this.__speedX *= this.__friction;
        this.__speedY *= this.__friction;
    }

    isMovingLeftOrRight() {
        return (this.__movingRight || this.__movingLeft);
    }

    isMovingUpOrDown() {
        return (this.__movingUp || this.__movingDown);
    }

    isMoving() {
        return (this.isMovingUpOrDown() || this.isMovingLeftOrRight());
    }

}
class Player {
    constructor(x, y, canvasWidth, canvasHeight) {
        var that = this;

        //sprite
        this.__sprite = new createjs.Bitmap("resources/testicles.png");
        this.__sprite.x = x;
        this.__sprite.y = y;
        this.__sprite.scaleX = .25;
        this.__sprite.scaleY = .25;
        this.__sprite.regX = 360;
        this.__sprite.regY = 360;

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

        window.addEventListener("click", function(event) {
            that.shoot();
        }, false);

    }

    get sprite        ()              { return this.__sprite }
    set displayObject (displayObject) { this.__displayObject = displayObject }
    get displayObject ()              { return this.__displayObject }
    get projectiles   ()              { return this.__projectiles }
    get playerReactor ()              { return this.__playerReactor }
    get xBoundary     ()              { return this.__xBoundary }
    get yBoundary     ()              { return this.__yBoundary }

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

        this.updateProjectiles()

    }

    updateProjectiles() {
        var that = this;
        this.__projectiles.forEach(function(currentProjectile, index, projectiles) {
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

    shoot() {
        var projectile = new Projectile(this);
        this.__projectiles.push(projectile);
        this.__playerReactor.dispatchEvent('addProjectile', projectile); //raise an event so that the game knows to draw a new projectile
    }

    rotate(mouseX, mouseY) {
        this.__angle = Math.atan2(mouseY - this.__sprite.y, mouseX - this.__sprite.x);
        this.__angle = this.__angle * (180/Math.PI);

        if(this.__angle < 0) {
            this.__angle = 360 - (-this.__angle);
        }

        this.__sprite.rotation = 90 + this.__angle;
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
}
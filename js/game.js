class Game {
    constructor(canvas, stage) {
        var that = this;

        //Initialize basic game state
        this.__stage = stage;
        this.__canvas = canvas;

        this.__hasStarted = false;
        this.__isPaused = false;

        this.__player = null;
        this.__playerReactor = null;
        this.__playerDisplayObject = null;

        this.__audio = new Audio('resources/gametheme.mp4');
        this.__audio.volume = .1;

        this.__enemies = [];
        this.__lastEnemyGenerated = Date.now();
    }

    get hasStarted ()               { return this.__hasStarted }
    set hasStarted (gameHasStarted) { this.__hasStarted = hasStarted }
    get isPaused   ()               { return this.__isPaused }
    set isPaused   (gameHasStarted) { this.__isPaused = isPaused }


    start() {
        var that = this;
        this.initializePlayer();
        this.initializeListeners();
        this.initializeTicker();
        this.playSong();
        this.__hasStarted = true;
    }

    pause() {
        this.__gameIsPaused = true;
        //fill this in
    }

    resume() {
        this.__gameIsPaused = false;
    }

    initLevel(levelNum) {
        //Initialize the level
    }

    update() {
        var that = this;

        if(this.__player) { this.__player.update(this.__stage.mouseX, this.__stage.mouseY); }
        this.__stage.update();

        if (Date.now() - this.__lastEnemyGenerated >= 2000) {
            this.generateEnemy();
            this.__lastEnemyGenerated = Date.now();
        }

        //check collisions
        this.checkCollisions();
        this.__enemies.forEach(function(e, index, enemies) {
            e.update();
            if (e.isDead) {
                that.__stage.removeChild(e.displayObject);
                that.__enemies.splice(index, 1);
            }
        });
    }

    initializePlayer() {
        var that = this;
        this.__player = new Player(this.__canvas.width/2, this.__canvas.height/2, this.__canvas.width, this.__canvas.height); //TODO: Fix this. It's dumb.
        this.__playerDisplayObject = this.__stage.addChild(this.__player.sprite);

        try {
            this.__player.playerReactor.addEventListener('addProjectile', function(projectile) {
                projectile.displayObject = that.__stage.addChildAt(projectile.sprite, that.__stage.getChildIndex(that.__playerDisplayObject));
            });
            this.__player.playerReactor.addEventListener('removeProjectile', function(projectile) {
                that.__stage.removeChild(projectile.displayObject);
            });
        }
        catch(e) {
            console.log("Failed to initialize a player reactor event");
        }
    }

    initializeTicker() {
        var that = this;
        createjs.Ticker.setFPS(144);
        createjs.Ticker.addEventListener("tick", function() {
            that.update(); //addEventListener does not like it when we pass class methods instead of function literals
        });
    }

    initializeListeners() {
        // initialize the click listener
    }

    playSong() {
        this.__audio.play();
    }

    pauseSong() {
        this.__audio.pause();
    }

    generateEnemy() {
        var enemy = new Enemy(getRandomInRange(100, this.__canvas.width),
            getRandomInRange(100,this.__canvas.height), this.__canvas.width, this.__canvas.height);
        this.__enemies.push(enemy);
        enemy.displayObject = this.__stage.addChild(enemy.sprite);
    }

    checkCollisions() {
        var that = this;
        that.__enemies.forEach(function(enemy) {
            that.__player.projectiles.forEach(function(projectile) {
                if(checkForCollision(projectile.y - projectile.height/2, projectile.x + projectile.width/2,
                    projectile.y + projectile.height/2, projectile.x - projectile.width/2,
                        enemy.y - enemy.height/2, enemy.x + enemy.width/2,
                            enemy.y + enemy.height/2, enemy.x - enemy.width/2)) {
                // if (projectile.x <= enemy.x + enemy.width/2 && 
                //         projectile.x + projectile.width/2 >= enemy.x &&
                //             projectile.y <= enemy.y + enemy.height/2 && 
                //                 projectile.y + projectile.height/2 >= enemy.y) {
                    enemy.hit(projectile.damage);
                    projectile.destroy();
                }
            });
            if(checkForCollision(that.__player.y - that.__player.height/2, that.__player.x + that.__player.width/2,
                that.__player.y + that.__player.height/2, that.__player.x - that.__player.width/2,
                    enemy.y - enemy.height/2, enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.x - enemy.width/2)) {
                that.__player.hit(that.__player.collisionDamage);
            }
        });
    }
}

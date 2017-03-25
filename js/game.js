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
        if(this.__player) { this.__player.update(this.__stage.mouseX, this.__stage.mouseY); }
        this.__stage.update();
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
}

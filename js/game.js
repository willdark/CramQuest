class Game {
    constructor() {
        var that = this;

        //Initialize basic game state
        this.__stage = new createjs.Stage("gameCanvas");
        this.__canvas = document.getElementById("gameCanvas");
        this.__canvas.style.display = "block";
        this.__canvas.width = window.innerWidth;
        this.__canvas.height = window.innerHeight;

        // Title Screen Text
        this.__titleImg = new createjs.Bitmap("resources/titleText.png");
        this.__titleImg.regX = 750;
        this.__titleImg.regY = 200;
        this.__titleImg.x = this.__canvas.width/2;
        this.__titleImg.y = this.__canvas.height/2 - 200;

        this.__gameHasStarted = false;

        this.__titleDisplayObject = null;

        this.__player = null;
        this.__playerReactor = null;
        this.__playerDisplayObject = null;

        // Listen for game start
        if (document.addEventListener) {
            document.addEventListener('keypress', function keyPressHandler(e) {
                if (e.keyCode == 13 && !that.__gameHasStarted) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    that.__gameHasStarted = true;
                    that.start();
                }
            }, false);
        }
    }

    start() {
        var that = this;
        this.hideMainMenu();
        this.initializePlayer();
        this.initializeListeners();
    }

    showMainMenu() {
        //Show the main menu
        this.__titleDisplayObject = this.__stage.addChild(this.__titleImg);
        this.initializeTicker();
    }

    hideMainMenu() {
        this.__stage.removeChild(this.__titleDisplayObject);
        this.update();
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
        // this.__player.set_displayObject(this.__stage.addChild(this.__player.get_sprite()));
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
}

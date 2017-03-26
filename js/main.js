
function init() {
    var that = this;

    // Init canvas
    var canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Init stage
    var stage = new createjs.Stage("gameCanvas");

    // Show menu
    var menu = new Menu(canvas, stage);
    menu.doStartingSequence();
    // menu.show();

    // Init and start game
	var game = new Game(canvas, stage);

    // Listen for game start
    if (document.addEventListener) {
        document.addEventListener('keydown', function(e) {
            if (e.keyCode == 13) { // Enter
                if (e.preventDefault) {
                    e.preventDefault();
                }

                menu.hide();
                if(!game.hasStarted){
                    game.start();
                }
                if(game.isPaused) {
                    game.resume();
                }
            }
            if (e.keyCode == 27) { // Escape
                if (e.preventDefault) {
                    e.preventDefault();
                }
                menu.show(true);
                game.pause();
            }
        }, false);
    }
}



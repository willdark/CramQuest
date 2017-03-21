function main() {	
	//Wait for enter keypress to start
	// if (document.addEventListener) {
	// 	document.addEventListener('keypress', keyPressHandler, false);
	// }
}

function init() {

	var game = new Game();
	game.showMainMenu();
	game.update();


	// var titleText = document.getElementById("titleText");
	// titleText.style.display = "none";
	
	// var stage = new createjs.Stage("gameCanvas");
	// var canvas = document.getElementById("gameCanvas");
	// canvas.style.display = "block";
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;

	// //Initialize player
	// var player = new Player(500, 500, canvas.width, canvas.height);
	// var playerDisplayObject = stage.addChild(player.__sprite);
	// playerReactor = player.get_playerReactor();
	// playerReactor.addEventListener('addProjectile', function(projectile) {
	// 	projectile.set_displayObject(stage.addChildAt(projectile.get_sprite(), stage.getChildIndex(playerDisplayObject)));
	// });

	// playerReactor.addEventListener('removeProjectile', function(projectile) {
	// 	stage.removeChild(projectile.get_displayObject());
	// });


	// player.update();

	// var tick = function(event) {
	// 	player.update(stage.mouseX, stage.mouseY);
	// 	stage.update(event);
	// };
	// createjs.Ticker.addEventListener("tick", tick);
	// createjs.Ticker.setFPS(144);
}

var keyPressHandler = function(e) {
	if (e.keyCode == 13) {
		init();

		if (e.preventDefault) {
			e.preventDefault();
		}
	}
}

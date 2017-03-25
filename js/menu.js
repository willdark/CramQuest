class Menu {
    constructor(canvas, stage) {

        this.__canvas = canvas;
        this.__stage = stage;

        // Title Screen Text
        this.__titleImg = new createjs.Bitmap("resources/titleText.png");
        this.__titleImg.regX = 750;
        this.__titleImg.regY = 200;
        this.__titleImg.x = this.__canvas.width/2;// this.__canvas.width/2;
        this.__titleImg.y = this.__canvas.height + 150; //this.__canvas.height/2 - 200;

        this.__titleDisplayObject = null;

        this.__audio = new Audio('resources/cramquesttheme.m4a');

        this.__interval = null; //meh

    }

    show(isPause = false) {
        if(isPause) {
            clearInterval(this.__interval);
            this.__titleImg.x = this.__canvas.width/2;// this.__canvas.width/2;
            this.__titleImg.y = this.__canvas.height/2 - 200; //this.__canvas.height/2 - 200;
        }
        this.__titleDisplayObject = this.__stage.addChild(this.__titleImg);
        this.__stage.update();
    }

    hide() {
        this.stopSong();
        this.__stage.removeChild(this.__titleDisplayObject);
        this.__stage.update();
    }

    doStartingSequence() {
        var that = this;
        this.show();
        this.playSong();
        this.__interval = setInterval(frame, 20);
        function frame() {
            if (that.__titleImg.y >= that.__canvas.height/2 - 200) {
                that.__titleImg.y -= 3;
            }
            else {
                clearInterval(this.__interval);
            }
            that.__stage.update();
        }
    }

    playSong() {
        this.__audio.play();
    }

    stopSong() {
        this.__audio.pause();
    }
}

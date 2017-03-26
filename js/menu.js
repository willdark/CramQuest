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

        this.__subTitleImg = new createjs.Bitmap("resources/pressEnterText.png");
        this.__subTitleImg.regX = 463;
        this.__subTitleImg.regY = 23;
        this.__subTitleImg.x = this.__canvas.width/2;// this.__canvas.width/2;
        this.__subTitleImg.y = this.__canvas.height/2 + 150; //this.__canvas.height/2 - 200;

        this.__titleDisplayObject = null;
        this.__subTitleDisplayObject = null;

        this.__audio = new Audio('resources/cramquesttheme.m4a');
        this.__audio.volume = .1;

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
        clearInterval(this.__interval);
        this.__stage.removeChild(this.__titleDisplayObject);
        this.__stage.update();
    }

    doStartingSequence() {
        var that = this;
        var opacityDelta = 1;
        this.show();
        this.playSong();
        this.__interval = setInterval(frame, 20);
        function frame() {
            if (that.__titleImg.y >= that.__canvas.height/2 - 200) {
                that.__titleImg.y -= 3;
            }
            else {
                // Title animation finished, show the "press enter to start" text


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

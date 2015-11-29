smashthesquaresastheycome.Preload = function () {
    this.ready = false;
};

smashthesquaresastheycome.Preload.prototype = {
    preload: function () {

        // Preload bar
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        // Images
        this.load.image('square', 'assets/images/white-square-20.png');

        // Fonts
        this.load.bitmapFont('squareFont', 'assets/fonts/square8blackborder1/font.png', 'assets/fonts/square8blackborder1/font.fnt');

        // Audio
        this.load.audio('onStartGame', ['assets/sounds/on-start-game.ogg', 'assets/on-start-game.mp3']);
        this.load.audio('onEndGame', ['assets/sounds/on-end-game.ogg', 'assets/on-end-game.mp3']);
        this.load.audio('onTimer1', ['assets/sounds/on-timer-1.ogg', 'assets/on-timer-1.mp3']);
        this.load.audio('hitAlphaSquare', ['assets/sounds/on-click-1.ogg', 'assets/on-click-1.mp3']);
        this.load.audio('hitBlackSquare', ['assets/sounds/on-hit-black-square.ogg', 'assets/on-hit-black-square.mp3']);



        this.load.onLoadComplete.add(this.onLoadComplete, this);

    },
    create: function () {

        this.preloadBar.cropEnabled = false;

    },
    update: function () {
        // Check if ready or not, Go to the Main menu when ready
        if (this.ready === true) {
            this.state.start('MainMenu');
        }

    },
    onLoadComplete: function () {

        this.ready = true;

    }
};
smashthesquaresastheycome.Game = function () {


};

smashthesquaresastheycome.Game.prototype = {
    create: function () {

        // Vars
        this.squareNumber = 1000;
        this.scoreString = "Score : ";
        this.score = 0;

        // Sounds
        this.onTimer1 = this.add.audio('onTimer1');
        //this.hitAlphaSquareSound = this.game.add.audio('hitAlphaSquare');
        //this.hitBlackSquareSound = this.game.add.audio('hitBlackSquare');
        this.onEndGame = this.add.audio('onEndGame');

        // Local storage
        // Best score
        if (!!localStorage) {
            this.bestScore = localStorage.getItem('bestScoreSquaresInvasion');
        } else {
            // Fallback. LocalStorage isn't available
            this.bestScore = 'N/A';
        }

        // Score text
        this.scoreText = this.game.add.bitmapText(10, 10, 'squareFont', this.scoreString + this.score, 88);
        this.scoreText.x = this.game.world.centerX - this.scoreText.textWidth / 2;
        this.scoreText.y = this.game.world.centerY - this.scoreText.textHeight / 2;
        this.scoreText.tint = 0xdedede;

        // Repeating events
        this.game.time.events.repeat(Phaser.Timer.SECOND, this.squareNumber, this.waveGenerator, this);

        // Player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'square');
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(4);
        this.player.tint = 0x000000;
        this.player.smoothed = false;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = true;

        // Alpha squares group
        this.squares = this.game.add.group();
        this.squares.enableBody = true;



    },
    update: function () {

        //  Moves the player
        this.player.rotation = this.game.physics.arcade.moveToPointer(this.player, 345, this.game.input.activePointer, 120);

        // To handle player and alphasquare squares collision
        this.game.physics.arcade.collide(this.player, this.squares, this.sHit, null, this);


    },
    shutdown: function () {
        this.player.destroy();
        this.squares.destroy();

        this.scoreText.destroy();


        this.game.score = this.score;
        this.score = 0;

        this.game.bestScore = this.bestScore;


    },
    /******************************
     * THE GAME'S FUNCTIONS
     *******************************/
   

    recordBestScore: function () {
        // Stock score and best score
        if (!!localStorage) {
            this.bestScoreStored = localStorage.getItem('bestScoreSquaresInvasion');
            if (!this.bestScoreStored || this.bestScore < this.score) {
                this.bestScore = this.score;
                localStorage.setItem('bestScoreSquaresInvasion', this.bestScore);
            }
        } else {
            // Fallback. LocalStorage isn't available
            this.game.bestScore = 'N/A';
        }
    }

};
smashthesquaresastheycome.Game = function () {


};

smashthesquaresastheycome.Game.prototype = {
    create: function () {

        // Vars
        this.squareNumber = 7777;
        this.scoreString = "Score : ";
        this.score = 0;

        // Sounds
        this.onTimer1 = this.add.audio('onTimer1');
        this.hitAlphaSquareSound = this.game.add.audio('hitAlphaSquare');
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
        this.game.time.events.repeat(444, this.squareNumber, this.squaresGenerator, this);

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
        // To handle collision between members of a group so so they bounce with each other
        this.game.physics.arcade.collide(this.squares);


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
    alphaSquareGenerator: function (origin) {

        var squareX, squareY;

        switch (origin) {
            case 0 :
                squareX = this.game.world.randomX;
                squareY = 0;
                break;
            case 1:
                squareX = this.game.world.width;
                squareY = this.game.world.randomY;
                break;
            case 2:
                squareX = this.game.world.randomX;
                squareY = this.game.world.height;
                break;
            case 3:
                squareX = 0;
                squareY = this.game.world.randomY;
                break;
            default :
                squareX = 0;
                squareY = 0;
        }

        var s = this.squares.create(squareX, squareY, 'square');
        s.anchor.setTo(0.5);
        s.scale.setTo(4);
        s.name = 'square' + this.squareNumber;
        s.tint = 0x000000;
        s.body.collideWorldBounds = true;
        s.body.bounce.setTo(0.8, 0.8);
        s.body.velocity.setTo(20 + Math.random() * 60, 20 + Math.random() * 60);

    },
    squaresGenerator: function () {
        this.onTimer1.play();

        var side = this.game.rnd.integerInRange(0, 3);

        this.alphaSquareGenerator(side);

        this.squareNumber -= 1;
    },
    sHit: function (player, square) {

        this.hitAlphaSquareSound.play();


        square.destroy();

        this.score += 1;

        this.scoreText.text = this.scoreString + this.score;
        this.scoreText.x = this.game.world.centerX - this.scoreText.textWidth / 2;

        // Stock score and best score
        this.recordBestScore();



    },

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
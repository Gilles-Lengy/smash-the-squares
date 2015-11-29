smashthesquaresastheycome.Game = function () {


};

smashthesquaresastheycome.Game.prototype = {
    create: function () {

        // Vars
        this.squareNumber = 7777;
        this.malusNumber = 5555;
        this.squareOnTheScreenCounterString = "Squares on the screen : ";
        this.squareOnTheScreenCounter = 0;
        this.maximumSquareOntheScreen = 18;
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

        // Square counter display

        this.squareCounterDisplay = this.game.add.bitmapText(10, 10, 'squareFont', this.squareOnTheScreenCounter, 180);
        this.squareCounterDisplay.x = this.game.world.centerX - this.squareCounterDisplay.textWidth / 2;
        this.squareCounterDisplay.y = this.game.world.centerY - this.squareCounterDisplay.textHeight / 2;
        this.squareCounterDisplay.tint = 0xdedede;

        // Squares Counter Text
        this.squareCounterText = this.game.add.bitmapText(10, 10, 'squareFont', this.squareOnTheScreenCounterString, 88);
        this.squareCounterText.x = this.game.world.centerX - this.squareCounterText.textWidth / 2;
        this.squareCounterText.y = this.squareCounterDisplay.y - 150;
        this.squareCounterText.tint = 0xdedede;

        // Score text
        this.scoreText = this.game.add.bitmapText(10, 10, 'squareFont', this.scoreString + this.score, 88);
        this.scoreText.x = this.game.world.centerX - this.scoreText.textWidth / 2;
        this.scoreText.y = this.squareCounterText.y - 150;
        this.scoreText.tint = 0xdedede;


        // Repeating events
        this.game.time.events.repeat(444, this.squareNumber, this.squaresGenerator, this);
        this.game.time.events.repeat(Phaser.Timer.SECOND * 5, this.malusNumber, this.malusGenerator, this);

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

        // Malus Red squares group
        this.malus = this.game.add.group();
        this.malus.enableBody = true;

        // Init emitter for squares explosions
        this.game.explosionEmitter = this.game.add.emitter(0, 0, 777);
        this.game.explosionEmitter.makeParticles('square');
        this.game.explosionEmitter.setYSpeed(-333, 333);
        this.game.explosionEmitter.setXSpeed(-333, 333);
        this.game.explosionEmitter.minParticleScale = 0.5;
        this.game.explosionEmitter.maxParticleScale = 0.9;
        this.game.explosionEmitter.gravity = 0;


    },
    update: function () {

        //  Moves the player
        this.player.rotation = this.game.physics.arcade.moveToPointer(this.player, 345, this.game.input.activePointer, 120);

        // To handle player and alphasquare squares collision
        this.game.physics.arcade.collide(this.player, this.squares, this.sHit, null, this);
        // To handle player and malus squares collision
        this.game.physics.arcade.collide(this.player, this.malus, this.mHit, null, this);
        // To handle collision between members of a group so so they bounce with each other
        this.game.physics.arcade.collide(this.squares);
        // To handle collision between members of a group so so they bounce with each other
        this.game.physics.arcade.collide(this.malus);
        // To handle collision between members of a squares and malus group so they bounce with each other
        this.game.physics.arcade.collide(this.squares, this.malus);
        // To handle collision between members of a explosionEmitter and malus group so they bounce with each other
        this.game.physics.arcade.collide(this.game.explosionEmitter, this.malus);
        // To handle collision between members of a explosionEmitter and squares group so they bounce with each other
        this.game.physics.arcade.collide(this.game.explosionEmitter,this.squares);
        // To handle collision between members of a explosionEmitters so they bounce with each other
        this.game.physics.arcade.collide(this.game.explosionEmitter);

        if (this.squareOnTheScreenCounter > this.maximumSquareOntheScreen) {
            this.onEndGame.play();
            this.state.start('GameOver');
        }


    },
    shutdown: function () {
        this.player.destroy();
        this.squares.destroy();

        this.scoreText.destroy();
        this.squareCounterDisplay.destroy();
        this.squareCounterText.destroy();

        this.game.explosionEmitter.destroy();


        this.game.score = this.score;
        this.score = 0;

        this.game.bestScore = this.bestScore;


    },
    /******************************
     * THE GAME'S FUNCTIONS
     *******************************/
    alphaSquareGenerator: function (origin, group) {

        var squareX, squareY, s;

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


        if (group === 'squares') {
            s = this.squares.create(squareX, squareY, 'square');
            s.name = 'blackSquare' + this.squareNumber;
            s.tint = 0x000000;
        } else {
            s = this.malus.create(squareX, squareY, 'square');
            s.name = 'redSquare' + this.malusNumber;
            s.tint = 0xff0000;
        }

        s.anchor.setTo(0.5);
        s.scale.setTo(4);

        s.body.collideWorldBounds = true;
        s.body.bounce.setTo(0.8, 0.8);
        s.body.velocity.setTo(20 + Math.random() * 60, 20 + Math.random() * 60);

    },
    squaresGenerator: function () {
        this.onTimer1.play();

        var side = this.game.rnd.integerInRange(0, 3);

        this.alphaSquareGenerator(side, 'squares');

        this.squareNumber -= 1;

        this.squareOnTheScreenCounter += 1;


        this.squareCounterDisplay.text = this.squareOnTheScreenCounter;
        this.squareCounterDisplay.x = this.game.world.centerX - this.squareCounterDisplay.textWidth / 2;
    },
    malusGenerator: function () {

        this.onTimer1.play();

        var side = this.game.rnd.integerInRange(0, 3);

        this.alphaSquareGenerator(side, 'malus');

        this.malusNumber -= 1;


    },
    sHit: function (player, square) {

        this.squareOnTheScreenCounter -= 1;

        this.hitAlphaSquareSound.play();

// Emit particles
        this.game.explosionEmitter.x = square.x;
        this.game.explosionEmitter.y = square.y;
        this.game.explosionEmitter.start(true, Phaser.Timer.SECOND * 7, null, 11);
        square.destroy();

        this.score += 1;

        this.scoreText.text = this.scoreString + this.score;
        this.scoreText.x = this.game.world.centerX - this.scoreText.textWidth / 2;


        // Stock score and best score
        this.recordBestScore();


    },
    mHit: function () {

        this.onEndGame.play();
        this.state.start('GameOver');


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

}
;
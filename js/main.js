'use strict';

//global variables
window.onload = function () {
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

    // Game States
    game.state.add('Boot', smashthesquaresastheycome.Boot);
    game.state.add('MainMenu', smashthesquaresastheycome.MainMenu);
    game.state.add('Game', smashthesquaresastheycome.Game);
    game.state.add('GameOver', smashthesquaresastheycome.GameOver);
    game.state.add('Preload', smashthesquaresastheycome.Preload);

    // Boot
    game.state.start('Boot');
};
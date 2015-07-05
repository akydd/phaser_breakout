define(['phaser-game'], function(game) {
    'use strict';

    function Load() {
    };

    Load.prototype = {
        preload: function() {
            game.load.image('background', 'assets/background.jpg');
            game.load.image('ball', 'assets/ball_silver2.png');
            game.load.image('block_white', 'assets/bricks/white.png');
            game.load.image('block_orange', 'assets/bricks/orange.png');
            game.load.image('block_turquoise', 'assets/bricks/turquoise.png');
            game.load.image('block_green', 'assets/bricks/green.png');
            game.load.image('block_red', 'assets/bricks/red.png');
            game.load.image('block_blue', 'assets/bricks/blue.png');
            game.load.image('block_pink', 'assets/bricks/pink.png');
            game.load.image('block_yellow', 'assets/bricks/yellow.png');
            game.load.image('block_silver', 'assets/bricks/silver.png');
            game.load.image('block_gold', 'assets/bricks/gold.png');
            game.load.image('paddle', 'assets/bat_black2.png');
            game.load.image('disrupt', 'assets/powerups/disrupt.png');
        },
        create: function() {
            game.state.start('Menu');
        }
    };

    return Load;
});

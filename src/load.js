define(['phaser-game'], function(game) {
    'use strict';

    function Load() {
    };

    Load.prototype = {
        preload: function() {
            var loadingBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBar');
            loadingBar.anchor.setTo(0.5, 0.5);
            loadingBar.scale.x = 6;
            loadingBar.scale.y = 1;

            game.load.setPreloadSprite(loadingBar);

            game.load.image('background', 'assets/background.jpg');
            game.load.image('ball', 'assets/ball_silver2.png');
            game.load.image('block_blue', 'assets/bricks/blue.png');
            game.load.image('block_pink', 'assets/bricks/pink.png');
            game.load.image('block_green', 'assets/bricks/green.png');
            game.load.image('block_yellow', 'assets/bricks/yellow.png');
            game.load.image('block_violet', 'assets/bricks/violet.png');
            game.load.image('paddle', 'assets/bat_black2.png');
            game.load.image('disrupt', 'assets/powerups/disrupt.png');
        },
        create: function() {
            game.state.start('Menu');
        }
    };

    return Load;
});

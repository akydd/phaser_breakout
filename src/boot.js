define(['phaser-game'], function(game) {
    'use strict';

    function Boot() {
    };

    Boot.prototype = {
        preload: function() {
            game.load.image('loadingBar', 'assets/bricks/blue.png');

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.checkCollision.down = false;
        },
        create: function() {
            game.state.start('Load');
        }
    };

    return Boot;
});

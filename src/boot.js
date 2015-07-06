define(['phaser-game'], function(game) {
    'use strict';

    function Boot() {
    };

    Boot.prototype = {
        preload: function() {
            game.load.image('loadingBar', 'assets/bricks/blue.png');
        },
        create: function() {
            game.state.start('Load');
        }
    };

    return Boot;
});

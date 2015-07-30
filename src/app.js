(function() {
    'use strict';

    requirejs.config({
        baseUrl: 'src/',
        paths: {
            phaser: 'libs/phaser/build/phaser'
        },
        shim: {
            'phaser': {
                exports: 'Phaser'
            }
        }
    });

    require([
        'phaser',
        'phaser-game',
        'boot',
        'load',
        'menu',
        'game',
        'levels',
        'powerup'
    ], function (
        Phaser,
        Game,
        Boot,
        Load,
        Menu,
        Play,
        Levels,
        Powerup
    ) {
        Game.state.add('Boot', Boot);
        Game.state.add('Load', Load);
        Game.state.add('Menu', Menu);
        Game.state.add('Game', Play);
        Game.state.start('Boot');
    });

}());

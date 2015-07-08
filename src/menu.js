define(['phaser-game'], function(game) {
    'use strict';

    function Menu() {
    };

    Menu.prototype = {
        create: function() {
            game.add.sprite(0, 0, 'background');

            // game.physics.startSystem(Phaser.Physics.ARCADE);

            var emitter = game.add.emitter(game.world.centerX, -35, 5);
            emitter.width = game.world.width;
            emitter.makeParticles(['block_blue', 'block_pink', 'block_green', 'block_yellow', 'block_violet']);
            emitter.gravity = 200;
            emitter.setRotation(0, 0);
            emitter.setXSpeed(0, 0);
            emitter.start(false, 3000, 500);

            game.add.text(20, 20, "Breakout", {font: '80px karmatic_arcaderegular', fill: '#000000'});
            game.add.text(20, 120, "Up arrow to start", {font: '20px karmatic_arcaderegular', fill: '#000000'});
            game.add.text(20, 160, "Left and right arrows to move", {font: '20px karmatic_arcaderegular', fill: '#000000'});

            this.cursor = game.input.keyboard.createCursorKeys();
        },
        update: function() {
            if (this.cursor.up.isDown)
                game.state.start('Game');
        }
    };

    return Menu;
});

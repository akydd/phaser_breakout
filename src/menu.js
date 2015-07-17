define(['phaser-game'], function(game) {
    'use strict';

    function Menu() {
    };

    Menu.prototype = {
        create: function() {
            game.add.sprite(0, 0, 'background');

            // game.physics.startSystem(Phaser.Physics.ARCADE);

            game.sound.destroy();
            var backgroundTrack = game.add.sound('track');
            backgroundTrack.play(null, 0, 0.6, true, false);

            var emitter = game.add.emitter(game.world.centerX, -35, 5);
            emitter.width = game.world.width;
            emitter.makeParticles(['block_blue', 'block_pink', 'block_green', 'block_yellow', 'block_violet']);
            emitter.gravity = 200;
            emitter.setRotation(0, 0);
            emitter.setXSpeed(0, 0);
            emitter.start(false, 3000, 500);

            var titleStyle = {font: '80px karmatic_arcaderegular', fill: '#000000'};
            var textStyle = {font: '20px karmatic_arcaderegular', fill: '#000000'};

            var titleText = game.add.text(game.world.centerX, game.world.centerY, "Breakout", titleStyle);
            titleText.anchor.x = 0.5;
            titleText.anchor.y = 0.5;

            var controlsString = "Up arrow to start\nLeft and right arrows to move\n'P' to pause";
            var controlsText = game.add.text(game.world.centerX, game.world.centerY + 100, controlsString, textStyle);
            controlsText.anchor.x = 0.5;
            controlsText.anchor.y = 0.5;

            var creditText = game.add.text(game.world.centerX, game.world.centerY + 200, "Artwork by www.unluckystudio.com", textStyle);
            creditText.anchor.x = 0.5;
            creditText.anchor.y = 0.5;

            this.cursor = game.input.keyboard.createCursorKeys();
        },
        update: function() {
            if (this.cursor.up.isDown)
                game.state.start('Game');
        }
    };

    return Menu;
});

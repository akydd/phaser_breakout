define(['phaser-game'], function(game) {
    'use strict';

    function Menu() {
    };

    Menu.prototype = {
        create: function() {
            game.add.text(20,20, "Arkanoid", { font: "20px Arial", fill: "#777777" });
            this.cursor = game.input.keyboard.createCursorKeys();
        },
        update: function() {
            if (this.cursor.up.isDown)
                game.state.start('Game');
        }
    };

    return Menu;
});

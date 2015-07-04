define(['phaser'], function(Phaser) {
    "use strict";

    var Brick = function(game, x, y, color) {
        Phaser.Sprite.call(this, game, x, y, 'block_' + color);
        game.physics.arcade.enableBody(this);

        this.body.immovable = true;
        if (color === 'silver') {
            this.health = 2;
        } else {
            this.health = 1;
        }
    };

    Brick.prototype = Object.create(Phaser.Sprite.prototype);
    Brick.prototype.constructor = Brick;

    return Brick;
});

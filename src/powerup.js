define(['phaser'], function(Phaser) {
    "use strict";

    var Powerup = function(game, x, y, type, frame) {
        this.type = type;
        Phaser.Sprite.call(this, game, x, y, type, frame);

        game.physics.arcade.enableBody(this);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    };

    Powerup.prototype = Object.create(Phaser.Sprite.prototype);
    Powerup.prototype.constructor = Powerup;

    return Powerup;
});

define(['phaser'], function(Phaser) {
    "use strict";

    var Powerup = function(game, x, y, type) {
        Phaser.Sprite.call(this, game, x, y, 'disrupt');

        game.physics.arcade.enableBody(this);
        this.body.velocity.y = 200;
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    };

    Powerup.prototype = Object.create(Phaser.Sprite.prototype);
    Powerup.prototype.constructor = Powerup;

    return Powerup;
});

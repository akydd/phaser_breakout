define(['phaser'], function(Phaser) {
    "use strict";

    var Bullet = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'bullet');

        this.anchor.setTo(0.5);

        game.physics.arcade.enableBody(this);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    };

    Bullet.prototype = Object.create(Phaser.Sprite.prototype);
    Bullet.prototype.constructor = Bullet;

    return Bullet;
});
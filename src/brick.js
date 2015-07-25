define(['phaser'], function(Phaser) {
    "use strict";

    var Brick = function(game, x, y, blockType) {
        var color;

        switch(blockType) {
            case 'b':
                Phaser.Sprite.call(this, game, x, y, 'block_blue');
                break;
            case 'p':
                Phaser.Sprite.call(this, game, x, y, 'block_pink');
                break;
            case 'g':
                Phaser.Sprite.call(this, game, x, y, 'block_green');
                break;
            case 'y':
                Phaser.Sprite.call(this, game, x, y, 'block_yellow');
                break;
            case 'v':
                Phaser.Sprite.call(this, game, x, y, 'block_violet');
                break;
        }
        
        game.physics.arcade.enableBody(this);

        this.body.immovable = true;
        if (blockType === 'p') {
            this.health = 2;
        } else {
            this.health = 1;
        }
    };

    Brick.prototype = Object.create(Phaser.Sprite.prototype);
    Brick.prototype.constructor = Brick;

    return Brick;
});

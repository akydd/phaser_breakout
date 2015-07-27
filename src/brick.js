define(['phaser'], function(Phaser) {
    "use strict";

    var Brick = function(game, x, y, blockType) {
        var color;

        switch(blockType) {
            case 'b':
                Phaser.Sprite.call(this, game, x, y, 'block_blue');
                this.score = 100;
                break;
            case 'p':
                Phaser.Sprite.call(this, game, x, y, 'block_pink');
                this.score = 110;
                break;
            case 'g':
                Phaser.Sprite.call(this, game, x, y, 'block_green');
                this.score = 80;
                break;
            case 'y':
                Phaser.Sprite.call(this, game, x, y, 'block_yellow');
                this.score = 120;
                break;
            case 'v':
                Phaser.Sprite.call(this, game, x, y, 'block_violet');
                this.score = 90;
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

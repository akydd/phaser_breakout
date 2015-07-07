define([
    'phaser',
    'phaser-game',
    'brick'
], function(
    Phaser, 
    game,
    Brick
) {
    'use strict';

    function Game() {
    };

    Game.prototype = {
        create: function() { 
            game.add.sprite(0, 0, 'background');

            // the blocks
            var blockX = 77;
            var padding = 3;
            var blockY = 35;
            var cols = 10;
            var firstColY = 80;

            this.blocks = game.add.group();
            this.blocks.enableBody = true;
            this.blocks.physicsBodyType = Phaser.Physics.ARCADE;

            for(var i = 0; i < 4; i++) {
                for(var j = 0; j < cols; j++) {
                    this.blocks.add(new Brick(game, (j + 1) * padding + j * blockX, firstColY + i * padding + i * blockY, 'blue'));
                }
            }

            this.paddle = game.add.sprite(game.world.centerX - 50, game.world.height - 25, 'paddle');
            game.physics.arcade.enable(this.paddle);
            // paddle should not move when ball hits it
            this.paddle.body.immovable = true;
            this.paddle.body.collideWorldBounds = true;

            // the ball (20x20)
            this.ball = game.add.sprite(game.world.centerX - 10, this.paddle.body.y - 22, 'ball');
            this.ballOnPaddle = true;
            game.physics.enable(this.ball);
            // the ball should bounce off the edges of the world
            this.ball.body.collideWorldBounds = true;
            this.ball.body.bounce.x = 1;
            this.ball.body.bounce.y = 1;
            // handle lost balls 
            this.ball.checkWorldBounds = true;
            this.ball.events.onOutOfBounds.add(this.ballLost, this);

            // the score
            this.score = 0;
            var style = { font: "20px Arial", fill: "#000000" };  
            this.scoreText = game.add.text(20, 20, "Score: " + this.score, style);

            // lives
            this.lives = 3;
            this.livesText = game.add.text(20, 40, "Lives: " + this.lives, style);

            // get ready for keyboard input
            this.cursors = game.input.keyboard.createCursorKeys();
        },
        update: function() {
            // paddle motion
            this.paddle.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.paddle.body.velocity.x = -350;
            } else if (this.cursors.right.isDown) {
                this.paddle.body.velocity.x = 350;
            }

            if (this.cursors.down.isDown && this.ballOnPaddle) {
                this.releaseBall();
            }

            if (this.ballOnPaddle) {
                this.ball.body.x = this.paddle.body.x + this.paddle.body.halfWidth - 11;
            }

            // ball paddle collision
            game.physics.arcade.collide(this.ball, this.paddle, bounceOffPaddle, null, this);

            // ball block collision
            game.physics.arcade.collide(this.ball, this.blocks, this.hitBlock, null, this);
        },
        releaseBall: function() {
            this.ballOnPaddle = false;
            // release at pi/4, angular velocity of 250, plus horizontal velocity of
            // paddle
            this.ball.body.velocity.x = 177 + this.paddle.body.velocity.x;
            this.ball.body.velocity.y = -177;
        },
        hitBlock: function(ball, block) {
            block.damage(1);

            switch(block.key) {
                case 'block_white':
                    this.score += 50;
                    break;
                case 'block_orange':
                    this.score += 60;
                    break;
                case 'block_turquoise':
                    this.score += 70;
                    break;
                case 'block_green':
                    this.score += 80;

                    // Testing powerup
                    var powerup  = game.add.sprite(block.x, block.y, 'disrupt');
                    game.physics.enable(powerup);
                    powerup.body.velocity.y = 200;
                    // handle lost balls 
                    powerup.checkWorldBounds = true;
                    // replace this with outOfBounds.kill = true;
                    //powerup.events.onOutOfBounds.add(ballLost, this);

                    break;
                case 'block_red':
                    this.score += 90;
                    break;
                case 'block_blue':
                    this.score += 100;
                    break;
                case 'block_pink':
                    this.score += 110;
                    break;
                case 'block_yellow':
                    this.score += 120;
                    break;
                case 'block_silver':
                    if (!block.alive) {
                        this.score += 50;
                    }
            }

            this.scoreText.text = "Score: " + this.score;
        },
        ballLost: function() {
            this.lives--;
            this.livesText.text = "Lives: " + this.lives;

            this.ball.reset(this.paddle.body.x + 50, this.paddle.body.y - 22);
            this.ballOnPaddle = true;

            if (this.lives == 0) {
                game.state.start('Menu');
            }
        }
    };

    return Game;
});

function bounceOffPaddle() {
    // the physics are handled by the framework.
    // TODO: play 'bounce' sound
}

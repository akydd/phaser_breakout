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

            // the paddle
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
            var textStyle = {font: '20px karmatic_arcaderegular', fill: '#000000'};
            this.scoreText = game.add.text(20, 20, "Score " + this.score, textStyle);

            // lives
            this.lives = 3;
            this.livesText = game.add.text(20, 50, "Lives " + this.lives, textStyle);

            // get ready for keyboard input
            this.cursors = game.input.keyboard.createCursorKeys();
            this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
            this.pauseKey.onDown.add(this.pause, this);

            // sounds
            this.bump = game.add.audio('bump');
            this.blockHit = game.add.audio('block_hit');
        },
        pause: function() {
            if (game.paused) {
                game.paused = false;
                this.pauseText.destroy();
            } else {
                game.paused = true;
                var textStyle = {font: '80px karmatic_arcaderegular', fill: '#000000'};
                this.pauseText = game.add.text(401, 300, "Paused", textStyle);
                this.pauseText.anchor.x = 0.5;
                this.pauseText.anchor.y = 0.5;
            }
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
            game.physics.arcade.collide(this.ball, this.paddle, this.hitPaddle, null, this);

            // ball block collision
            game.physics.arcade.collide(this.ball, this.blocks, this.hitBlock, null, this);
        },
        releaseBall: function() {
            this.ballOnPaddle = false;
            // release at pi/4, angular velocity of 250, plus horizontal velocity of
            // paddle
            this.ball.body.velocity.x = 177;
            this.ball.body.velocity.y = -177;
        },
        hitPaddle: function() {
            this.bump.play();
        },
        hitBlock: function(ball, block) {
            this.blockHit.play();
            block.damage(1);

            switch(block.key) {
                case 'block_blue':
                    this.score += 100;
                    break;
                case 'block_pink':
                    this.score += 110;
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
                case 'block_yellow':
                    this.score += 120;
                    break;
                case 'block_violet':
                    this.score += 90;
                    break;
            }

            this.scoreText.text = "Score: " + this.score;
        },
        ballLost: function() {
            this.lives--;
            this.livesText.text = "Lives: " + this.lives;

            if (this.lives == 0) {
                this.gameOver();
            } else {
                this.ball.reset(this.paddle.body.x + 50, this.paddle.body.y - 22);
                this.ballOnPaddle = true;
            }
        },
        gameOver: function() {
            var textStyle = {font: '80px karmatic_arcaderegular', fill: '#000000'};
            var gameOverText = game.add.text(401, 300, "Game Over!", textStyle);
            gameOverText.anchor.x = 0.5;
            gameOverText.anchor.y = 0.5;

            game.time.events.add(Phaser.Timer.SECOND * 4, function() {
                game.state.start('Menu');
            }, this);
        }
    };

    return Game;
});

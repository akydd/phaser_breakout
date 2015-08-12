define([
    'phaser',
    'phaser-game',
    'brick',
    'levels',
    'powerup',
    'ball'
], function(
    Phaser, 
    game,
    Brick,
    Levels,
    Powerup,
    Ball
) {
    'use strict';

    function Game() {
    };

    Game.prototype = {
        currentLevel: 0,
        buildLevel: function(level) {
            // the blocks dimensions and padding
            var blockX = 77;
            var blockY = 35;
            var padding = 3;
            var firstColY = 80;

            // clear out the old blocks
            this.blocks.removeAll(true, true);

            for(var i = 0; i < level.length; i++) {
                for(var j = 0; j < level[i].length; j++) {
                    var blockType = level[i][j];
                    if (blockType) {
                        this.blocks.add(new Brick(game, (j + 1) * padding + j * blockX, firstColY + i * padding + i * blockY, blockType));
                    }
                }
            }
        },
        create: function() { 
            game.add.sprite(0, 0, 'background');

            // blocks
            this.blocks = game.add.group();

            // the paddle
            this.paddle = game.add.sprite(game.world.centerX, game.world.height - 25, 'paddle');
            this.paddle.anchor.setTo(0.5);
            game.physics.arcade.enable(this.paddle);
            // paddle should not move when ball hits it
            this.paddle.body.immovable = true;
            this.paddle.body.collideWorldBounds = true;

            // powerups
            this.powerupLaser = game.add.group();
            this.powerupLaser.classType = Powerup;
            this.powerupLaser.createMultiple(5, 'laser');
            this.powerupDisrupt = game.add.group();
            this.powerupDisrupt.classType = Powerup;
            this.powerupDisrupt.createMultiple(5, 'disrupt');
            this.powerupCatch = game.add.group();
            this.powerupCatch.classType = Powerup;
            this.powerupCatch.createMultiple(5, 'catch');
            this.powerups = game.add.group();
            this.powerups.add(this.powerupLaser);
            this.powerups.add(this.powerupDisrupt);
            this.powerups.add(this.powerupCatch);

            // balls
            this.balls = game.add.group();
            this.balls.classType = Ball;
            this.balls.createMultiple(3, 'ball');
            this.balls.forEach(function(ball) {
                ball.events.onOutOfBounds.add(this.ballLost, this);
            }, this);

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
        ready: function() {
            var textStyle = {font: '80px karmatic_arcaderegular', fill: '#000000'};
            var readyText = game.add.text(401, 300, "Ready!", textStyle);
            readyText.anchor.x = 0.5;
            readyText.anchor.y = 0.5;
        
            // after two seconds, reenable and redisplay the paddle and a single
            // ball
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                readyText.destroy();
                this.paddle.reset(game.world.centerX, game.world.height - 25);
                this.ballOnPaddle = true;
                this.balls.getChildAt(0).reset(this.paddle.body.x, this.paddle.body.y - 11);
                this.powerupsAllowed = true;
            }, this);
        },
        update: function() {
            if (this.blocks.countLiving() === 0) {
                // Load the next level
                this.buildLevel(Levels.getLevel(this.currentLevel));
                this.currentLevel++;

                this.disablePaddle();
                // there may be more than 1 ball in play.
                this.disableActiveBalls();

                // Ready
                this.ready();
            }
            
            // paddle motion
            this.paddle.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.paddle.body.velocity.x = -500;
            } else if (this.cursors.right.isDown) {
                this.paddle.body.velocity.x = 500;
            }

            if (this.cursors.down.isDown && this.ballOnPaddle) {
                this.releaseBall();
            }

            if (this.ballOnPaddle) {
                var ball = this.balls.getChildAt(0);
                ball.body.x = this.paddle.body.x + this.paddle.body.halfWidth - 11;
            }

            // ball paddle collision
            game.physics.arcade.collide(this.balls, this.paddle, this.hitPaddle, null, this);

            // ball block collision
            game.physics.arcade.collide(this.balls, this.blocks, this.hitBlock, null, this);

            // powerup paddle collistion
            game.physics.arcade.collide(this.powerupLaser, this.paddle, this.hitPowerupLaser, null, this);
            game.physics.arcade.collide(this.powerupDisrupt, this.paddle, this.hitPowerupDisrupt, null, this);
            game.physics.arcade.collide(this.powerupCatch, this.paddle, this.hitPowerupCatch, null, this);
        },
        releaseBall: function() {
            this.ballOnPaddle = false;
            var activeBall = this.balls.getChildAt(0);
            activeBall.body.velocity.x = 300;
            activeBall.body.velocity.y = -300;
        },
        /**
         * Collision is group vs sprite, so sprite must be the first argument
         */
        hitPaddle: function(paddle, ball) {
            // bounce behaviour depends on where on the point of impact
            var xoffset = ball.x - paddle.x;

            if (xoffset > 25) {
                game.physics.arcade.velocityFromAngle(-45, 424, ball.body.velocity);
            } else if (xoffset < -25) {
                game.physics.arcade.velocityFromAngle(-135, 424, ball.body.velocity);
            } 

            this.bump.play();
        },
        hitBlock: function(ball, block) {
            this.blockHit.play();
            block.damage(1);

            if (!block.alive) {
                this.score += block.score;
                this.scoreText.text = "Score: " + this.score;

                // 1 in 4 chance for a powerup
                if (this.powerupsAllowed) {
                    if(game.rnd.integerInRange(1, 4) === 1) {
                        this.dropPowerUp(block);
                    }
                }
            }
        },
        dropPowerUp: function(block) {
            var powerupType = this.powerups.getRandom();
            var powerup = powerupType.getFirstExists(false);
            powerup.reset(block.x, block.y);
            powerup.body.velocity.y = 200;
        },
        hitPowerupLaser: function(paddle, powerup) {
            console.log("Fire lasers!");
            powerup.kill();
        },
        hitPowerupDisrupt: function(paddle, powerup) {
            this.powerupsAllowed = false;
            powerup.kill();
            
            // enable two other balls
            var liveBall = this.balls.getFirstAlive();
            var x = liveBall.body.velocity.x;
            var y = liveBall.body.velocity.y;

            // orignal ball trajectory rotated by 30 degrees
            var ball2 = this.balls.getFirstDead();
            ball2.reset(liveBall.x, liveBall.y);
            ball2.body.velocity.x = x * 0.866 - y/2;
            ball2.body.velocity.y = x/2 + y * 0.866;

            // original ball trajectory rotated by -30 degrees
            var ball3 = this.balls.getFirstDead();
            ball3.reset(liveBall.x, liveBall.y);
            ball3.body.velocity.x = x * 0.866 + y/2;
            ball3.body.velocity.y = -x/2 + y * 0.866;
        },
        hitPowerupCatch: function(paddle, powerup) {
            console.log("I gotcha!");
            powerup.kill();
        },
        ballLost: function(ball) {
            ball.kill();

            if (this.balls.countLiving() === 1) {
                this.powerupsAllowed = true;
            }

            if (this.balls.countLiving() === 0) {
                this.lives--;
                this.livesText.text = "Lives: " + this.lives;

                if (this.lives == 0) {
                    this.gameOver();
                } else {
                    this.disablePaddle();
                    this.ready();
                }
            }
        },
        disablePaddle: function() {
            this.paddle.visible = false;
            this.paddle.inputEnabled = false;            
        },
        disableActiveBalls: function() {
            this.balls.forEachAlive(function(ball) {
                ball.kill();
            });
        },
        gameOver: function() {
            this.disablePaddle();
            
            var textStyle = {font: '80px karmatic_arcaderegular', fill: '#000000'};
            var gameOverText = game.add.text(401, 300, "Game Over!", textStyle);
            gameOverText.anchor.x = 0.5;
            gameOverText.anchor.y = 0.5;
            
            this.currentLevel = 0;

            game.time.events.add(Phaser.Timer.SECOND * 4, function() {
                game.state.start('Menu');
            }, this);
        }
    };

    return Game;
});

define([
    'phaser',
    'phaser-game',
    'brick',
    'levels',
    'powerup',
    'ball',
    'bullet'
], function(
    Phaser, 
    game,
    Brick,
    Levels,
    Powerup,
    Ball,
    Bullet
) {
    'use strict';

    function Game() {
    };

    Game.prototype = {
        currentLevel: 0,
        textStyle: {
            font: '20px karmatic_arcaderegular',
            fill: '#000000'
        },
        bigTextStyle: {
            font: '80px karmatic_arcaderegular',
            fill: '#000000'
        },
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
        createPaddle: function() {
            this.paddle = game.add.sprite(game.world.centerX, game.world.height - 25, 'paddle');
            this.paddle.anchor.setTo(0.5);
            game.physics.arcade.enable(this.paddle);
            // paddle should not move when ball hits it
            this.paddle.body.immovable = true;
            this.paddle.body.collideWorldBounds = true;
        },
        createPowerups: function() {
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
        },
        createBalls: function() {
            this.balls = game.add.group();
            this.balls.classType = Ball;
            this.balls.createMultiple(3, 'ball');
            this.balls.forEach(function(ball) {
                ball.events.onOutOfBounds.add(this.ballLost, this);
            }, this);
        },
        createBullets: function() {
            this.bullets = game.add.group();
            this.bullets.classType = Bullet;
            this.bullets.createMultiple(50, 'bullet');
//            this.bullets.forEach(function(bullet) {
//                bullet.events.onOutOfBounds.add(this.todo, this);
//            }, this);

            this.nextShotAt = 0;
        },
        createStatusBar: function() {
            // the score
            this.score = 0;
            this.scoreText = game.add.text(20, 20, "Score " + this.score, this.textStyle);

            // lives
            this.lives = 3;
            this.livesText = game.add.text(20, 50, "Lives " + this.lives, this.textStyle);
        },
        create: function() { 
            game.add.sprite(0, 0, 'background');

            // blocks
            this.blocks = game.add.group();

            this.createPaddle();
            this.createPowerups();
            this.createBalls();
            this.createBullets();
            this.createStatusBar();

            // get ready for keyboard input
            this.cursors = game.input.keyboard.createCursorKeys();
            this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
            this.pauseKey.onDown.add(this.pause, this);
            this.powerupKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

            // sounds
            this.bump = game.add.audio('bump');
            this.blockHit = game.add.audio('block_hit');
            this.laser = game.add.audio('laser');
        },
        pause: function() {
            if (game.paused) {
                game.paused = false;
                this.pauseText.destroy(); // text can't be killed, only destroyed
            } else {
                game.paused = true;
                this.pauseText = game.add.text(401, 300, "Paused", this.bigTextStyle);
                this.pauseText.anchor.x = 0.5;
                this.pauseText.anchor.y = 0.5;
            }
        },
        ready: function() {
            var readyText = game.add.text(401, 300, "Ready!", this.bigTextStyle);
            readyText.anchor.x = 0.5;
            readyText.anchor.y = 0.5;
        
            // after two seconds, reenable and redisplay the paddle and a single
            // ball
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                readyText.destroy();
                this.paddle.reset(game.world.centerX, game.world.height - 25);
                this.ballOnPaddle = true;
                this.balls.getChildAt(0).reset(this.paddle.body.x, this.paddle.body.y - 11);
                this.activePowerup = null;
            }, this);
        },
        update: function() {
            if (this.blocks.countLiving() === 0) {
                // Load the next level
                this.buildLevel(Levels.getLevel(this.currentLevel));
                this.currentLevel++;

                // clear/reset the game
                this.disablePaddle();
                this.disableActiveBalls();
                this.removeFallingPowerups();

                // Ready
                this.ready();
            }
            
            // paddle motion
            this.paddle.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.paddle.body.velocity.x = -600;
            } else if (this.cursors.right.isDown) {
                this.paddle.body.velocity.x = 600;
            }

            // power ups:
            // lasers
            if (this.activePowerup === 'LASER') {
                if (this.powerupKey.isDown) {
                    this.fireLaser();
                }
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
            game.physics.arcade.collide(this.balls, this.blocks, this.ballHitBlock, null, this);

            // powerup paddle collistion
            game.physics.arcade.collide(this.powerupLaser, this.paddle, this.hitPowerupLaser, null, this);
            game.physics.arcade.collide(this.powerupDisrupt, this.paddle, this.hitPowerupDisrupt, null, this);
            game.physics.arcade.collide(this.powerupCatch, this.paddle, this.hitPowerupCatch, null, this);

            // bullet block collision
            game.physics.arcade.collide(this.bullets, this.blocks, this.bulletHitBlock, null, this)
        },
        fireLaser: function() {
            var shotDelay = 300; // shots are fires 100 milliseconds apart

            if (this.nextShotAt > this.time.now) {
                return;
            }

            var bullet1 = this.bullets.getFirstExists(false);
            bullet1.reset(this.paddle.x - 40, this.paddle.y);

            var bullet2 = this.bullets.getFirstExists(false);
            bullet2.reset(this.paddle.x + 40, this.paddle.y);

            bullet1.body.velocity.y = -400;
            bullet2.body.velocity.y = -400;

            this.laser.play();

            this.nextShotAt = this.time.now + shotDelay;
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
        bulletHitBlock: function(bullet, block) {
            this.hitBlock(block);
            bullet.kill();
        },
        ballHitBlock: function(ball, block) {
            this.blockHit.play();
            this.hitBlock(block);
        },
        hitBlock: function(block) {
            block.damage(1);

            if (!block.alive) {
                this.score += block.score;
                this.scoreText.text = "Score: " + this.score;

                // score notification
                var hitText = game.add.text(block.x, block.y, block.score, this.textStyle);
                hitText.anchor.x = 0.5;
                hitText.anchor.y = 0.5;
                hitText.scale.x = 0;
                hitText.scale.y = 0;
                var scale = block.score/80; // higher scores === larger text
                var tweenIn = game.add.tween(hitText.scale).to({x: scale, y: scale}, 400, Phaser.Easing.Linear.None, true, 0, 0, true);

                // TODO: figure out how to delete text once tween in complete
                // tweenIn.onLoop.add(function(hitText, tween) {
                //     hitText.destroy();
                //}, this);

                // 1 in 4 chance for a powerup, when disrupt powerup is not
                // active
                if (this.activePowerup !== 'DISRUPT') {
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
            this.activePowerup = 'LASER';
            powerup.kill();
        },
        hitPowerupDisrupt: function(paddle, powerup) {
            this.activePowerup = 'DISRUPT';
            powerup.kill();

            // powerups that have already dropped must also be killed.
            this.removeFallingPowerups();
            
            // enable two other balls
            var liveBall = this.balls.getFirstAlive();
            var x = liveBall.body.velocity.x;
            var y = liveBall.body.velocity.y;

            // rotate second ball trajectory by 30 degrees
            var ball2 = this.balls.getFirstDead();
            ball2.reset(liveBall.x, liveBall.y);
            ball2.body.velocity.x = x * 0.866 - y/2;
            ball2.body.velocity.y = x/2 + y * 0.866;

            // rotate third ball trajectory by -30 degrees
            var ball3 = this.balls.getFirstDead();
            ball3.reset(liveBall.x, liveBall.y);
            ball3.body.velocity.x = x * 0.866 + y/2;
            ball3.body.velocity.y = -x/2 + y * 0.866;
        },
        hitPowerupCatch: function(paddle, powerup) {
            console.log("I gotcha!");
            this.activePowerup = 'CATCH';
            powerup.kill();
        },
        ballLost: function(ball) {
            ball.kill();

            if (this.balls.countLiving() === 1) {
                this.activePowerup = null;
            }

            if (this.balls.countLiving() === 0) {
                this.lives--;
                this.livesText.text = "Lives: " + this.lives;

                if (this.lives == 0) {
                    this.gameOver();
                } else {
                    this.disablePaddle();
                    this.removeFallingPowerups();
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
        removeFallingPowerups: function() {
            this.powerupLaser.forEachAlive(function(powerup) {
               powerup.kill();
            });

            this.powerupDisrupt.forEachAlive(function(powerup) {
                powerup.kill();
            });

            this.powerupCatch.forEachAlive(function(powerup) {
                powerup.kill();
            });
        },
        gameOver: function() {
            this.disablePaddle();
            this.removeFallingPowerups();
            
            var gameOverText = game.add.text(401, 300, "Game Over!", this.bigTextStyle);
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

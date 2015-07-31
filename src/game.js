define([
    'phaser',
    'phaser-game',
    'brick',
    'levels',
    'powerup'
], function(
    Phaser, 
    game,
    Brick,
    Levels,
    Powerup
) {
    'use strict';

    function Game() {
    };

    Game.prototype = {
        currentLevel: 0,
        buildLevel: function(level) {
            // the blocks dimensions and starting positions at top left
            var blockX = 77;
            var padding = 3;
            var blockY = 35;
            var firstColY = 80;

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
            this.blocks.enableBody = true;
            this.blocks.physicsBodyType = Phaser.Physics.ARCADE;

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
        ready: function() {
            var textStyle = {font: '80px karmatic_arcaderegular', fill: '#000000'};
            var nextLevelText = game.add.text(401, 300, "Ready!", textStyle);
            nextLevelText.anchor.x = 0.5;
            nextLevelText.anchor.y = 0.5;
        
            // after two seconds, reenable and redisplay the ball and paddle
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                nextLevelText.destroy();
                this.paddle.reset(game.world.centerX - 50, game.world.height - 25);
                this.ball.reset(this.paddle.body.x + 50, this.paddle.body.y - 22);
                this.ballOnPaddle = true;
            }, this);
        },
        update: function() {
            if (this.blocks.countLiving() === 0) {
                // Load the next level
                this.buildLevel(Levels.getLevel(this.currentLevel));
                this.currentLevel++;

                // disable ball & paddle
                this.disableAll();

                // Ready
                this.ready();
            }
            
            // paddle motion
            this.paddle.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.paddle.body.velocity.x = -400;
            } else if (this.cursors.right.isDown) {
                this.paddle.body.velocity.x = 400;
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

            // powerup paddle collistion
            game.physics.arcade.collide(this.powerup, this.paddle, this.hitPowerup, null, this);
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

            if (!block.alive) {
                this.score += block.score;
                this.scoreText.text = "Score: " + this.score;

                // 1 in 4 chance for a powerup
                if(game.rnd.integerInRange(1, 4) === 1) {
                    this.dropPowerUp(block);
                }
            }
        },
        dropPowerUp: function(block) {
            var powerupTypes = ['disrupt', 'catch', 'laser'];
            var powerupType = powerupTypes[game.rnd.integerInRange(0, 2)];
            
            this.powerup = new Powerup(game, block.x, block.y, powerupType);
            game.add.existing(this.powerup);
        },
        hitPowerup: function(powerup) {
            console.log(powerup.type);
            powerup.kill();
        },
        ballLost: function() {
            this.lives--;
            this.livesText.text = "Lives: " + this.lives;

            if (this.lives == 0) {
                this.gameOver();
            } else {
                this.disableAll();
                this.ready();
            }
        },
        disableAll: function() {
            // disable & hide ball & paddle
            this.ball.visible = false;
            this.paddle.visible = false;
            this.ball.inputEnabled = false;
            this.paddle.inputEnabled = false;            
        },
        gameOver: function() {
            this.disableAll();
            
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

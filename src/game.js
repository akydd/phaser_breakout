define(['phaser'], function(Phaser) {
    'use strict';

    function Game() {
    };

    Game.prototype = {
        constructor: Game,
        start: function() {
            this.game = new Phaser.Game(520, 600, Phaser.AUTO, 'game-div', {
                create: this.create,
                update: this.update
            });
        },
        create: function() { 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // no collisions on the "floor"
            this.game.physics.arcade.checkCollision.down = false;

            // the blocks
            this.blocks = this.game.add.group();
            this.blocks.enableBody = true;
            this.blocks.physicsBodyType = Phaser.Physics.ARCADE;

            for(var j = 0; j < 13; j++) {
                var block = this.blocks.create(j * 40, 80, 'block_silver');
                block.body.immovable = true;
                block.health = 2;
            }
            for(var j = 0; j < 13; j++) {
                var block = this.blocks.create(j * 40, 100, 'block_red');
                block.body.immovable = true;
                block.health = 1;
            }
            for(var j = 0; j < 13; j++) {
                var block = this.blocks.create(j * 40, 120, 'block_yellow');
                block.body.immovable = true;
                block.health = 1;
            }
            for(var j = 0; j < 13; j++) {
                var block = this.blocks.create(j * 40, 140, 'block_blue');
                block.body.immovable = true;
                block.health = 1;
            }
            for(var j = 0; j < 13; j++) {
                var block = this.blocks.create(j * 40, 160, 'block_pink');
                block.body.immovable = true;
                block.health = 1;
            }
            for(var j = 0; j < 13; j++) {
                var block = this.blocks.create(j * 40, 180, 'block_green');
                block.body.immovable = true;
                block.health = 1;
            }

            // the paddle (50w x 10h)
            this.paddle = this.game.add.sprite(this.game.world.centerX - 25, this.game.world.height - 10, 'paddle');
            this.game.physics.arcade.enable(this.paddle);
            // paddle should not move when ball hits it
            this.paddle.body.immovable = true;
            this.paddle.body.collideWorldBounds = true;

            // the ball (8x8)
            this.ball = this.game.add.sprite(this.game.world.centerX - 4, this.paddle.body.y - 8, 'ball');
            this.game.physics.enable(this.ball);
            // the ball should bounce off the edges of the world
            this.ball.body.collideWorldBounds = true;
            this.ball.body.bounce.x = 1;
            this.ball.body.bounce.y = 1;
            // handle lost balls 
            this.ball.checkWorldBounds = true;
            this.ball.events.onOutOfBounds.add(ballLost, this);

            // the score
            var style = { font: "20px Arial", fill: "#000000" };  
            var scoreText = this.game.add.text(20, 20, "Score: 0", style);

            // lives
            var livesText = this.game.add.text(20, 40, "Lives: 3", style);

            // get ready for keyboard input
            this.cursors = this.game.input.keyboard.createCursorKeys();
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
                releaseBall();
            }

            if (this.ballOnPaddle) {
                this.ball.body.x = this.paddle.body.x + this.paddle.body.halfWidth - 4;
            }

            // ball paddle collision
            this.game.physics.arcade.collide(this.ball, this.paddle, bounceOffPaddle, null, this);

            // ball block collision
            this.game.physics.arcade.collide(this.ball, this.blocks, hitBlock, null, this);
        }
    };

    return Game;
});

function releaseBall() {
    this.ballOnPaddle = false;
    // release at pi/4, angular velocity of 250, plus horizontal velocity of
    // paddle
    this.ball.body.velocity.x = 177 + this.paddle.body.velocity.x;
    this.ball.body.velocity.y = -177;
}

function ballLost() {
    lives--;
    this.livesText.text = "Lives: " + lives;

    this.ball.reset(this.paddle.body.x, this.paddle.body.y - 8);
    this.ballOnPaddle = true;

    if (lives == 0) {
        score = 0;
        lives = 3;
        this.game.state.start('Menu');
    }
}

function killPowerUp() {
}

function hitBlock(ball, block) {
    block.damage(1);

    switch(block.key) {
        case 'block_white':
            score += 50;
            break;
        case 'block_orange':
            score += 60;
            break;
        case 'block_turquoise':
            score += 70;
            break;
        case 'block_green':
            score += 80;

            // Testing powerup
            var powerup  = this.game.add.sprite(block.x, block.y, 'disrupt');
            this.game.physics.enable(powerup);
            powerup.body.velocity.y = 200;
            // handle lost balls 
            powerup.checkWorldBounds = true;
            // replace this with outOfBounds.kill = true;
            //powerup.events.onOutOfBounds.add(ballLost, this);

            break;
        case 'block_red':
            score += 90;
            break;
        case 'block_blue':
            score += 100;
            break;
        case 'block_pink':
            score += 110;
            break;
        case 'block_yellow':
            score += 120;
            break;
        case 'block_silver':
            if (!block.alive) {
                score += 50;
            }
    }

    this.scoreText.text = "Score: " + score;
}

function bounceOffPaddle() {
    // the physics are handled by the framework.
    // TODO: play 'bounce' sound
}

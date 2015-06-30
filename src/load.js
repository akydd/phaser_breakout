Arkanoid = {};

var ballOnPaddle = true;
var score = 0;
var scoreText;
var lives = 3;
var livesText;
var cursors;
var paddle;
var ball;
var blocks;

Arkanoid.Load = function(game) {
};

Arkanoid.Load.prototype = {
    preload: function() {
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('ball', 'assets/ball.png');
        game.load.image('block_white', 'assets/bricks/white.png');
        game.load.image('block_orange', 'assets/bricks/orange.png');
        game.load.image('block_turquoise', 'assets/bricks/turquoise.png');
        game.load.image('block_green', 'assets/bricks/green.png');
        game.load.image('block_red', 'assets/bricks/red.png');
        game.load.image('block_blue', 'assets/bricks/blue.png');
        game.load.image('block_pink', 'assets/bricks/pink.png');
        game.load.image('block_yellow', 'assets/bricks/yellow.png');
        game.load.image('block_silver', 'assets/bricks/silver.png');
        game.load.image('block_gold', 'assets/bricks/gold.png');
        game.load.image('paddle', 'assets/paddle.png');
        game.load.image('disrupt', 'assets/powerups/disrupt.png');
    },

    create: function() {
        this.game.state.start('Menu');
    }
};

var game = new Phaser.Game(520, 600, Phaser.AUTO, 'game-div');

game.state.add('Load', Arkanoid.Load);
game.state.add('Menu', Arkanoid.Menu);
game.state.add('Game', Arkanoid.Game);

game.state.start('Load');

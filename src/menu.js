Arkanoid.Menu = function(game) {
};

Arkanoid.Menu.prototype = {
    create: function() {
        game.add.text(20,20, "Arkanoid", { font: "20px Arial", fill: "#000000" });
        this.cursor = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (this.cursor.up.isDown)
            this.state.start('Game');
    }
};

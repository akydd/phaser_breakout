define(function() {
    "use strict";

    var levels = [
        [
            ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'],
            ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v']
        ],
    ];

    var Levels = {
        getLevel: function(number) {
            return levels[number];
        }
    };

    return Levels;
});

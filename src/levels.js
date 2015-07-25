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
        [
            ['b',    ,    ,    , 'b',    ,    ,    , 'b',    ],
            ['y', 'b',    , 'b', 'y', 'b',    , 'b', 'y', 'b'],
            ['g', 'y', 'b', 'y', 'g', 'y', 'b', 'y', 'g', 'y'],
            [   , 'g', 'y', 'g',    , 'g', 'y', 'g',    , 'g'],
            [   ,    , 'g',    ,    ,    , 'g',    ,    ,    ],
            [   ,    ,    ,    ,    ,    ,    ,    ,    ,    ],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']
        ]
    ];

    var Levels = {
        getLevel: function(number) {
            return levels[number];
        }
    };

    return Levels;
});

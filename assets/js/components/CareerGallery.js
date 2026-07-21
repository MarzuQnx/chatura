/**
 * CareerGallery - Perfect Masonry Layout Engine
 */
(function () {
    'use strict';

    var PerfectMasonry = {
        generateLayout: function (items, breakpoint) {
            var C = breakpoint === 'lg' ? 5 : (breakpoint === 'md' ? 3 : 1);
            var N = items.length;

            if (C === 1) {
                return items.map(function (item) {
                    var h = (item.featured || item.orientation === 'portrait') ? 2 : 1;
                    return { w: 1, h: h };
                });
            }

            var R = Math.ceil(N / C);
            
            function solve(R) {
                var grid = Array(R).fill(0).map(function() { return Array(C).fill(false); });
                var sizes = [];
                
                function backtrack(idx, currentN) {
                    if (currentN > N) return false;
                    if (idx === R * C) return currentN === N;
                    
                    var y = Math.floor(idx / C);
                    var x = idx % C;
                    
                    if (grid[y][x]) return backtrack(idx + 1, currentN);
                    
                    // Prioritize blocks to create a masonry look. Mix sizes.
                    var blocks = [
                        {w: 2, h: 2},
                        {w: 2, h: 1},
                        {w: 1, h: 2},
                        {w: 1, h: 1}
                    ];
                    // Randomize block order to generate a different layout on every refresh
                    for (var _i = blocks.length - 1; _i > 0; _i--) {
                        var _j = Math.floor(Math.random() * (_i + 1));
                        var _temp = blocks[_i];
                        blocks[_i] = blocks[_j];
                        blocks[_j] = _temp;
                    }
                    
                    // Shuffle blocks slightly for variety, but 2x2 and 2x1/1x2 should be preferred 
                    // if we need to consume more area.
                    // Area remaining to consume: (R * C - idx)
                    // Items remaining to place: N - currentN
                    var cellsRemaining = R * C - idx;
                    for (var i = 0; i < grid.length; i++) {
                        for (var j = 0; j < grid[i].length; j++) {
                            if (i * C + j < idx && !grid[i][j]) cellsRemaining--;
                        }
                    }

                    for (var b = 0; b < blocks.length; b++) {
                        var block = blocks[b];
                        if (x + block.w <= C && y + block.h <= R) {
                            var fits = true;
                            for (var dy = 0; dy < block.h; dy++) {
                                for (var dx = 0; dx < block.w; dx++) {
                                    if (grid[y + dy][x + dx]) fits = false;
                                }
                            }
                            
                            if (fits) {
                                for (var dy = 0; dy < block.h; dy++) {
                                    for (var dx = 0; dx < block.w; dx++) {
                                        grid[y + dy][x + dx] = true;
                                    }
                                }
                                sizes.push(block);
                                
                                if (backtrack(idx + 1, currentN + 1)) return true;
                                
                                sizes.pop();
                                for (var dy = 0; dy < block.h; dy++) {
                                    for (var dx = 0; dx < block.w; dx++) {
                                        grid[y + dy][x + dx] = false;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
                
                if (backtrack(0, 0)) return sizes;
                return null;
            }
            
            var sizes = solve(R);
            while (!sizes && R < N * 2) {
                R++;
                sizes = solve(R);
            }
            
            if (!sizes) {
                return items.map(function() { return {w: 1, h: 1}; });
            }
            
            return sizes;
        }
    };

    window.CareerGallery = PerfectMasonry;
})();

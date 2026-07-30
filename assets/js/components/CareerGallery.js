(function () {
    'use strict';

    var rowPatterns = [
        [2, 2, 1],
        [2, 1, 2],
        [1, 2, 2],
        [2, 1, 1, 1],
        [1, 1, 2, 1],
        [1, 1, 1, 2]
    ];

    function generateLayout(items, columns) {
        if (columns <= 1) {
            var out = [];
            for (var i = 0; i < items.length; i++)
                out.push({ col: 0, row: i, w: 1, h: 1 });
            return out;
        }

        var positions = [];
        var pi = 0;
        var i = 0;

        while (i < items.length) {
            var row = positions.length > 0
                ? positions[positions.length - 1].row + 1
                : 0;
            var remaining = items.length - i;

            if (remaining <= 2) {
                for (var r = 0; r < remaining; r++) {
                    positions.push({ col: r, row: row, w: 1, h: 1 });
                }
                break;
            }

            var matched = false;
            for (var p = 0; p < rowPatterns.length && !matched; p++) {
                var pattern = rowPatterns[(pi + p) % rowPatterns.length];
                if (pattern.length > remaining) continue;

                var sum = 0;
                for (var k = 0; k < pattern.length; k++) sum += pattern[k];
                if (sum !== columns) continue;

                var col = 0;
                for (var k = 0; k < pattern.length; k++) {
                    positions.push({ col: col, row: row, w: pattern[k], h: 1 });
                    col += pattern[k];
                    i++;
                }
                pi = (pi + p + 1) % rowPatterns.length;
                matched = true;
            }

            if (!matched) {
                positions.push({ col: 0, row: row, w: columns, h: 1 });
                i++;
            }
        }

        return positions;
    }

    window.CareerGallery = {
        generateLayout: generateLayout
    };
})();

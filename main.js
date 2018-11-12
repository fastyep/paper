function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let app = new Vue({
    el: '#app',
    data: {
        lines: null,
        squares: null,
        space: null,
        cursor: null,
        nd: null,
        sheet: {
            x: 18,
            y: 30
        },
        sk: {
            st: false,
            nd: false
        }
    },
    methods: {
        click: function (cell) {
            if (this.nd == null)
                return;
            let space = this.space;
            let nd = this.nd;
            let lines = this.lines;
            function subX(y) {
                for (let x = 0; x < space.x; x++) {
                    let l = lines[cell.y + y]
                    if (l) {
                        let c = l[cell.x + x];
                        if (c != null && c.nd == nd)
                            return true;
                    }
                }
                return false;
            }
            function subY(x) {
                for (let y = 0; y < space.y; y++) {
                    let l = lines[cell.y + y]
                    if (l) {
                        let c = l[cell.x + x];
                        if (c != null && c.nd == nd)
                            return true;
                    }
                }
                return false;
            }
            if (!subX(-1) && !subY(-1) && !subX(space.y) && !subY(space.x))
                return;
            for (let y = 0; y < space.y; y++) {
                for (let x = 0; x < space.x; x++) {
                    let c = lines[cell.y + y][cell.x + x];
                    if (c == null || c.nd != null)
                        return;
                }
            }
            for (let y = 0; y < space.y; y++) {
                for (let x = 0; x < space.x; x++) {
                    lines[cell.y + y][cell.x + x].nd = nd;
                }
            }
            this.$forceUpdate();
            this.move();
        },
        move: function () {
            if (this.nd)
                this.sk.st = false;
            else
                this.sk.nd = false;
            this.space = { x: getRandomInt(1, 6), y: getRandomInt(1, 6) };
            this.nd = !this.nd;
        },
        skip: function () {
            if (this.nd == null)
                return;
            this.sk[this.nd ? 'nd' : 'st'] = true;
            if (this.sk.nd && this.sk.st) {
                this.nd = null;
                return;
            }
            this.move();
        },
        rot: function () {
            if (this.nd == null)
                return;
            var tmp = this.space.x;
            this.space.x = this.space.y;
            this.space.y = tmp;
        },
        game: function () {
            this.nd = true;
            this.lines = new Array(this.sheet.y).fill().map((u, y) => new Array(this.sheet.x).fill().map((i, x) => ({ x, y, nd: null })));
            this.squares = this.lines.reduce(function (a, b) { return a.concat(b); });
            this.move();
            this.squares[0].nd = false;
            this.squares[this.squares.length - 1].nd = true;
        }
    },
    mounted: function () {
        this.game();
    }
});
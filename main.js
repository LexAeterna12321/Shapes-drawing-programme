// rysowanie punktu na canvas
function Point(x, y) {
    this.x = x;
    this.y = y;
};
// rysowanie linii na canvas. Posłużono się trójkątem Pitagorejskim "a <sup>2</sup> + b <sup>2</sup> = c <sup>2</sup>"
function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    );
}
// konstruktor Shape przechowuje w tablicy punkty i linie łączące punkty jak własne właściwości
function Shape() {
    this.points = [];
    this.lines = [];
    this.init();
}

Shape.prototype = {
    // ustawienie wskaźnika na konstruktor
    constructor: Shape,
    // inicjowanie, ustawia wskaźnik this.context na obiekt canvas
    init: function () {
        if (typeof this.context === "undefined") {
            var canvas = document.getElementById("canvas");
            Shape.prototype.context = canvas.getContext("2d");
        }
    },
    // metoda rysująca figurę za pomocą pętli przechodzącej przez this.points
    draw: function () {
        var i, ctx = this.context;
        ctx.strokeStyle = this.getColor();
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.closePath();
        ctx.stroke();

    },
    // metoda generująca losowy kolor
    getColor: function () {
        var i, rgb = [];
        for (i = 0; i < 3; i++) {
            rgb[i] = Math.round(255 * Math.random());
        }
        return `rgb(${rgb.join(",")})`
    },
    // metoda, która przechodzi przez tablicę punktow,
    // tworzy instancje Line i dodaje je do this.lines
    getLines: function () {
        if (this.lines.length > 0) {
            return this.lines
        }
        var i, lines = [];
        for (i = 0; i < this.points.length; i++) {
            lines[i] = new Line(this.points[i], this.points[i + 1] || this.points[0]);
        }
        this.lines = lines;
        return lines
    },
    // metoda obliczająca pole powierzchni, implementowana przez poszczególne dzieci
    getArea: function () {},
    // metoda obliczająca obwód poprzez sumowanie długości wszystkich boków(linii)
    getPerimeter: function () {
        var i, perim = 0,
            lines = this.getLines();
        for (i = 0; i < lines.length; i++) {
            perim += lines[i].length;
        }
        return perim
    }
};
// konstruktory obiektów potomnych
function Triangle(a, b, c) {
    this.points = [a, b, c];
    this.getArea = function () {
        var p = this.getPerimeter();
        s = p / 2;
        return Math.sqrt(s * (s - this.lines[0].length) * (s - this.lines[1].length) * (s - this.lines[2].length));
    };
}

function Rectangle(p, side_a, side_b) {
    this.points = [
        p,
        new Point(p.x + side_a, p.y),
        new Point(p.x + side_a, p.y + side_b),
        new Point(p.x, p.y + side_b)
    ];
    this.getArea = function () {
        return side_a * side_b
    };
}

function Square(p, side) {
    Rectangle.call(this, p, side, side);
}

// dziedziczenie łańcucha prototypów
(function () {
    var s = new Shape();
    Triangle.prototype = s;
    Rectangle.prototype = s;
    Square.prototype = s;
})();

// 
// Strefa Testów
//
var p1 = new Point(50, 50);
var p2 = new Point(150, 50);
var p3 = new Point(100, 0);

var t = new Triangle(p1, p2, p3);

t.draw();
console.log(t.getPerimeter());
console.log(t.getArea());

var r = new Rectangle(new Point(100, 120), 25, 45);
r.draw();
console.log(r.getArea());
console.log(r.getPerimeter());

var s = new Square(new Point(70, 75), 25);
s.draw();
console.log(s.getArea());
console.log(s.getPerimeter());

new Square(p1, 100).draw();
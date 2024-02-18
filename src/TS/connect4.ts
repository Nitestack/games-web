class Connect4 {
    constructor() {
        this.clearField();
        const info = document.getElementById("result");
        const columns = document.querySelectorAll(".column");
        for (let i = 0; i < columns.length; i++) {
            columns[i].addEventListener("click", () => {
                if (this.gameOver) return;
                let nextY: number;
                const x = parseInt(columns[i].getAttribute("data-x"));
                for (let y = 0; y < 6; y++) {
                    if (this.gameBoard[x][y] == "free") {
                        nextY = y;
                        break;
                    };
                };
                if (typeof nextY == "undefined") info.textContent = "No free fields in this column!";
                this.gameBoard[x][nextY] = this.players[this.current];
                const circle = document.querySelector('#column-' + x + ' .row-' + nextY + ' circle');
                circle.classList.remove("free");
                circle.classList.add(this.players[this.current]);
                if (this.isWinner(x, nextY)) {
                    this.gameOver = true;
                    info.innerHTML = "<b> " + this.players[this.current].charAt(0).toUpperCase() + this.players[this.current].slice(1) + " </b> wons!";
                    return;
                };
                this.turns++;
                if (this.turns >= 42) {
                    this.gameOver = true;
                    info.textContent = "It's a tie!";
                    return;
                };
                this.current = 1 - this.current;
            });
        };
        document.getElementById("resetField").onclick = () => {
            this.clearField();  
        };
    };
    private gameBoard: object;
    private current: number;
    private players: Array<string> = ["red", "yellow"];
    private turns: number;
    private gameOver: boolean;
    private clearField() {
        this.turns = 0;
        this.gameBoard = {};
        this.current = 0;
        this.gameOver = false;
        document.getElementById("result").textContent = null;
        for (let x = 0; x <= 6; x++) {
            this.gameBoard[x] = {};
            for (let y = 0; y <= 7; y++) this.gameBoard[x][y] = 'free';
        };
        Array.prototype.forEach.call(document.querySelectorAll('circle'), function (piece) {
            piece.setAttribute('class', 'free');
        });
        const circles = document.querySelectorAll("circle");
        for (let i = 0; i < circles.length; i++) {
            if (circles[i].classList.contains("red")) circles[i].classList.remove("red");
            else if (circles[i].classList.contains("yellow")) circles[i].classList.remove("yellow");
            else if (circles[i].classList.contains("free")) continue;
            circles[i].classList.add("free");
        };
    };
    private isWinner(currentX: number, currentY: number) {
        return this.checkDirection(currentX, currentY, 'vertical') || this.checkDirection(currentX, currentY, 'diagonal') || this.checkDirection(currentX, currentY, 'horizontal');
    };
    private isBounds(x: number, y: number) {
        return (this.gameBoard.hasOwnProperty(x) && typeof this.gameBoard[x][y] !== 'undefined');
    };
    private checkDirection(currentX: number, currentY: number, direction: "horizontal" | "vertical" | "diagonal") {
        let chainLength: number = 1;
        const directions: {
            horizontal: Array<Array<number>>,
            vertical: Array<Array<number>>,
            diagonal: Array<Array<number>>
        } = {
            horizontal: [
                [0, -1], [0, 1]
            ],
            vertical: [
                [-1, 0], [1, 0]
            ],
            diagonal: [
                [-1, -1], [1, 1], [-1, 1], [1, -1]
            ]
        };
        for (const coords of directions[direction]) {
            let i = 1;
            while (this.isBounds(currentX + coords[0] * i, currentY + coords[1] * i) && this.gameBoard[currentX + coords[0] * i][currentY + coords[1] * i] == this.players[this.current]) {
                chainLength++;
                i++;
            };
        };
        return (chainLength >= 4);
    };
};

(function () {
    new Connect4();
})();
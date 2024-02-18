type Board = Array<Array<string>>;

class TicTacToe {
    constructor() {
        this.firstTime = true;
        this.opponent = null;
        this.gameMode = null;
        this.current = 0;
        this.availableFields = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        this.players = ["X", "O"];
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        $(".box").each(function () { this.setAttribute("disabled", "true") });
        $("#gameModeSelection").on("change", ev => {
            //Resets the field after selecting game mode
            this.clearField(true);
            //disables boxes
            $(".box").each(function () { if (!this.hasAttribute("disabled")) this.setAttribute("disabled", "disabled"); });
            //@ts-ignore
            if (ev.target.value == "bot") {
                this.opponent = "bot";
                document.getElementById("gameModus").classList.remove("invisible");
                //@ts-ignore
            } else if (ev.target.value == "player") {
                this.opponent = "player";
                if (!document.getElementById("gameModus").classList.contains("invisible")) document.getElementById("gameModus").classList.add("invisible");
                $(".box").each(function () { if (this.hasAttribute("disabled")) this.removeAttribute("disabled"); });
                this.firstTime = false;
            };
        });
        $(".box").on("click", (event) => {
            const { id } = event.target;
            //checks the availablity of a field
            if (!this.availableFields.includes(id)) return;
            //removes the field from the array
            this.availableFields.splice(this.availableFields.indexOf(id), 1);
            const boxElement = document.getElementById(id);
            //sets the field mark 
            this.board[+boxElement.getAttribute("data-row")][+boxElement.getAttribute("data-column")] = this.players[this.current];
            boxElement.textContent = this.players[this.current];
            boxElement.setAttribute("disabled", "disabled");
            boxElement.classList.add(`tictactoe-${this.players[this.current].toLowerCase()}`);
            //changes player turn
            this.current = 1 - this.current;
            if (this.current == 1 && this.opponent == "bot") document.getElementById("info").innerHTML = `It's the <b> bot's </b> turn!`;
            else if (this.current == 0 && this.opponent == "bot") document.getElementById("info").innerHTML = `It's <b> your </b> turn!`;
            else document.getElementById("info").innerHTML = `It's Player's <b> ${this.players[this.current]} </b> turn!`;
            const check = this.checkIfCompleted();
            if (check.winner) {
                if (this.opponent == "bot") {
                    if (check.winner == "X") document.getElementById("info").innerHTML = `<b> You </b> won!`;
                    else document.getElementById("info").innerHTML = `<b> Bot </b> wons!`;
                } else document.getElementById("info").innerHTML = `Player <b> ${check.winner} </b> wons!`;
                //highlightes the winner
                for (const cell of check.cells) {
                    cell.classList.remove("tictactoe-" + check.winner.toLowerCase());
                    cell.classList.add("tictactoe-highlighted");
                };
                //disables boxes
                $(".box").each(function () {
                    if (!this.hasAttribute("disabled")) this.setAttribute("disabled", "disabled");
                });
                return;
            } else if (check.gameBoardFull) {
                document.getElementById("info").innerHTML = "The field is <b> full </b> !";
                //disables boxes
                $(".box").each(function () {
                    if (!this.hasAttribute("disabled")) this.setAttribute("disabled", "disabled");
                });
                return;
            };
            //if the game mode is player vs. bot and the bot is on turn
            if (this.opponent == "bot" && this.current == 1) {
                $(".box").each(function () {
                    if (!this.hasAttribute("disabled")) this.setAttribute("disabled", "disabled");
                });
                setTimeout(() => {
                    this.makeBotMove(this.gameMode);
                    $(".box").each(function () {
                        if (this.hasAttribute("disabled")) this.removeAttribute("disabled");
                    });
                }, 1000);
            };
        });
        $("#resetField").on("click", () => {
            if (this.firstTime) return;
            this.clearField();
        });
        for (const mode of ["easy", "hard"]) $(`#${mode}`).on("click", () => {
            this.gameMode = mode as "easy" | "hard";
            if (this.firstTime) this.firstTime = false;
            document.getElementById("resetField").click();
        });
    };
    private firstTime: boolean;
    private opponent: "bot" | "player";
    private gameMode: "easy" | "hard";
    private current: number;
    private availableFields: Array<string>;
    private players: Array<string>;
    private board: Board;
    /**
     * Makes a bot move
     * @param {string} mode The mode for the bot
     */
    private makeBotMove(mode: "easy" | "hard") {
        const botMoveMaker = (id: string) => {
            const field = document.getElementById(id);
            field.removeAttribute("disabled");
            field.click();
            field.setAttribute("disabled", "disabled");
        };
        if (mode == "easy") botMoveMaker(this.availableFields[Math.floor(Math.random() * (this.availableFields.length - 1))]);
        else {
            const minimaxMove = this.bestMove();
            if (!minimaxMove) return botMoveMaker(this.availableFields[Math.floor(Math.random() * (this.availableFields.length - 1))]);
            const move = `${minimaxMove.row.toString().replace(/0/g, "A").replace(/1/g, "B").replace(/2/g, "C")}${minimaxMove.column + 1}`;
            botMoveMaker(move);
        };
    };
    /**
    * Cleares the game board
    */
    private clearField(firstTimeYes?: boolean) {
        $(".box").each(function () {
            this.textContent = null;
            if (this.hasAttribute("disabled")) this.removeAttribute("disabled");
            if (this.classList.contains("tictactoe-x")) this.classList.remove("tictactoe-x");
            else if (this.classList.contains("tictactoe-o")) this.classList.remove("tictactoe-o");
            else if (this.classList.contains("tictactoe-highlighted")) this.classList.remove("tictactoe-highlighted");
        });
        this.availableFields = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        this.board = [["", "", ""],
        ["", "", ""],
        ["", "", ""]];
        this.current = 0;
        this.firstTime = firstTimeYes ? true : false;
        document.getElementById("info").textContent = null;
    };
    /**
     * Checks if a player wons or if the gameboard is full
     */
    private checkIfCompleted(): {
        winner?: string,
        gameBoardFull: boolean,
        cells?: Array<Element>
    } {
        const fields = document.querySelectorAll('#gameboard button');
        let full = true;
        let winner: string;
        let cells: Array<Element>;
        for (let i = 0; i < fields.length; i++) if (!fields[i].textContent || fields[i].textContent == "") full = false;
        for (let i = 0; i < 3; i++) {
            // 3 senkrecht
            if (this.equals3(fields[0 + i].textContent, fields[3 + i].textContent, fields[6 + i].textContent)) {
                winner = fields[0 + i].textContent;
                cells = [fields[0 + i], fields[3 + i], fields[6 + i]];
            } // 3 waagrecht
            else if (this.equals3(fields[i * 3].textContent, fields[i * 3 + 1].textContent, fields[i * 3 + 2].textContent)) {
                winner = fields[i * 3].textContent;
                cells = [fields[i * 3], fields[i * 3 + 1], fields[i * 3 + 2]];
            };
        };
        // diagonal links oben nach rechts unten
        if (this.equals3(fields[0].textContent, fields[4].textContent, fields[8].textContent)) {
            winner = fields[0].textContent;
            cells = [fields[0], fields[4], fields[8]];
        } // diagonal rechts oben nach links unten
        else if (this.equals3(fields[2].textContent, fields[4].textContent, fields[6].textContent)) {
            winner = fields[2].textContent;
            cells = [fields[2], fields[4], fields[6]];
        };
        return {
            gameBoardFull: full,
            winner: winner,
            cells: cells
        };
    };
    /**
     * Function to compare three values
     * @param {string} a The first value 
     * @param {string} b The second value
     * @param {string} c The third value
     * @returns 
     */
    private equals3(a: string, b: string, c: string) {
        return a && a == b && b == c && a != "";
    };
    /**
     * Searches the best move
     */
    private bestMove(): {
        row: number,
        column: number
    } {
        /**
         * Calculate where next move should take place
         * @param {Array<Array<string>>} board The game board 
         * @param {number} depth The depth limit
         * @param {boolean} isMaximizing If true, it switches the function
         * @info Click [here](https://en.wikipedia.org/wiki/Minimax) to get infos about minimax 
         */
        const minimax = (board: Board, depth: number, isMaximizing: boolean) => {
            /**
             * Checks if there is a winner
             */
            const checkWinner = () => {
                let winner: string;
                for (let i = 0; i < 3; i++) {
                    if (this.equals3(board[i][0], board[i][1], board[i][2])) winner = board[i][0];
                    else if (this.equals3(board[0][i], board[1][i], board[2][i])) winner = board[0][i];
                };
                if (this.equals3(board[0][0], board[1][1], board[2][2])) winner = board[0][0];
                if (this.equals3(board[2][0], board[1][1], board[0][2])) winner = board[2][0];
                let openSpots = 0;
                for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[i][j] == "") openSpots++;
                if (winner == null && openSpots == 0) return "tie";
                else return winner;
            };
            const scores = {
                X: -10,
                O: 10,
                tie: 0,
            };
            let result = checkWinner();
            if (result !== null) return scores[result];
            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let row = 0; row < 3; row++) {
                    for (let column = 0; column < 3; column++) {
                        if (board[row][column] == "") {
                            board[row][column] = "O";
                            let score = minimax(board, depth + 1, false);
                            board[row][column] = "";
                            bestScore = Math.max(score, bestScore);
                        };
                    };
                };
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let row = 0; row < 3; row++) {
                    for (let column = 0; column < 3; column++) {
                        if (board[row][column] == "") {
                            board[row][column] = "X";
                            let score = minimax(board, depth + 1, true);
                            board[row][column] = "";
                            bestScore = Math.min(score, bestScore);
                        };
                    };
                };
                return bestScore;
            };
        };
        let bestScore = -Infinity;
        let move: {
            row: number,
            column: number
        };
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                if (this.board[row][column] == "") {
                    this.board[row][column] = "O";
                    let score = minimax(this.board, 0, false);
                    this.board[row][column] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        move = {
                            row: row,
                            column: column
                        };
                    };
                };
            };
        };
        return move;
    };
};

(function () {
    new TicTacToe();
})();
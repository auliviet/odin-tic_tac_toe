function Players(name, symbol) {

    // Players return value
    return {
        name,
        symbol
    }
}

function Gameboard() {
    const gridSize = 3;
    const board = [];

    // Create the gameboard as a 2D array based on gridSize
    for (i = 0; i < gridSize; i++) {
        board[i] = [];
        for (j = 0; j < gridSize; j++) {
            board[i].push(new Cell());
        }
    }

    // Create the cell objects to fill the board
    function Cell () {
        let value = "";

        function setValue(player) {
            // Check if the cell is empty
            if (value != "") {
                return false;
            }

            // Assign player to the cell
            value = player;
            return true;
        }

        function getValue() {
            return value;
        }

        return {
            // DEBUGGING//
            value,
            // DEBUGGING//
            setValue,
            getValue
        }
    }

    // Add a token from the player
    function addToken(player, row, column) {
        // Validate the row and column input
        if (row > gridSize || column > gridSize) {
            console.log("Not a valid input");
            return false;
        }

        // Validate the cell is empty
        else if (!board[row][column].setValue(player)) {
            console.log("This cell is already taken");
            return false;
        }
        
        // If all inputs are valid, add a token in the selected Cell
        else {
            board[row][column].setValue(player);
            return true;
        }
    }
    
    // Check winning conditions
    function checkWinner() {
        return false;
    }

    // Gameboard return values
    return {
        board,
        addToken,
        checkWinner
    }
}

function GameController() {
    const board = Gameboard();
    
    let player1Name = "Player 1";
    const player1 = Players(player1Name, "X");

    let player2Name = "Player 2";
    const player2 = Players(player2Name, "O");
    
    let activePlayer = player1;

    function switchPlayer() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function printBoard() {
        console.log(board);
    }

    function playRound(row, column) {

        // Validate input if correct
        if (board.addToken(activePlayer, row, column)) {

            // Check for winning condition
            if (board.checkWinner()) {
                console.log(`${activePlayer} wins`);
            }


            // Switch to next player
            switchPlayer();
            printBoard();
            return; 
        }
    }

    // Print the initial board
    printBoard();

    return {
        // DEBUGGING //
        board,
        // DEBUGGING //
        playRound
    }

}

const game = GameController();
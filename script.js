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
        let value = null; 

        function setValue(player) {
            // Check if the cell is empty
            if (value != null) {
                return false;
            }

            // Assign player to the cell
            value = player;
            return true;
        }

        function getValue() {
            return value;
        }

        // Cell return values
        return {
            setValue,
            getValue
        }
    }

    // Add a token from the player
    function addToken(player, row, column) {
        // Validate the row and column input
        if (row >= gridSize || column >= gridSize) {
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

        // Iterate through the rows to check if 3 cells in a row have the same value
        for (let i = 0; i < gridSize; i++) {
            if (board[i][0].getValue() === board[i][1].getValue() &&
                board[i][0].getValue() === board[i][2].getValue() &&
                board[i][0].getValue() != null) {
                return true;
            }
        }

        // Iterate through the columns to check if 3 cells in a row have the same value
        for (let j = 0; j < gridSize; j++) {
            if (board[0][j].getValue() === board[1][j].getValue() &&
                board[0][j].getValue() === board[2][j].getValue() &&
                board[0][j].getValue() != null) {
                return true;
            }
        }

        // Iterate throught the diagonals to check if 3 cells in a row have the same value
        if (board[0][0].getValue() === board[1][1].getValue() &&
            board[0][0].getValue() === board[2][2].getValue() &&
            board[0][0].getValue() != null) {
            return true;
        }
        if (board[0][2].getValue() === board[1][1].getValue() &&
            board[0][2].getValue() === board[2][0].getValue() &&
            board[0][2].getValue() != null) {
            return true;
        }
         
        return false;
    }
    
    // Return the board array
    function getBoard() {
        debuggingBoard = []
        for (i = 0; i < gridSize; i++) {
            debuggingBoard[i] = [];
            for (j = 0; j < gridSize; j++) {
                if (board[i][j].getValue() == null) {
                    debuggingBoard[i].push(board[i][j].getValue());
                }
                else {
                    debuggingBoard[i].push(board[i][j].getValue().symbol); 
                }
                
            }
        }

        return debuggingBoard;
    }

    // Gameboard return values
    return {
        getBoard,
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
        console.log(board.getBoard());
    }

    function playRound(row, column) {

        // Validate input if correct
        if (board.addToken(activePlayer, row, column)) {

            printBoard();

            // Check for winning condition
            if (board.checkWinner()) {
                console.log(`${activePlayer.name} wins`);
                return;
            }


            // Switch to next player
            switchPlayer();
            console.log(`${activePlayer.name}'s turns`)
            return; 
        }
    }

    // Print the initial board
    console.log(`${activePlayer.name}'s turns`)
    printBoard();

    return {
        playRound
    }

}

const game = GameController();
// game.playRound(0,0);
// game.playRound(1,1);
// game.playRound(0,1);
// game.playRound(1,2);
// game.playRound(0,2);

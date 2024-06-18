/*
    - Get player's name from input
*/

function Players(name, symbol) {

    // Players return value
    return {
        name,
        symbol
    }
}

const board = (function(){
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
            return false;
        }

        // Validate the cell is empty
        else if (!board[row][column].setValue(player)) {
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
    

    // Return the board array with the content of each cell
    function getBoard() {
        boardContent = []
        for (i = 0; i < gridSize; i++) {
            boardContent[i] = [];
            for (j = 0; j < gridSize; j++) {
                if (board[i][j].getValue() == null) {
                    boardContent[i].push(board[i][j].getValue());
                }
                else {
                    boardContent[i].push(board[i][j].getValue().symbol); 
                }
                
            }
        }

        return boardContent;
    }

    // BOARD RETURN VALUES
    return {
        getBoard,
        addToken,
        checkWinner
    }

}) ();

const gameController = (function () {
    
    let player1Name = "Player 1";
    const player1 = Players(player1Name, "X");

    let player2Name = "Player 2";
    const player2 = Players(player2Name, "O");
    
    let activePlayer = player1;
    let winner = null;

    // Change active player to let the other player play
    function switchPlayer() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }


    // Add a token on the board from the active player
    function playRound(row, column) {
        // Validate input if correct and no player has won yet
        if (!board.checkWinner() && board.addToken(activePlayer, row, column)) {

            // Check for winning condition
            if (board.checkWinner()) {
                winner = activePlayer.name;
                return;
            }


            // Switch to next player
            switchPlayer();
            return; 
        }
    }

    function getWinner() {
        return winner;
    };

    // GAMECONTROLLER RETURN VALUES
    return {
        playRound,
        getWinner,
        getBoard: board.getBoard
    }

}) ();

const displayController = (function () {

    // Display the board on the HTML
    function displayBoard() {
        const board = gameController.getBoard()
        const boardDiv = document.querySelector(".board");
        boardDiv.textContent = "";

        board.forEach((row, rowIndex) => {
            createRow(row, rowIndex);
        });


        // Create a new row on the grid
        function createRow(row, rowIndex) {
            let boardRow = document.createElement("div");
                boardRow.className = "row";
    
                row.forEach((cell, cellIndex) => {
                    boardRow.append(createCell(rowIndex, cellIndex));
                });
                boardDiv.append(boardRow);
        }
    

        // Create a new cell inside a row
        function createCell(rowIndex, cellIndex) {
            let newCell = document.createElement("div");
            newCell.className = `cell ${rowIndex} ${cellIndex}`;
            newCell.textContent = board[rowIndex][cellIndex];
            newCell.addEventListener("click", eventPlayRound)
            
            return newCell;
        }    
    }
    
    
    function displayWinner() {
        if (gameController.getWinner() != null) {
            let winnerName = gameController.getWinner();
            let winnerDiv = document.querySelector(".winner");
            winnerDiv.textContent = `${winnerName} wins`;
        }
    }

    
    // DISPLAYCONTROLLER EVENT CONTROLLERS

    // Initiate the gameController.playRound function when a user clicks on a cell
    function eventPlayRound(event) {
        let cellClasses = event.target.className.split(" ");
            
        let cellRow = cellClasses[1];
        let cellColumn = cellClasses[2];
        
        gameController.playRound(cellRow, cellColumn);
        
        displayBoard();
        displayWinner();
    }

    return {
        displayBoard
    }

})();

displayController.displayBoard();

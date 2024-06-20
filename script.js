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

    // Reset the board
    function resetBoard() {
        for (i = 0; i < gridSize; i++) {
            for (j = 0; j < gridSize; j++) {
                board[i][j] = new Cell();
            }
        }
    }

    // BOARD RETURN VALUES
    return {
        getBoard,
        addToken,
        checkWinner,
        resetBoard
    }

}) ();

const gameController = (function () {
    
    // Initiate players with default values
    let player1 = {
        name: "Player 1",
        symbol: "X"
    }

    let player2 = {
        name: "Player 2",
        symbol: "O"
    }
    
    let activePlayer = player1;
    let winner = null;

    // Overwrite the default values for player names
    function setPlayerNames(player1Name, player2Name) {
        player1.name = player1Name;
        player2.name = player2Name;
    }


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

                // Set the name of the winning player
                winner = activePlayer.name;
                return;
            }

            // Switch to next player
            switchPlayer();
            return; 
        }
    }


    // Return the name of the winning player
    function getWinner() {
        return winner;
    };
    
    // Reset the winner
    function resetWinner() {
        winner = null;
    }


    // Return the players of the game
    function getPlayers() {
        return {
            player1,
            player2
        }
    }

    // GAMECONTROLLER RETURN VALUES
    return {
        setPlayerNames,
        playRound,
        getWinner,
        resetWinner,
        getPlayers,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard
    }

}) ();

const displayController = (function () {

    // Get the names of the player
    function getPlayerNames() {
        let submitButton = document.querySelector("#submit");
        submitButton.addEventListener("click", (event) => {
            eventSubmitNames(event);

            // Hide the form
            let form = document.querySelector("form");
            form.style.display = "none";

            // Display the board
            let boardWrapper = document.querySelector(".board-wrapper");
            boardWrapper.style.display = "flex";
        });
    }

    // Display the board on the HTML
    function displayBoard() {
        const board = gameController.getBoard()
        const boardDiv = document.querySelector(".board");
        boardDiv.textContent = "";

        board.forEach((row, rowIndex) => {
            createRow(row, rowIndex);
        });

        const winnerDiv = document.createElement("div");
        winnerDiv.className = "winner";
        boardDiv.append(winnerDiv);

        const resetButton = document.querySelector(".reset");
        resetButton.addEventListener("click", eventReset);


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
    
    
    // Display the name of the winner on the HTML
    function displayWinner() {
        if (gameController.getWinner() != null) {
            let winnerName = gameController.getWinner();
            let winnerDiv = document.querySelector(".winner");
            winnerDiv.textContent = `${winnerName} wins`;
            winnerDiv.style.display = "flex";
        }
    }


    // Display players
    function displayPlayers() {
        let players = gameController.getPlayers()

        // Display the players on the page
        for (player in players) {
            let playerDiv = document.querySelector(`.${player}`);
            
            let name = document.createElement("div");
            name.className = "player-name";
            name.textContent = players[player].name;
            playerDiv.append(name);

            let symbol = document.createElement("div");
            symbol.className = "player-symbol";
            symbol.textContent = players[player].symbol;
            playerDiv.append(symbol);
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

    // Get the player's name when submitting the form
    function eventSubmitNames(event) {
        event.preventDefault(); // prevent reloading the page 

        let player1Name = document.querySelector("#player1").value;
        let player2Name = document.querySelector("#player2").value;

        // Display the player names on the page
        gameController.setPlayerNames(player1Name, player2Name);
        displayPlayers();
    }

    // Reset the board
    function eventReset(event) {
        event.preventDefault(); // overwrite the default reset function
        gameController.resetBoard();
        displayBoard();

        // Hide the winner if any
        let winnerDiv = document.querySelector(".winner");
        winnerDiv.style.display = "none";
        gameController.resetWinner();
    }

    getPlayerNames();
    displayBoard();

})();

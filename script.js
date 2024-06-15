function Players(name, symbol) {
    return {
        name,
        symbol
    }
}

function Gameboard() {
    let gridSize = 3;
    let board = [];

    const Cell = function () {
        let player = "";

        return {
            player,
        }
    }

    // Create the gameboard
    for (i = 0; i < gridSize; i++) {
        board[i] = [];
        for (j = 0; j < gridSize; j++) {
            board[i].push(new Cell());
        }
    }
    

    return {
        board
    }
}

function GameController() {

    const board = Gameboard();

    console.log(board);

}

GameController();
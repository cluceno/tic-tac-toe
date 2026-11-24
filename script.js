const board = document.querySelector(".board");
const gameStatus = document.querySelector(".gameStatus");
const reset = document.querySelector(".reset");
const dialog = document.querySelector(".names-dialog");
const form = dialog.querySelector("form");
const p1Input = document.querySelector("#p1-name");
const p2Input = document.querySelector("#p2-name");

function newGame(playerOne, playerTwo){
    let gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    let moveCounter = 0;
    let winner = false;

    const winningScenarios = [
        [[0, 0], [0, 1], [0, 2]], //1st row
        [[1, 0], [1, 1], [1, 2]], //2nd row
        [[2, 0], [2, 1], [2, 2]], //3rd row
        [[0, 0], [1, 0], [2, 0]], //1st column
        [[0, 1], [1, 1], [2, 1]], //2nd column
        [[0, 2], [1, 2], [2, 2]], //3rd column
        [[0, 0], [1, 1], [2, 2]], // Diagonal to bottom right
        [[0, 2], [1, 1], [2, 0]], // Diagonal to bottom left
    ];

    const checkWinner = () => {
        for (const line of winningScenarios) {
            const first = gameBoard[line[0][0]][line[0][1]];
            const second = gameBoard[line[1][0]][line[1][1]];
            const third = gameBoard[line[2][0]][line[2][1]];

            if (first !== "" && first === second && second === third) {
                winner = true;
                const winnerName = first === "X"? playerOne.name : playerTwo.name;
                gameStatus.textContent = `${winnerName} is the winner`;
                return first;
            } 
        }
        return null;
    }

    const setGameBoard = (x, y) => {
        //check if there is a winner or if there is a tie
        if (winner === true || moveCounter >= 9) return;
        //check if the spot is already taken 
        if (gameBoard[x][y] !== "") return;

        const mark = moveCounter % 2 === 0? "X" : "0";
        gameBoard[x][y] = mark;
        moveCounter++;

        checkWinner();
        
        //check if there is a tie
        if (moveCounter >= 9 && winner === false) {
            gameStatus.textContent = "It's a tie!"
        }
    }

    const getGameBoard = () => gameBoard;

    return {
        getGameBoard,
        setGameBoard,
    }
}

// Render game on load 

function renderGame() {
    let gameBoard = game.getGameBoard();

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.column = j;
            cell.textContent = gameBoard[i][j];
            board.appendChild(cell);
        }
    }   
}   

// Make grid buttons playable 

board.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    board.textContent = "";

    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.column);

    game.setGameBoard(row, col);
    renderGame();
})

// Configure buttons

let game;
let playerOne;
let playerTwo;

function newPlayer(name) {

    return {
        name: name,
    }
}

reset.addEventListener("click", () => {
    if (reset.textContent === "Start") {
        dialog.showModal();
    } else {
        // Clear board and rerender
        board.textContent = "";
        game = newGame(playerOne, playerTwo);
        renderGame();

        gameStatus.textContent = "";
    }
})

form.addEventListener("submit", () => {
    playerOne = newPlayer(p1Input.value);
    playerTwo = newPlayer(p2Input.value);

    game = newGame(playerOne, playerTwo);
    gameStatus.textContent = "";
    renderGame();

    reset.textContent = "Reset";
    form.reset();
})


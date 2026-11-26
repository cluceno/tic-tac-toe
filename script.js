

function gameBoard() {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    const setGameBoard = (row, col, mark) => {
        if (board[row][col] !== "") return false;
        board[row][col] = mark;
        return true;
    }

    const getGameBoard = () => board;

    return {
        setGameBoard,
        getGameBoard,
    }
}

function controller(playerOne, playerTwo) {
    const board = gameBoard();

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

    const placeMark = (row, col) => {
        // 1. Game already over?
        if (winner || moveCounter >= 9) return {result: "invalid"};

        // 2. Try to place the mark
        const mark = moveCounter % 2 === 0? "X" : "O";
        const move = board.setGameBoard(row, col, mark);
        if (!move) return {result: "invalid"};

        moveCounter++;

        // 3. Did that move win? 
        const winningMark = checkWinner();
        if (winningMark) {
            winner = true;
            const winnerName = winningMark === "X"? playerOne.name : playerTwo.name;
            return {result: "win", winnerName: winnerName};
        }

        // 4. Board full with no winner? 
        if (moveCounter === 9) return {result: "tie"};

        // 5. Game continues
        return {result: "next"};
    }

    const checkWinner = () => {
        const current = board.getGameBoard();

        for (const line of winningScenarios) {
            const first = current[line[0][0]][line[0][1]];
            const second = current[line[1][0]][line[1][1]];
            const third = current[line[2][0]][line[2][1]];

            if (first !== "" && first === second && second === third) {
                return first;
            } 
        }
        return null;
    }

    return {
        placeMark,
        getBoard: () => board.getGameBoard(),
    }

}

function newPlayer(name) {
  return { name: name };
}

const displayController = (function () {
  const board = document.querySelector(".board");
  const gameStatus = document.querySelector(".gameStatus");
  const reset = document.querySelector(".reset");
  const dialog = document.querySelector(".names-dialog");
  const form = dialog.querySelector("form");
  const p1Input = document.querySelector("#p1-name");
  const p2Input = document.querySelector("#p2-name");

  let game;
  let playerOne;
  let playerTwo;

  function renderGame() {
    board.textContent = ""; // clear the old buttons first

    const gameBoard = game.getBoard(); // read from the stored controller

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

    function showResult(outcome) {
        if (outcome.result === "win") {
            gameStatus.textContent = `${outcome.winnerName} is the winner`;
        } else if (outcome.result === "tie") {
            gameStatus.textContent = "It's a tie!";
        }
  // "next" and "invalid": nothing to announce
    }

  // listeners go here

    board.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") return;

        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.column);

        const outcome = game.placeMark(row, col);
        renderGame();
        showResult(outcome);
    });

    function startGame() {
        game = controller(playerOne, playerTwo);
        gameStatus.textContent = "";
        renderGame();
    }

    reset.addEventListener("click", () => {
        if (reset.textContent === "Start") {
            dialog.showModal();
        } else {
            startGame();
        }
    });

    form.addEventListener("submit", () => {
        playerOne = newPlayer(p1Input.value);
        playerTwo = newPlayer(p2Input.value);
        startGame();
        reset.textContent = "Reset";
        form.reset();
    });

})();
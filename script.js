
function newGame(){
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
                console.log(`${first} is the winner`)
                winner = true;
                return first; //X or O 
            }
        }
        return null;
    }

    const setGameBoard = (x, y) => {
        //check if there is a winner or if there is a tie
        if (winner === true || moveCounter >= 9) return;
        //check if the spot is already taken 
        if (gameBoard[x][y] !== "") return;

        if (moveCounter % 2) {
            moveCounter++;
            gameBoard[x][y] = "O";
            console.table(gameBoard);
            checkWinner();

        } else {
            moveCounter++;
            gameBoard[x][y] = "X";
            console.table(gameBoard);
            checkWinner();
        }
        
        //check if there is a tie
        if (moveCounter >= 9 && winner === false) return console.log("It's a tie!");

    }

    const getGameBoard = () => gameBoard;

    return {
        getGameBoard,
        setGameBoard,
    }
}

function newPlayer(name) {

    return {
        name: name,
    }
}

console.table(newGame().getGameBoard());

const playerOne = newPlayer("Player One");
const playerTow = newPlayer("Player Two");

console.log(playerOne.name);

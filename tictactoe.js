document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const resetButton = document.getElementById('resetButton');
    const newGameButton = document.getElementById('newGameButton');

    let currentPlayer = 'X';
    let gameActive = true;
    const boardState = Array(9).fill(null);
    let onePlayerMode = false;

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Retrieve the number of players from localStorage
    const numPlayers = localStorage.getItem('numPlayers');
    if (numPlayers === '1') {
        onePlayerMode = true;
    }

    // Handle a cell click event, making a move and checking for a winner or a tie
    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = cell.getAttribute('data-index');

        // Ignore the click if the cell is already filled or the game is inactive
        if (boardState[cellIndex] !== null || !gameActive) {
            return;
        }

        makeMove(cell, cellIndex, currentPlayer);

        if (checkWinner()) {
            gameStatus.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            launchConfetti();
        } else if (boardState.every(cell => cell !== null)) {
            gameStatus.textContent = 'It\'s a tie!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            if (onePlayerMode && currentPlayer === 'O' && gameActive) {
                computerMove();
            }
        }
    }

    // Make a move on the board
    function makeMove(cell, cellIndex, player) {
        boardState[cellIndex] = player;
        cell.textContent = player;
    }

    // Handle the computer's move in single-player mode
    function computerMove() {
        const emptyCells = boardState.reduce((acc, val, index) => {
            if (!val) acc.push(index);
            return acc;
        }, []);
        
        const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(cells[move], move, 'O');

        if (checkWinner()) {
            gameStatus.textContent = 'O wins!';
            gameActive = false;
            launchConfetti();
        } else {
            currentPlayer = 'X';
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    // Check if there's a winner based on the current board state
    function checkWinner() {
        return winConditions.some(condition => {
            return condition.every(index => {
                return boardState[index] === currentPlayer;
            });
        });
    }

    // Reset the game state to start a new game
    function resetGame() {
        currentPlayer = 'X';
        gameActive = true;
        boardState.fill(null);
        cells.forEach(cell => cell.textContent = '');
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Start a new game by clearing the number of players and redirecting to the main page
    function newGame() {
        localStorage.removeItem('numPlayers');
        window.location.href = 'index.html';
    }

    // Attach event listeners to the cells and buttons
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
});

// Function to launch confetti animation when a player wins
function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

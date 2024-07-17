document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const restartButton = document.getElementById('restart-btn');
    const playerVsPlayerButton = document.getElementById('player-vs-player-btn');
    const playerVsAIButton = document.getElementById('player-vs-ai-btn');

    let currentPlayer = 'X';
    let gameActive = false; // Initially not active until mode selected
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentMode = 'player-vs-player';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add('occupied');

        if (checkWin()) {
            gameActive = false;
            statusMessage.textContent = `${currentPlayer} wins!`;
            haltGameInputs();
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            statusMessage.textContent = 'It\'s a draw!';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `${currentPlayer}'s turn`;

        if (currentMode === 'player-vs-ai' && currentPlayer === 'O') {
            setTimeout(makeAIMove, 1000); // AI makes move after a delay
        }
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function checkDraw() {
        return gameState.every(cell => {
            return cell !== '';
        });
    }

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusMessage.textContent = `${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('occupied');
        });

        if (currentMode === 'player-vs-ai' && currentPlayer === 'O') {
            setTimeout(makeAIMove, 1000); // AI makes move after a delay
        }
    }

    function startPlayerVsPlayerGame() {
        currentMode = 'player-vs-player';
        gameActive = true;
        restartGame();
    }

    function startPlayerVsAIGame() {
        currentMode = 'player-vs-ai';
        gameActive = true;
        restartGame();
    }

    function makeAIMove() {
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        const aiMoveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[aiMoveIndex] = currentPlayer;
        cells[aiMoveIndex].textContent = currentPlayer;
        cells[aiMoveIndex].classList.add('occupied');

        if (checkWin()) {
            gameActive = false;
            statusMessage.textContent = `${currentPlayer} wins!`;
            haltGameInputs();
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            statusMessage.textContent = 'It\'s a draw!';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `${currentPlayer}'s turn`;
    }

    function haltGameInputs() {
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);
    playerVsPlayerButton.addEventListener('click', startPlayerVsPlayerGame);
    playerVsAIButton.addEventListener('click', startPlayerVsAIGame);
});

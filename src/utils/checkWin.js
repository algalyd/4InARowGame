/**
 * Checks for a horizontal win condition for a specific player.
 * @param {Array<Array>} board - The game board represented as a 2D array.
 * @param {string|number} player - The player identifier to check for a win.
 * @returns {boolean} True if a horizontal win is found for the player, otherwise false.
 */
const checkHorizontalWin = (board, player) => {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row][col + 1] === player && board[row][col + 2] === player && board[row][col + 3] === player) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Checks for a vertical win condition for a specific player.
 * @param {Array<Array>} board - The game board represented as a 2D array.
 * @param {string|number} player - The player identifier to check for a win.
 * @returns {boolean} True if a vertical win is found for the player, otherwise false.
 */
const checkVerticalWin = (board, player) => {
    for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 3; row++) {
            if (board[row][col] === player && board[row + 1][col] === player && board[row + 2][col] === player && board[row + 3][col] === player) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Checks for a diagonal win from bottom left to top right for a specific player.
 * @param {Array<Array>} board - The game board represented as a 2D array.
 * @param {string|number} player - The player identifier to check for a win.
 * @returns {boolean} True if a diagonal (bottom left to top right) win is found for the player, otherwise false.
 */
const checkDiagonalRightToLeftWin = (board, player) => {
    for (let row = 3; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row - 1][col + 1] === player && board[row - 2][col + 2] === player && board[row - 3][col + 3] === player) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Checks for a diagonal win from top left to bottom right for a specific player.
 * @param {Array<Array>} board - The game board represented as a 2D array.
 * @param {string|number} player - The player identifier to check for a win.
 * @returns {boolean} True if a diagonal (top left to bottom right) win is found for the player, otherwise false.
 */
const checkDiagonalLeftToRightWin = (board, player) => {
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row + 1][col + 1] === player && board[row + 2][col + 2] === player && board[row + 3][col + 3] === player) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Combines all directional win checks to determine if a specific player has won.
 * @param {Array<Array>} board - The game board represented as a 2D array.
 * @param {string|number} player - The player identifier to check for a win.
 * @returns {boolean} True if a win is detected in any direction for the player, otherwise false.
 */
const checkWin = (board, player) => {
    return checkHorizontalWin(board, player) || checkVerticalWin(board, player) || checkDiagonalRightToLeftWin(board, player) || checkDiagonalLeftToRightWin(board, player);
};



export default checkWin;


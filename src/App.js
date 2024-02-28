import React from "react";
import './App.css';
import backgroundPhoto from './photos/backgroundPhoto.jpg';
import { playerColors, SCREENS } from './constants';
import checkWin from './utils/checkWin.js';
import mouseClick from './voices/mouseClick.mp3';
import winSound from './voices/winSound.wav';



class App extends React.Component {

    state = {
        currentScreen: SCREENS.OPENING,
        showMenu: false,
        player1Color: null,
        player2Color: null,
        previousScreen: null,
        gameMode: null,
        width: 7,
        height: 6,
        gameBoard: Array(6).fill(Array(7).fill(null)), // Initialize a 6x7 board with null values
        currentPlayer: 1, // 1 for player 1, 2 for player 2 or computer
        winner: null, // Track the winner (null, 1, or 2)
        victory : false,
        computerTurn : false,
        draw : false,
    };

    playMouseClickSound = () => {
        const audio = new Audio(mouseClick);
        audio.play();
    };

    playWinSound = () => {
        const audio = new Audio(winSound);
        audio.play();
    };

    startGame = () => {
        this.setState({ previousScreen: this.state.currentScreen, currentScreen: SCREENS.COLOR_SELECTION });
    };

    toggleMenu = () => {
        this.setState(prevState => ({ showMenu: !prevState.showMenu }));
    };

    goToStart = () => {
        this.setState({
            currentScreen: SCREENS.OPENING,
            width: 7,
            height: 6,
            showMenu: false,
            player1Color: null,
            player2Color: null,
            previousScreen: null,
            gameMode: null,
            gameBoard: Array(6).fill(Array(7).fill(null)),
            currentPlayer: 1,
            victory: false, // Reset victory to hide the victory screen
            winner: null,
            victoryMessage: '',
            // Reset any other state as needed
        });
    };


    continueGame = () => {
        this.setState({ showMenu: false });
    };

    selectColor = (player, color) => {
        if (player === 1) {
            this.setState({ player1Color: color });
        } else {
            this.setState({ player2Color: color });
        }
    };

    // Method to handle returning to the previous screen
    returnToPreviousScreen = () => {
        // Check if the current screen is the game screen and if a game is in progress or has just ended.
        if (this.state.currentScreen === SCREENS.GAME && (this.state.victory || this.state.gameBoard.some(row => row.some(cell => cell !== null)))) {
            // If the game is in progress or has just ended, reset the game state.
            this.restartGame();
        }

        // Then, return to the previous screen as originally intended.
        this.setState(prevState => ({
            currentScreen: prevState.previousScreen,
            showMenu: false,
            previousScreen: null,
        }));
    };


    selectGameMode = (mode) => {

        this.setState({
            previousScreen: SCREENS.GAME_MODE_SELECTION,
            currentScreen: SCREENS.GAME,
            gameMode: mode,
        });
    };

    renderColorSelection() {
        const { player1Color, player2Color } = this.state;
        return (
            <div>
                <h2 className="headerTitle">Select Colors</h2>
                <div>
                    <h3 className="headerTitle">Player 1</h3>
                    {playerColors.map((color) => (
                        <button
                            key={color}
                            disabled={color === player2Color}
                            onClick={() => this.selectColor(1, color)}
                            style={{backgroundColor: color.toLowerCase(), color: 'white', margin: '5px'}}
                        >
                            {color}
                        </button>
                    ))}
                </div>
                <div>
                    <h3 className="headerTitle">Player 2</h3>
                    {playerColors.map((color) => (
                        <button
                            key={color}
                            disabled={color === player1Color}
                            onClick={() => this.selectColor(2, color)}
                            style={{backgroundColor: color.toLowerCase(), color: 'white', margin: '5px'}}
                        >
                            {color}
                        </button>
                    ))}
                </div>
                <button
                    className="continueButton"
                    disabled={!player1Color || !player2Color}
                    onClick={() => {
                        this.setState({
                            previousScreen: SCREENS.COLOR_SELECTION,
                            currentScreen: SCREENS.BOARD_SIZE_SELECTION,
                        })
                    }
                    }
                >
                    Continue
                </button>

            </div>
        );
    }

    renderMenu() {
        if (this.state.showMenu) {
            return (
                <div className="menu">
                    <button onClick={this.goToStart}>Go to Start</button>
                    {this.state.previousScreen && (
                        <button onClick={this.returnToPreviousScreen}>Return to the previous screen</button>
                    )}
                    <button onClick={this.continueGame}>Continue</button>
                </div>
            );
        }
        return null;
    }

    renderScreen() {
        switch (this.state.currentScreen) {
            case SCREENS.OPENING:
                return (
                    <>
                        <div className="welcomeMessage">Welcome to 4 in a Row Game!</div>
                        <button className="startGameButton" onClick={this.startGame}>Start Game</button>
                    </>
                );
            case SCREENS.COLOR_SELECTION:
                return this.renderColorSelection();
            case SCREENS.BOARD_SIZE_SELECTION:
                return this.renderBoardSizeSelectionScreen();
            case SCREENS.GAME_MODE_SELECTION:

                return this.renderGameModeSelection();
            case SCREENS.GAME:
                return (
                    <div>
                        {this.renderGameBoard()}
                    </div>
                );
            default:
                return <div>Unknown Screen</div>;
        }
    }

    renderGameModeSelection() {
        return (
            <div className="gameModeSelectionScreen">
                <button
                    className="gameModeButton"
                    onClick={() => this.selectGameMode('computer')}>
                    Play against a computer
                </button>
                <button
                    className="gameModeButton"
                    onClick={() => this.selectGameMode('friend')}>
                    Play against a friend
                </button>
            </div>
        );
    }


    updateBoardSize = (width, height) => {
        const newBoard = Array(height).fill(Array(width).fill(null)); // Create a new board with the specified dimensions
        this.setState({
            width: width,
            height: height,
            gameBoard: newBoard,
        });
    };


    renderBoardSizeSelectionScreen() {
        return (
            <div className="container">
                <h3 className="headerTitle">Choose Game Board Width and Height</h3>
                <div className="inputPanel">
                    <label htmlFor="boardWidth" className="label">Board Width:</label>
                    <input
                        id="boardWidth"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Width"
                        defaultValue="7"
                        ref={(input) => (this.boardWidth = input)}
                        className="input"
                    />
                    <span>Width: {this.boardWidth ? this.boardWidth.value : '7'}</span>
                </div>
                <div className="inputPanel">
                    <label htmlFor="boardHeight" className="label">Board Height:</label>
                    <input
                        id="boardHeight"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Height"
                        defaultValue="6"
                        ref={(input) => (this.boardHeight = input)}
                        className="input"
                    />
                    <span>Height: {this.boardHeight ? this.boardHeight.value : '6'}</span>
                </div>
                <button
                    className="continueButton"
                    onClick={() => {
                        const width = parseInt(this.boardWidth.value, 10);
                        const height = parseInt(this.boardHeight.value, 10);

                        if (width >= 1 && width <= 10 && height >= 1 && height <= 10) {
                            this.updateBoardSize(width, height);
                            this.setState({
                                previousScreen: SCREENS.BOARD_SIZE_SELECTION,
                                currentScreen: SCREENS.GAME_MODE_SELECTION,
                            });
                        } else {
                            alert("Please enter values between 1 and 10 for both width and height.");
                        }
                    }}
                >
                    Continue
                </button>
            </div>
        );
    }


    handleColumnClick = (columnIndex) => {
        // If the game is not won and it's not the computer's turn, proceed with the move
        if (!this.state.victory && !this.state.computerTurn) {
            this.makeMove(columnIndex);
        }

        // After making a move, check if the game is in "computer" mode and it's the computer's turn
        if (this.state.gameMode === 'computer' && this.state.currentPlayer === 2 && !this.state.victory) {
            // Set the state to indicate it's the computer's turn
            this.setState({ computerTurn: true });

            // Use a timeout to simulate thinking delay for the computer's move
            setTimeout(() => {
                // Before executing the computer's move, check again if the game hasn't been won
                // This is to prevent the computer from making a move after the game is over
                if (!this.state.victory) {
                    this.makeComputerMove();
                    // After making a move, reset the computerTurn flag
                    this.setState({ computerTurn: false });
                }
            }, 3000); // Adjust the delay as needed
        }
    };

    isBoardFull = () => {
        // Check if every cell in the top row is not null
        return this.state.gameBoard[0].every(cell => cell !== null);

    };

    makeMove = (columnIndex) => {
        // If the game is already won, no further moves should be processed.
        if (this.state.victory) {
            return;
        }

        let moveMade = false;
        const newGameBoard = this.state.gameBoard.map(row => [...row]); // Create a deep copy of the game board

        // Attempt to place the current player's piece in the specified column
        for (let rowIndex = this.state.gameBoard.length - 1; rowIndex >= 0; rowIndex--) {
            if (newGameBoard[rowIndex][columnIndex] === null) {
                newGameBoard[rowIndex][columnIndex] = this.state.currentPlayer;
                moveMade = true;
                break; // Exit once the move is made
            }
        }

        // Proceed only if a move was successfully made
        if (moveMade) {
            this.setState({ gameBoard: newGameBoard }, () => {
                const hasWon = checkWin(newGameBoard, this.state.currentPlayer);
                const boardFull = this.isBoardFull(newGameBoard);

                if (hasWon) {
                    this.playWinSound();
                    const victoryMessage = this.state.gameMode === 'friend' ?
                        `Player ${this.state.currentPlayer} wins!` :
                        (this.state.currentPlayer === 1 ? "You won!" : "The computer won.");
                    this.setState({
                        victory: true,
                        winner: this.state.currentPlayer,
                        victoryMessage: victoryMessage,
                    });
                } else if (boardFull) {

                    this.setState({
                        victory : true,
                        draw: true,
                        victoryMessage: "The game is a draw.",
                    });
                } else {
                    // If no win or draw, switch players and possibly trigger the computer's turn
                    this.setState(prevState => ({
                        currentPlayer: prevState.currentPlayer === 1 ? 2 : 1,
                    }), () => {
                        if (this.state.gameMode === 'computer' && this.state.currentPlayer === 2 && !this.state.victory) {
                            this.triggerComputerTurn();
                        }
                    });
                }
            });
        }
    };


    triggerComputerTurn = () => {
        this.setState({ computerTurn: true });
        setTimeout(() => {
            if (!this.state.victory) {
                this.makeComputerMove();
                this.setState({ computerTurn: false });
            }
        }, 3000); // Adjust delay as needed, ensuring it's only called when conditions are met
    };

    restartGame = () => {
        this.setState({
            gameBoard: Array(this.state.height).fill(Array(this.state.width).fill(null)),
            currentPlayer: 1, // Assuming the player always starts
            victory: false,
            winner: null,
            victoryMessage: '',
            computerTurn: false, // Ensure computerTurn is reset so the computer doesn't start
            draw : false,
        });
    };


    renderVictoryScreen() {
        if (this.state.victory || this.state.draw) {
            return (
                <div>
                    <h3 className={"headerTitle"}>{this.state.victoryMessage}</h3>
                    <button className="button newGameButton" onClick={this.restartGame}>Start New Game</button>
                    <button className="button mainMenuButton" onClick={this.goToStart}>Return to Main Menu</button>
                </div>
            );
        }
        return null;
    }

    makeComputerMove = () => {
        let columnIndex;
        let isValidMove = false;
        while (!isValidMove) {
            columnIndex = Math.floor(Math.random() * this.state.gameBoard[0].length);
            isValidMove = this.state.gameBoard.some(row => row[columnIndex] === null);
        }

        this.makeMove(columnIndex);
        // No need to explicitly switch back to the player's turn here, as it's already handled in makeMove
    };

    renderGameBoard = () => {
        const { gameBoard, player1Color, player2Color, currentPlayer, gameMode } = this.state;
        // Determine the player's turn message
        let turnMessage = "";
        if (!this.state.victory) {
            if (gameMode === "computer") {
                turnMessage = currentPlayer === 1 ? "Your turn" : "Computer's turn";
            } else { // Assuming gameMode === "friend"
                turnMessage = `Player ${currentPlayer}'s turn`;
            }
        }
        else {
            turnMessage = ``;
        }

        return (
            <>
                <div className="turnIndicator headerTitle">{turnMessage}</div>
                <div className="gameBoard">
                    {gameBoard.map((row, rowIndex) => (
                        <div key={rowIndex} className="gameRow">
                            {row.map((cell, cellIndex) => (
                                <div key={cellIndex} className="gameCell"
                                     onClick={() => {
                                         if (!this.state.victory && !this.state.computerTurn) {
                                             this.handleColumnClick(cellIndex);
                                             this.playMouseClickSound();
                                         }
                                     }}
                                >
                                    {cell !== null && (
                                        <div
                                            className={`circle player${cell}`}
                                            style={{backgroundColor: cell === 1 ? player1Color.toLowerCase() : player2Color.toLowerCase()}}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        );
    };

    render() {
        const backgroundStyle = { backgroundImage: `url(${backgroundPhoto})` };

        return (
            <div className="background" style={backgroundStyle}>
                {this.state.currentScreen !== SCREENS.OPENING && (
                    <div className="buttonContainer">
                        <button className="menuButton" onClick={this.toggleMenu}>Menu</button>
                    </div>
                )}
                {this.renderMenu()}
                {/* Render the victory screen when applicable, ideally before or after the main game UI */}
                {this.state.victory && this.renderVictoryScreen()}
                {this.renderScreen()}
            </div>
        );
    }

}

export default App;
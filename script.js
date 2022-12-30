// DOM Manipulation

// get player names and start button
const startButton = document.querySelector('#start');
const player1 = document.querySelector('#player1');
const player2 = document.querySelector('#player2');

// get notice and notice text and button
const notice = document.querySelector('#notice');
const noticeText = document.querySelector('#notice-text');
const noticeButton = document.querySelector('.delete');

const slots = document.querySelectorAll('.slot');
const player1Name = document.querySelector('#player1-name');
const player2Name = document.querySelector('#player2-name');
const turnName = document.querySelector('#turn-name');
const names = document.querySelector('#names');
const board = document.querySelector('#board');
const scoreboard = document.querySelector('#scoreboard');
const resetButton = document.querySelector('#reset');
const againButton = document.querySelector('#again');
const player1Score = document.querySelector('#player1-score');
const player2Score = document.querySelector('#player2-score');
const turnMsg = document.querySelector('#turn-msg');

// Player name Validation
const validateName = (name) => {
  if (name === '') {
    return false;
  }
  return true;
};

// Tic Tac Toe Game Logic

// Board Module Pattern
const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => board;
  const setBoard = (index, player) => {
    board[index] = player;
  };
  const reset = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    // take out the classes from the slots to reset the colors
    slots.forEach((slot) => {
      slot.classList.remove('has-text-success');
      slot.classList.remove('has-text-info');
    });
  };
  return { getBoard, setBoard, reset };
})();

// Player Factory Function
const player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  const setName = (newName) => {
    name = newName;
  };
  let score = 0;
  const getScore = () => score;
  const setScore = () => {
    score += 1;
  };
  const resetScore = () => {
    score = 0;
  };
  return {
    getName,
    getSymbol,
    setName,
    getScore,
    setScore,
    resetScore,
  };
};

// Game Module Pattern
const game = (() => {
  let player1 = player('Player 1', 'O');
  let player2 = player('Player 2', 'X');
  let gameOver = false;
  const getGameOver = () => gameOver;
  const setGameOver = (value) => {
    gameOver = value;
  };
  let currentPlayer = player1;
  const getCurrentPlayer = () => currentPlayer;
  const setCurrentPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };
  const setPlayer1Name = (name) => {
    player1 = player(name, 'O');
  };
  const setPlayer2Name = (name) => {
    player2 = player(name, 'X');
  };
  const resetCurrentPlayer = () => {
    currentPlayer = player1;
  };
  return {
    getCurrentPlayer,
    setCurrentPlayer,
    getGameOver,
    setGameOver,
    setPlayer1Name,
    setPlayer2Name,
    player1,
    player2,
    resetCurrentPlayer,
  };
})();

// Game Logic
const checkWinner = () => {
  const board = gameBoard.getBoard();
  if (
    (board[0] === board[1] && board[1] === board[2] && board[0] !== '')
    || (board[3] === board[4] && board[4] === board[5] && board[3] !== '')
    || (board[6] === board[7] && board[7] === board[8] && board[6] !== '')
    || (board[0] === board[3] && board[3] === board[6] && board[0] !== '')
    || (board[1] === board[4] && board[4] === board[7] && board[1] !== '')
    || (board[2] === board[5] && board[5] === board[8] && board[2] !== '')
    || (board[0] === board[4] && board[4] === board[8] && board[0] !== '')
    || (board[2] === board[4] && board[4] === board[6] && board[2] !== '')
  ) {
    game.setGameOver(true);
    return true;
  }
  return false;
};

// Render Module Pattern
const render = (() => {
  const now = () => {
    const board = gameBoard.getBoard();
    slots.forEach((slot, index) => {
      slot.textContent = board[index];
      if (slot.textContent === 'X') {
        slot.classList.add('has-text-success');
      } else if (slot.textContent === 'O') {
        slot.classList.add('has-text-info');
      }
    });
  };
  return { now };
})();

// Add event listener to notice button
noticeButton.addEventListener('click', () => {
  notice.classList.add('is-hidden');
});

// Add event listener to start button
startButton.addEventListener('click', () => {
  if (validateName(player1.value) && validateName(player2.value)) {
    // reset notice
    notice.classList.add('is-hidden');
    noticeText.textContent = '';

    // hide names and show board
    names.classList.add('is-hidden');
    scoreboard.classList.remove('is-hidden');
    board.classList.remove('is-hidden');

    // set player names in DOM
    player1Name.textContent = player1.value;
    player2Name.textContent = player2.value;

    // set turn
    turnName.textContent = player1.value;

    // set player names in game
    game.player1.setName(player1.value);
    game.player2.setName(player2.value);
    game.setGameOver(false);
    game.setCurrentPlayer();
  } else {
    // show notice
    notice.classList.remove('is-hidden');
    noticeText.textContent = 'Name cannot be empty';
  }
});

// Add event listener to slots
slots.forEach((slot) => {
  slot.addEventListener('click', () => {
    if (!game.getGameOver()) {
      if (slot.textContent === '') {
        // reset notice
        notice.classList.add('is-hidden');
        noticeText.textContent = '';

        // set slot
        const index = slot.id - 1;
        const player = game.getCurrentPlayer();
        gameBoard.setBoard(index, player.getSymbol());
        render.now();

        // change player
        game.setCurrentPlayer();

        // set turn
        turnName.textContent = player.getName();

        // check winner
        if (checkWinner()) {
          // show winner
          turnName.textContent = game.getCurrentPlayer().getName();
          game.getCurrentPlayer().setScore();
          player1Score.textContent = game.player1.getScore();
          player2Score.textContent = game.player2.getScore();
          turnMsg.textContent = ' wins!';
        } else if (gameBoard.getBoard().every((slot) => slot !== '')) {
          // show notice
          turnMsg.textContent = 'Draw!';
          turnName.textContent = '';
          game.setGameOver(true);
        } else {
          // show turn
          turnMsg.textContent = 'it\'s your turn!';
        }
      }
    }
  });
});

// Add event listener to reset button
resetButton.addEventListener('click', () => {
  // reset notice
  notice.classList.add('is-hidden');
  noticeText.textContent = '';

  // reset board
  gameBoard.reset();
  render.now();

  // reset game
  game.setGameOver(false);
  game.resetCurrentPlayer();
  turnMsg.textContent = 'it\'s your turn';

  // reset scoreboard
  game.player1.resetScore();
  game.player2.resetScore();
  player1Score.textContent = game.player1.getScore();
  player2Score.textContent = game.player2.getScore();

  // hide board and show names
  names.classList.remove('is-hidden');
  scoreboard.classList.add('is-hidden');
  board.classList.add('is-hidden');
});

// Add event listener to play again button
againButton.addEventListener('click', () => {
  // reset notice
  notice.classList.add('is-hidden');
  noticeText.textContent = '';

  // reset board
  gameBoard.reset();
  render.now();

  // reset game
  game.setGameOver(false);
  game.setCurrentPlayer();
  turnName.textContent = game.getCurrentPlayer().getName();
  turnMsg.textContent = 'it\'s your turn';
  game.setCurrentPlayer();
});

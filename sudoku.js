// Constants
const BOARD_SIZE = 9;
const SUBGRID_SIZE = 3;
const HIGHLIGHT_CLASS = "highlight";

// Variables
let board;
let selectedCell;

// Initialize the game
function init() {
  board = getBoardFromTable();
  selectedCell = null;
  renderBoard();

  // Add event listeners to the cells
  const cells = document.querySelectorAll("#sudoku-table td");
  cells.forEach((cell) => {
    cell.addEventListener("click", selectCell);
  });
  document.addEventListener("keydown", handleKeyPress);
}

// Get the Sudoku board from the HTML table
function getBoardFromTable() {
  const board = [];
  const rows = document.querySelectorAll("#sudoku-table tr");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowValues = [];
    cells.forEach((cell) => {
      const value = cell.innerText ? parseInt(cell.innerText) : null;
      rowValues.push(value);
    });
    board.push(rowValues);
  });
  return board;
}

// Render the Sudoku board
function renderBoard() {
  const cells = document.querySelectorAll("#sudoku-table td");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const value = board[row][col];
    cell.innerText = value ? value : "";
    cell.classList.remove(HIGHLIGHT_CLASS);
  });
}

// Select a cell
function selectCell(event) {
  const selectedRow = Math.floor(event.target.parentNode.rowIndex);
  const selectedCol = event.target.cellIndex;
  if (board[selectedRow][selectedCol] !== null) {
    removeHighlight();
    return;
  }
  if (selectedCell) {
    selectedCell.classList.remove(HIGHLIGHT_CLASS);
  }
  selectedCell = event.target;
  selectedCell.classList.add(HIGHLIGHT_CLASS);
}

// Handle key press events
function handleKeyPress(event) {
  if (selectedCell) {
    const value = parseInt(event.key);
    if (Number.isInteger(value) && value >= 1 && value <= 9) {
      const selectedRow = Math.floor(selectedCell.parentNode.rowIndex);
      const selectedCol = selectedCell.cellIndex;
      if (isValidMove(selectedRow, selectedCol, value)) {
        board[selectedRow][selectedCol] = value;
        renderBoard();
        removeHighlight();
        if (isBoardFilled()) {
          alert("Congratulations! You solved the Sudoku puzzle.");
        }
      }
    } else if (event.key === "Backspace" || event.key === "Delete") {
      const selectedRow = Math.floor(selectedCell.parentNode.rowIndex);
      const selectedCol = selectedCell.cellIndex;
      if (board[selectedRow][selectedCol] !== null) {
        board[selectedRow][selectedCol] = null;
        renderBoard();
        removeHighlight();
      }
    }
  }
}

// Check if a move is valid
function isValidMove(row, col, value) {
  return (
    isValidRow(row, value) &&
    isValidColumn(col, value) &&
    isValidSubgrid(row, col, value)
  );
}

// Check if a row is valid
function isValidRow(row, value) {
  return !board[row].includes(value);
}

// Check if a column is valid
function isValidColumn(col, value) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (board[row][col] === value) {
      return false;
    }
  }
  return true;
}

// Check if a subgrid is valid
function isValidSubgrid(row, col, value) {
  const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE;
  const startCol = Math.floor(col / SUBGRID_SIZE) * SUBGRID_SIZE;
  for (let i = 0; i < SUBGRID_SIZE; i++) {
    for (let j = 0; j < SUBGRID_SIZE; j++) {
      if (board[startRow + i][startCol + j] === value) {
        return false;
      }
    }
  }
  return true;
}

// Check if the board is completely filled
function isBoardFilled() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

// Remove highlight from selected cell
function removeHighlight() {
  if (selectedCell) {
    selectedCell.classList.remove(HIGHLIGHT_CLASS);
    selectedCell = null;
  }
}

// Add event listener for the page load
window.addEventListener("DOMContentLoaded", function () {
  init();
});

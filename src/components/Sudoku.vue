<script setup lang="ts">
import { ref } from 'vue';

type SudokuCell = number | string | null;

const createEmptyGrid = (): SudokuCell[][] => [
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];

const puzzle = ref<SudokuCell[][]>(createEmptyGrid());
const isPuzzleValid = ref(true);
const isPuzzleSolved = ref(false);
const noSolution = ref(false);

function isInitialGridValid(): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = puzzle.value[i][j];
      if (val !== null && val !== '') {
        const num = Number(val);
        puzzle.value[i][j] = null;
        const valid = isNumberValid(puzzle.value, i, j, num);
        puzzle.value[i][j] = num;
        if (!valid) return false;
      }
    }
  }
  return true;
}

function validatePuzzle() {
  noSolution.value = false;
  isPuzzleValid.value = true;

  for (let i = 0; i < puzzle.value.length; i++) {
    for (let j = 0; j < puzzle.value[i].length; j++) {
      const cellVal = puzzle.value[i][j];
      if (cellVal !== null && cellVal !== '' && (isNaN(Number(cellVal)) || Number(cellVal) < 1 || Number(cellVal) > 9)) {
        isPuzzleValid.value = false;
        return;
      }
    }
  }

  preparePuzzle();

  if (!isInitialGridValid()) {
    isPuzzleSolved.value = true;
    noSolution.value = true;
    return;
  }

  returnSolved();
}

function clearPuzzle() {
  puzzle.value = createEmptyGrid();
  isPuzzleSolved.value = false;
  isPuzzleValid.value = true;
  noSolution.value = false;
}

function returnSolved() {
  if (solvePuzzle()) {
    isPuzzleSolved.value = true;
  } else {
    isPuzzleSolved.value = true;
    noSolution.value = true;
  }
}

function addExample() {
  puzzle.value = [
    [null, null, 3, null, null, 1, null, null, null],
    [7, null, null, 8, null, null, 5, 2, null],
    [8, null, 4, null, null, null, 6, null, 3],
    [null, null, 7, 3, 2, null, null, null, null],
    [5, null, null, null, null, null, null, null, 2],
    [null, null, null, null, 1, 7, 4, 3, null],
    [null, 6, 5, null, null, 4, null, null, null],
    [null, 2, 9, 1, 8, 5, 3, null, 7],
    [null, 7, 8, 6, 3, null, 9, 5, 4],
  ];
  isPuzzleSolved.value = false;
  isPuzzleValid.value = true;
  noSolution.value = false;
}

function preparePuzzle() {
  for (let i = 0; i < puzzle.value.length; i++) {
    for (let j = 0; j < puzzle.value[i].length; j++) {
      const val = puzzle.value[i][j];
      puzzle.value[i][j] = (val !== null && val !== '') ? Number(val) : null;
    }
  }
}

function isNumberValid(p: SudokuCell[][], row: number, col: number, val: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (Number(p[row][i]) === val) return false;
  }
  for (let i = 0; i < 9; i++) {
    if (Number(p[i][col]) === val) return false;
  }
  const squareRow = Math.floor(row / 3) * 3;
  const squareCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (Number(p[squareRow + i][squareCol + j]) === val) return false;
    }
  }
  return true;
}

function findEmptyCell(p: SudokuCell[][]): [number, number] | undefined {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = p[row][col];
      if (val === 0 || val === null || val === '') {
        return [row, col];
      }
    }
  }
}

function solvePuzzle(): boolean {
  const empty = findEmptyCell(puzzle.value);
  if (empty) {
    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
      if (isNumberValid(puzzle.value, row, col, num)) {
        puzzle.value[row][col] = num;
        if (solvePuzzle()) {
          return true;
        } else {
          puzzle.value[row][col] = null;
        }
      }
    }
    return false;
  }
  return true;
}
</script>

<template>
  <div class="game-container">
    <h2 class="game-title">Sudoku</h2>
    <table>
      <tr v-for="(row, rowIndex) in puzzle" :key="rowIndex">
        <td v-for="(_, cellIndex) in row" :key="cellIndex">
          <input
            v-show="!isPuzzleSolved"
            v-model="puzzle[rowIndex][cellIndex]"
            :aria-label="`Sudoku cell row ${rowIndex + 1} column ${cellIndex + 1}`"
          />
          <span v-show="isPuzzleSolved" class="solved-cell">{{ puzzle[rowIndex][cellIndex] }}</span>
        </td>
      </tr>
    </table>

    <div class="buttons-row">
      <button v-show="!isPuzzleSolved && isPuzzleValid" @click="validatePuzzle" class="game-btn">
        Solve
      </button>
      <button v-show="!isPuzzleSolved && isPuzzleValid" @click="addExample" class="game-btn">
        Try example
      </button>
      <button v-show="isPuzzleSolved || !isPuzzleValid" @click="clearPuzzle" class="game-btn">
        Try again
      </button>
    </div>

    <div class="status-box">
      <p v-show="!isPuzzleValid">
        Fill some known numbers of sudoku. Valid numbers are 1-9
      </p>
      <p v-show="isPuzzleValid && !noSolution && !isPuzzleSolved">
        Solves a
        <a href="https://en.wikipedia.org/wiki/Sudoku" target="_blank" rel="noopener noreferrer">Sudoku</a>
        by the provided "clues".
      </p>
      <p v-show="noSolution">
        This
        <a href="https://en.wikipedia.org/wiki/Sudoku" target="_blank" rel="noopener noreferrer">Sudoku</a>
        has no solution with the provided clues.
      </p>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  background-color: var(--color-pink-light, #eadbdc);
  border: 2px solid var(--color-green-dark, #a7c191);
  border-radius: 1.25rem;
  box-shadow: 0 8px 30px rgba(73, 18, 18, 0.08);
  width: 100%;
  max-width: 32rem;
  padding: 1.25rem 1rem;
  margin: 0;
  box-sizing: border-box;
  text-align: center;
  font-family: monospace;
}

.game-title {
  color: var(--color-dark, #491212);
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0 0 0.75rem 0;
}

.status-box p {
  padding: 0.5rem 0.75rem;
  color: var(--color-dark, #491212);
  background-color: var(--color-white, #dae2e2);
  border: 2px solid var(--color-green-dark, #a7c191);
  border-radius: 1rem;
  text-align: center;
  margin: 0.75rem 0 0 0;
  font-size: clamp(0.75rem, 3vw, 0.85rem);
}

.status-box a {
  color: var(--color-dark, #491212);
  font-weight: 700;
  text-decoration: underline;
}

table {
  margin: 0.5rem auto;
  border-collapse: collapse;
}

td {
  width: min(2.2rem, 8.5vw);
  height: min(2.2rem, 8.5vw);
  text-align: center;
  border-left: 2px solid var(--color-green-dark, #a7c191);
  border-right: 2px solid var(--color-green-dark, #a7c191);
  border-bottom: 2px solid var(--color-green-dark, #a7c191);
}

td:first-child {
  border-left: 2px solid var(--color-dark, #491212);
}

td:nth-child(3n) {
  border-right: 2px solid var(--color-dark, #491212);
}

tr:first-child {
  border-top: 2px solid var(--color-dark, #491212);
}

tr:nth-child(3n) td {
  border-bottom: 2px solid var(--color-dark, #491212);
}

input {
  border: none;
  background-color: transparent;
  text-align: center;
  outline: none;
  width: 100%;
  height: 100%;
  color: var(--color-dark, #491212);
  font-family: monospace;
  font-weight: 700;
  font-size: clamp(0.85rem, 3.5vw, 1.1rem);
}

.solved-cell {
  color: var(--color-dark, #491212);
  font-family: monospace;
  font-weight: 700;
  font-size: clamp(0.85rem, 3.5vw, 1.1rem);
}

.buttons-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.75rem;
}

.game-btn {
  border: 2px solid var(--color-green-dark, #a7c191);
  background-color: var(--color-green-light, #cde2bd);
  color: var(--color-dark, #491212);
  padding: 0.5rem 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}

.game-btn:hover {
  background-color: var(--color-green-dark, #a7c191);
  color: var(--color-dark, #491212);
}

.game-btn:active {
  background-color: var(--color-green-dark, #a7c191);
}
</style>

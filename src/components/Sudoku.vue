<script setup lang="ts">
import { ref } from 'vue';

const puzzle = ref([
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
] as any)
const isPuzzleValid = ref(true)
const isPuzzleSolved = ref(false)
const noSolution = ref(false)

function validatePuzzle() {
  outer_loop: for (let i = 0; i < puzzle.value.length; i++) {
    for (let j = 0; j < puzzle.value[i].length; j++) {
      if (
        ![null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(puzzle.value[i][j]))
      ) {
        isPuzzleValid.value = false
        break outer_loop
      } else {
        isPuzzleValid.value = true
      }
    }
  }
  if (isPuzzleValid.value) {
    preparePuzzle()
    returnSolved()
  }
}
function clearPuzzle() {
  puzzle.value = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ]
  isPuzzleSolved.value = false
  isPuzzleValid.value = true
  noSolution.value = false
}
function returnSolved() {
  if (solvePuzzle()) {
    isPuzzleSolved.value = true
  } else {
    puzzle.value = [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
    ]
    isPuzzleSolved.value = true
    noSolution.value = true
  }
}
function addExample() {
  puzzle.value = [
    [null, null, '3', null, null, '1', null, null, null],
    ['7', null, null, '8', null, null, '5', '2', null],
    ['8', null, '4', null, null, null, '6', null, '3'],
    [null, null, '7', '3', '2', null, null, null, null],
    ['5', null, null, null, null, null, null, null, '2'],
    [null, null, null, null, '1', '7', '4', '3', null],
    [null, '6', '5', null, null, '4', null, null, null],
    [null, '2', '9', '1', '8', '5', '3', null, '7'],
    [null, '7', '8', '6', '3', null, '9', '5', '4'],
  ]
}
function preparePuzzle() {
  for (let i = 0; i < puzzle.value.length; i++) {
    for (let j = 0; j < puzzle.value[i].length; j++) {
      puzzle.value[i][j] = Number(puzzle.value[i][j])
    }
  }
}
function isNumberValid(p: any, row: number, col: number, val: number) {
  for (let i = 0; i < 9; i++) {
    if (p[row][i] === val) {
      return false
    }
  }
  for (let i = 0; i < 9; i++) {
    if (p[i][col] === val) {
      return false
    }
  }
  let squareRow = Math.floor(row / 3) * 3
  let squareCol = Math.floor(col / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (p[squareRow + i][squareCol + j] === val) return false
    }
  }
  return true
}
function findEmptyCell(p: any) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (p[row][col] === 0 || p[row][col] === null) {
        return [row, col]
      }
    }
  }
}
function solvePuzzle() {
  let empty = findEmptyCell(puzzle.value)
  if (empty) {
    let [row, col] = empty
    for (let num = 1; num <= 9; num++) {
      if (isNumberValid(puzzle.value, row, col, num)) {
        puzzle.value[row][col] = num
        let result: any = solvePuzzle()
        if (result) {
          return result
        } else {
          puzzle.value[row][col] = 0
        }
      }
    }
    return
  }
  return puzzle
}
</script>

<template>
  <div class="game-container">
    <table>
      <tr v-for="(row, rowIndex) in puzzle">
        <td v-for="(_, cellIndex) in row">
          <input v-show="!isPuzzleSolved" v-model="puzzle[rowIndex][cellIndex]"/>
          <span v-show="isPuzzleSolved">{{ puzzle[rowIndex][cellIndex] }}</span>
        </td>
      </tr>
    </table>
    <button v-show="!isPuzzleSolved && isPuzzleValid" @click="validatePuzzle">
      Solve
    </button>
    <button v-show="!isPuzzleSolved && isPuzzleValid" @click="addExample">
      Try example
    </button>
    <button v-show="isPuzzleSolved || !isPuzzleValid" @click="clearPuzzle">
      Try again
    </button>
    <p v-show="!isPuzzleValid">
      Fill some known numbers of sudoku. Valid numbers are 1-9
    </p>
    <p v-show="isPuzzleValid && !noSolution">
      Solves a
      <a href="https://en.wikipedia.org/wiki/Sudoku" target="_blank">Sudoku</a>
      by the provided "clues".
    </p>
    <p v-show="noSolution">This sudoku has no solution</p>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  background-color: #dae2e2;
  width: 500px;
  margin: 0px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 15px;
}

p {
  padding: 10px;
  color: #402e37;
  border: 2px solid #414d08;
  text-align: center;
  margin: 10px;
}

table {
  margin: 10px auto;
  border-collapse: collapse;
}

td {
  width: 30px;
  height: 30px;
  text-align: center;
  border-left: 2px solid #98a565;
  border-right: 2px solid #98a565;
  border-bottom: 2px solid #98a565;
}

td:first-child {
  border-left: 2px solid #402e37;
}

td:nth-child(3n) {
  border-right: 2px solid #402e37;
}

tr:first-child {
  border-top: 2px solid #402e37;
}

tr:nth-child(3n) td {
  border-bottom: 2px solid #402e37;
}

input {
  border: none;
  background-color: transparent;
  text-align: center;
  outline: none;
  width: 15px;
}

span {
  padding: 5px;
}

button {
  margin: 10px;
  border: none;
  background-color: #98a565;
  color: #402e37;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;
  letter-spacing: 2px;
  text-align: center;
  display: inline-block;
}

button:hover {
  color: #dae2e2;
  background-color: #414d08;
}

@media (max-width: 845px) {
  .game-container {
    width: 350px;
    margin: auto;
    height: 470px;
    padding: 5px;
    margin-bottom: 10px;
  }
}
</style>

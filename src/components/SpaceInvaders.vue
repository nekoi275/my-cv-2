<template>
  <div class="game-container">
    <canvas id="game-screen" ref="canvasRef"></canvas>

    <div v-if="isButtonShown || isGameOver || isWin" class="overlay">
      <div v-if="isButtonShown" class="menu-content">
        <button @click="start()">Play</button>
        <div class="instructions">
          <p><strong>Controls:</strong></p>
          <p>Move Left: A / <span class="icon">⬅️</span></p>
          <p>Move Right: D / <span class="icon">➡️</span></p>
          <p>Fire: W / <span class="icon">🔴</span></p>
        </div>
      </div>

      <div v-if="isGameOver" class="menu-content">
        <h2>Game Over</h2>
        <button @click="start()">Play Again</button>
      </div>

      <div v-if="isWin" class="menu-content">
        <h2>You Won!</h2>
        <button @click="start()">Play Again</button>
      </div>
    </div>

    \ <div class="mobile-controls">
      <div class="direction-controls">
        <button class="control-btn left-btn" @touchstart.prevent="control.left = true"
          @touchend.prevent="control.left = false" @mousedown.prevent="control.left = true"
          @mouseup.prevent="control.left = false">
          ⬅️
        </button>
        <button class="control-btn right-btn" @touchstart.prevent="control.right = true"
          @touchend.prevent="control.right = false" @mousedown.prevent="control.right = true"
          @mouseup.prevent="control.right = false">
          ➡️
        </button>
      </div>
      <button class="control-btn fire-btn" @touchstart.prevent="control.fire = true"
        @touchend.prevent="control.fire = false" @mousedown.prevent="control.fire = true"
        @mouseup.prevent="control.fire = false">
        🔴
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import spriteImageSrc from '../assets/sprite.png';

const canvasRef = ref(null);
const canvasCtx = ref(null);
const isButtonShown = ref(true);
const isGameOver = ref(false);
const isWin = ref(false);
const spriteImage = ref(null);

const config = {
  aliens: {
    sprites: [
      [
        { x: 0, y: 0, width: 22, height: 16, margin: 0 },
        { x: 0, y: 16, width: 22, height: 16, margin: 0 }
      ],
      [
        { x: 22, y: 0, width: 16, height: 16, margin: 4 },
        { x: 22, y: 16, width: 16, height: 16, margin: 4 }
      ],
      [
        { x: 38, y: 0, width: 24, height: 16, margin: 0 },
        { x: 38, y: 16, width: 24, height: 16, margin: 0 }
      ]
    ],
    rows: 5,
    columns: 10,
    framesToSkip: [50, 25, 10, 5],
    types: [1, 0, 0, 2, 2],
    bulletColor: '#ffff00',
    shootProbability: 0.03,
    bulletSpeed: 4
  },
  tank: {
    sprite: { x: 62, y: 0, width: 22, height: 16 },
    bulletColor: '#ff0000',
    bulletSpeed: -8,
    speed: 4
  },
  bullet: { width: 2, height: 6 },
  screenPadding: 30,
  levelMap: { 50: 0, 30: 1, 10: 2, 5: 3 }
};

const control = reactive({
  right: false,
  left: false,
  fire: false
});

const state = reactive({
  aliens: {
    shown: [],
    spriteFrame: 0,
    direction: 1,
    xSpeed: 10,
    ySpeed: 20,
    offset: 0
  },
  tank: { x: 0, y: 0, width: 22, height: 16 },
  bullets: [],
  frame: 0,
  level: 0
});

let animationFrameId = null;

const start = () => {
  isGameOver.value = false;
  isWin.value = false;
  isButtonShown.value = false;
  init();
};

const init = () => {
  initState();
  // Controls are initialized in onMounted
  if (!spriteImage.value) {
    initSpriteImage(run);
  } else {
    run();
  }
};

const initState = () => {
  state.aliens.shown = [];
  state.aliens.spriteFrame = 0;
  state.aliens.direction = 1;
  state.aliens.xSpeed = 10;
  state.aliens.ySpeed = 20;
  state.aliens.offset = 0;

  state.tank.x = 0;
  state.tank.y = 0;
  state.bullets = [];
  state.frame = 0;
  state.level = 0;

  if (canvasCtx.value) {
    state.tank.x = (canvasCtx.value.canvas.width - config.tank.sprite.width) / 2;
    state.tank.y = canvasCtx.value.canvas.height - (30 + config.tank.sprite.height);
  }

  for (let rowIndex = 0; rowIndex < config.aliens.rows; rowIndex++) {
    for (let colIndex = 0; colIndex < config.aliens.columns; colIndex++) {
      let typeNumber = config.aliens.types[rowIndex];
      let sprite = config.aliens.sprites[typeNumber];
      state.aliens.shown.push({
        sprite: sprite,
        x: config.screenPadding + colIndex * config.screenPadding + sprite[0].margin,
        y: config.screenPadding + rowIndex * config.screenPadding,
        width: sprite[0].width,
        height: sprite[0].height
      });
    }
  }
};

const initSpriteImage = (afterInit) => {
  spriteImage.value = document.createElement('img');
  spriteImage.value.src = spriteImageSrc;
  spriteImage.value.addEventListener('load', afterInit);
};

const drawSprite = (sprite, x, y) => {
  if (!canvasCtx.value || !spriteImage.value) return;
  canvasCtx.value.drawImage(
    spriteImage.value,
    sprite.x,
    sprite.y,
    sprite.width,
    sprite.height,
    x,
    y,
    sprite.width,
    sprite.height
  );
};

const run = () => {
  const loop = () => {
    update();
    render();
    if (!isGameOver.value && !isWin.value) {
      animationFrameId = window.requestAnimationFrame(loop);
    }
  };
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = window.requestAnimationFrame(loop);
};

const update = () => {
  updateAliensAmount();
  updateLevel();
  updateAliensPosition();
  updateTank();
  updateBullets();
};

const render = () => {
  if (!canvasCtx.value) return;
  canvasCtx.value.clearRect(0, 0, canvasCtx.value.canvas.width, canvasCtx.value.canvas.height);

  drawSprite(config.tank.sprite, state.tank.x, state.tank.y);

  state.aliens.shown.forEach(alien =>
    drawSprite(alien.sprite[state.aliens.spriteFrame], alien.x, alien.y)
  );

  state.bullets.forEach(bullet => {
    canvasCtx.value.fillStyle = bullet.color;
    canvasCtx.value.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
};

const updateTank = () => {
  if (control.left && state.tank.x > config.screenPadding) {
    state.tank.x -= config.tank.speed;
  }

  let rightBoundary = canvasCtx.value.canvas.width - config.screenPadding - config.tank.sprite.width;
  if (control.right && state.tank.x < rightBoundary) {
    state.tank.x += config.tank.speed;
  }

  if (control.fire) {
    control.fire = false;
    state.bullets.push({
      x: state.tank.x + config.tank.sprite.width / 2,
      y: state.tank.y,
      speed: config.tank.bulletSpeed,
      width: config.bullet.width,
      height: config.bullet.height,
      color: config.tank.bulletColor
    });
  }
};

const updateBullets = () => {
  let isShooting = Math.random() < config.aliens.shootProbability;

  for (let i = 0; i < state.bullets.length; i++) {
    let bullet = state.bullets[i];
    bullet.y += bullet.speed;

    if (bullet.y + bullet.height < 0 || bullet.y > canvasCtx.value.canvas.height) {
      state.bullets.splice(i, 1);
      i--;
      continue;
    }

    if (isCollision(bullet, state.tank)) {
      isGameOver.value = true;
    }
  }

  if (isShooting && state.aliens.shown.length > 0) {
    let randomAlien = state.aliens.shown[Math.round(Math.random() * (state.aliens.shown.length - 1))];
    state.bullets.push({
      x: randomAlien.x + randomAlien.width / 2,
      y: randomAlien.y + randomAlien.height,
      speed: config.aliens.bulletSpeed,
      width: config.bullet.width,
      height: config.bullet.height,
      color: config.aliens.bulletColor
    });
  }
};

const updateLevel = () => {
  let level = config.levelMap[state.aliens.shown.length];
  if (level) {
    state.level = level;
  }
};

const updateAliensAmount = () => {
  for (let i = 0; i < state.bullets.length; i++) {
    let bullet = state.bullets[i];
    if (bullet.speed < 0) {
      for (let j = 0; j < state.aliens.shown.length; j++) {
        if (isCollision(bullet, state.aliens.shown[j])) {
          state.aliens.shown.splice(j, 1);
          state.bullets.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }
  if (state.aliens.shown.length == 0 && !isButtonShown.value) isWin.value = true;
};

const updateAliensPosition = () => {
  state.frame++;
  if (state.aliens.shown.length === 0) return;

  let xMax = Math.max(...state.aliens.shown.map(alien => alien.x));
  let xMin = Math.min(...state.aliens.shown.map(alien => alien.x));
  let alienMaxWidth = Math.max(...state.aliens.shown.map(alien => alien.width));
  let rightBoundary = canvasCtx.value.canvas.width - config.screenPadding - alienMaxWidth;
  let framesToSkip = config.aliens.framesToSkip[state.level];

  if (state.frame % framesToSkip == 0) {
    let moveDown = false;
    if (xMax > rightBoundary || xMin < config.screenPadding) {
      state.aliens.direction *= -1;
      moveDown = true;
    }
    state.aliens.spriteFrame = (state.aliens.spriteFrame + 1) % 2;
    for (let i = 0; i < state.aliens.shown.length; i++) {
      let alien = state.aliens.shown[i];
      if (moveDown) {
        alien.y += state.aliens.ySpeed;
      }
      alien.x += state.aliens.xSpeed * state.aliens.direction;
    }
  }
  checkAliensClose();
};

const checkAliensClose = () => {
  if (state.aliens.shown.length === 0) return;
  let yMax = Math.max(...state.aliens.shown.map(alien => alien.y));
  let bottomBoundary = canvasCtx.value.canvas.height * 0.75;
  if (yMax > bottomBoundary) {
    isGameOver.value = true;
  }
};

const isCollision = (objectA, objectB) => {
  return (
    objectA.x < objectB.x + objectB.width &&
    objectB.x < objectA.x + objectA.width &&
    objectA.y < objectB.y + objectB.height &&
    objectB.y < objectA.y + objectA.height
  );
};

const handleKeydown = (event) => {
  if (event.key === 'a' || event.key === 'ArrowLeft') control.left = true;
  if (event.key === 'd' || event.key === 'ArrowRight') control.right = true;
  if (event.key === 'w' || event.key === 'ArrowUp' || event.key === ' ') control.fire = true;
};

const handleKeyup = (event) => {
  if (event.key === 'a' || event.key === 'ArrowLeft') control.left = false;
  if (event.key === 'd' || event.key === 'ArrowRight') control.right = false;
  if (event.key === 'w' || event.key === 'ArrowUp' || event.key === ' ') control.fire = false;
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    canvasCtx.value = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 500;
  }

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keyup', handleKeyup);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 6/5;
  background-color: #222;
  border-radius: 15px;
  overflow: hidden;
  touch-action: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #000000;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 10;
}

.menu-content {
  background-color: #cde2bd;
  color: #491212;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  max-width: 80%;
}

.instructions {
  margin-top: 15px;
  text-align: left;
  font-size: 0.9em;
}

.instructions p {
  margin: 5px 0;
}

button {
  border: none;
  background-color: #491212;
  color: #cde2bd;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.1s;
}

button:active {
  transform: scale(0.95);
}

.mobile-controls {
  display: none;
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
  pointer-events: none;
}

.control-btn {
  pointer-events: auto;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
}

.control-btn:active {
  background-color: rgba(255, 255, 255, 0.4);
}

.direction-controls {
  display: flex;
  gap: 20px;
}

@media (hover: none) and (pointer: coarse),
(max-width: 768px) {
  .mobile-controls {
    display: flex;
  }
}
</style>

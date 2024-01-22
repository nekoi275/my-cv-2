<template>
  <div class="game-container">
    <canvas id="game-screen"></canvas>
    <button v-show="isButtonShown" @click="start()">
      Play
      <hr />move left: A;
      <br />move right: D;
      <br />fire: W
    </button>
    <button v-show="isGameOver" @click="start()">
      Game over
      <hr />play again
    </button>
    <button v-show="isWin" @click="start()">
      You win!
      <hr />play again
    </button>
  </div>
</template>

<script>
import spriteImage from '../assets/sprite.png';

export default {
  name: 'SpaceInvaders',
  data: function() {
    return {
      isButtonShown: true,
      isGameOver: false,
      isWin: false,
      spriteImage: null,
      canvasCtx: null,
      config: {
        aliens: {
          sprites: [
            [
              {
                x: 0,
                y: 0,
                width: 22,
                height: 16,
                margin: 0
              },
              {
                x: 0,
                y: 16,
                width: 22,
                height: 16,
                margin: 0
              }
            ],
            [
              {
                x: 22,
                y: 0,
                width: 16,
                height: 16,
                margin: 4
              },
              {
                x: 22,
                y: 16,
                width: 16,
                height: 16,
                margin: 4
              }
            ],
            [
              {
                x: 38,
                y: 0,
                width: 24,
                height: 16,
                margin: 0
              },
              {
                x: 38,
                y: 16,
                width: 24,
                height: 16,
                margin: 0
              }
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
          sprite: {
            x: 62,
            y: 0,
            width: 22,
            height: 16
          },
          bulletColor: '#ff0000',
          bulletSpeed: -8,
          speed: 4
        },
        bullet: {
          width: 2,
          height: 6
        },
        screenPadding: 30,
        levelMap: {
          50: 0,
          30: 1,
          10: 2,
          5: 3
        }
      },
      control: {
        right: false,
        left: false,
        fire: false
      },
      state: {}
    };
  },
  methods: {
    start: function() {
      this.isGameOver = false;
      this.isWin = false;
      this.isButtonShown = false;
      this.init();
    },
    render: function() {
      this.canvasCtx.clearRect(
        0,
        0,
        this.canvasCtx.canvas.width,
        this.canvasCtx.canvas.height
      );
      this.drawSprite(
        this.config.tank.sprite,
        this.state.tank.x,
        this.state.tank.y
      );
      this.state.aliens.shown.forEach(alien => 
        this.drawSprite(
          alien.sprite[this.state.aliens.spriteFrame],
          alien.x,
          alien.y
        )
      );
      this.state.bullets.forEach(bullet => {
        this.canvasCtx.fillStyle = bullet.color;
        this.canvasCtx.fillRect(
          bullet.x,
          bullet.y,
          bullet.width,
          bullet.height
        )
      });
    },
    init: function() {
      this.initState();
      this.initControl();
      this.initSpriteImage(this.run);
    },
    initState: function() {
      this.state = {
        aliens: {
          shown: [],
          spriteFrame: 0,
          direction: 1,
          xSpeed: 10,
          ySpeed: 20,
          offset: 0
        },
        tank: {
          x: 0,
          y: 0,
          width: 22,
          height: 16
        },
        bullets: [],
        frame: 0,
        level: 0
      };
      this.state.tank.x =
        (this.canvasCtx.canvas.width - this.config.tank.sprite.width) / 2;
      this.state.tank.y =
        this.canvasCtx.canvas.height - (30 + this.config.tank.sprite.height);

      for (let rowIndex = 0; rowIndex < this.config.aliens.rows; rowIndex++) {
        for (
          let colIndex = 0;
          colIndex < this.config.aliens.columns;
          colIndex++
        ) {
          let typeNumber = this.config.aliens.types[rowIndex];
          let sprite = this.config.aliens.sprites[typeNumber];
          this.state.aliens.shown.push({
            sprite: sprite,
            x:
              this.config.screenPadding +
              colIndex * this.config.screenPadding +
              sprite[0].margin,
            y: this.config.screenPadding + rowIndex * this.config.screenPadding,
            width: sprite[0].width,
            height: sprite[0].height
          });
        }
      }
    },
    initSpriteImage: function(afterInit) {
      this.spriteImage = document.createElement('img');
      this.spriteImage.src = spriteImage;
      this.spriteImage.addEventListener('load', afterInit);
    },
    initControl: function() {
      document.addEventListener('keydown', event => {
        this.control.left = event.keyCode == 65;
        this.control.right = event.keyCode == 68;
      });
      document.addEventListener('keyup', () => {
        this.control.left = false;
        this.control.right = false;
        this.control.fire = event.keyCode == 87;
      });
    },
    drawSprite: function(sprite, x, y) {
      this.canvasCtx.drawImage(
        this.spriteImage,
        sprite.x,
        sprite.y,
        sprite.width,
        sprite.height,
        x,
        y,
        sprite.width,
        sprite.height
      );
    },
    run: function() {
      let loop = () => {
        this.update();
        this.render();
        if (!this.isGameOver) {
          window.requestAnimationFrame(loop);
        }
      };
      window.requestAnimationFrame(loop);
    },
    update: function() {
      this.updateAliensAmount();
      this.updateLevel();
      this.updateAliensPosition();
      this.updateTank();
      this.updateBullets();
    },
    updateTank: function() {
      if (
        this.control.left &&
        this.state.tank.x > this.config.screenPadding
      ) {
        this.state.tank.x -= this.config.tank.speed;
      }
      let rightBoundary =
        this.canvasCtx.canvas.width -
        this.config.screenPadding -
        this.config.tank.sprite.width;
      if (this.control.right && this.state.tank.x < rightBoundary) {
        this.state.tank.x += this.config.tank.speed;
      }
      if (this.control.fire) {
        this.control.fire = false;
        this.state.bullets.push({
          x: this.state.tank.x + this.config.tank.sprite.width / 2,
          y: this.state.tank.y,
          speed: this.config.tank.bulletSpeed,
          width: this.config.bullet.width,
          height: this.config.bullet.height,
          color: this.config.tank.bulletColor
        });
      }
    },
    updateBullets: function() {
      let isShooting = Math.random() < this.config.aliens.shootProbability;

      for (let i = 0; i < this.state.bullets.length; i++) {
        let bullet = this.state.bullets[i];
        bullet.y += bullet.speed;

        if (
          bullet.y + bullet.height < 0 ||
          bullet.y > this.canvasCtx.canvas.height
        ) {
          this.state.bullets.splice(i, 1);
          i--;
          continue;
        }

        if (this.isCollision(bullet, this.state.tank)) {
          this.isGameOver = true;
        }
      }

      if (isShooting) {
        let randomAlien = this.state.aliens.shown[
          Math.round(Math.random() * (this.state.aliens.shown.length - 1))
        ];
        this.state.bullets.push({
          x: randomAlien.x + randomAlien.width / 2,
          y: randomAlien.y + randomAlien.height,
          speed: this.config.aliens.bulletSpeed,
          width: this.config.bullet.width,
          height: this.config.bullet.height,
          color: this.config.aliens.bulletColor
        });
      }
    },
    updateLevel: function() {
      let level = this.config.levelMap[this.state.aliens.shown.length];
      if (level) {
        this.state.level = level;
      }
    },
    updateAliensAmount: function () {
      for (let i = 0; i < this.state.bullets.length; i++) {
        let bullet = this.state.bullets[i];
        if (bullet.speed < 0) {
          for (let j = 0; j < this.state.aliens.shown.length; j++) {
            if (this.isCollision(bullet, this.state.aliens.shown[j])) {
              this.state.aliens.shown.splice(j, 1);
              this.state.bullets.splice(i, 1);              
              break;
            }
          }
        }
      }
      if (this.state.aliens.shown.length == 0) this.isWin = true;
    },
    updateAliensPosition: function() {
      this.state.frame++;
      let xMax = Math.max(...this.state.aliens.shown.map(alien => alien.x));
      let xMin = Math.min(...this.state.aliens.shown.map(alien => alien.x));
      let alienMaxWidth = Math.max(
        ...this.state.aliens.shown.map(alien => alien.width)
      );
      let rightBoundary =
        this.canvasCtx.canvas.width -
        this.config.screenPadding -
        alienMaxWidth;
      let framesToSkip = this.config.aliens.framesToSkip[this.state.level];
      if (this.state.frame % framesToSkip == 0) {
        let moveDown;
        if (xMax > rightBoundary || xMin < this.config.screenPadding) {
          this.state.aliens.direction *= -1;
          moveDown = true;
        }
        this.state.aliens.spriteFrame = (this.state.aliens.spriteFrame + 1) % 2;
        for (let i = 0; i < this.state.aliens.shown.length; i++) {
          let alien = this.state.aliens.shown[i];
          if (moveDown) {
            alien.y += this.state.aliens.ySpeed;
          }
          alien.x += this.state.aliens.xSpeed * this.state.aliens.direction;
        }
        moveDown = false;
      }
      this.checkAliensClose();
    },
    checkAliensClose: function() {
      let yMax = Math.max(...this.state.aliens.shown.map(alien => alien.y));
      let bottomBoundary = this.canvasCtx.canvas.height * 0.75;
      if (yMax > bottomBoundary) {
        this.isGameOver = true;
      }
    },
    isCollision: function(objectA, objectB) {
      return (
        objectA.x < objectB.x + objectB.width &&
        objectB.x < objectA.x + objectA.width &&
        objectA.y < objectB.y + objectB.height &&
        objectB.y < objectA.y + objectA.height
      );
    }
  },
  mounted: function() {
    var canvas = document.getElementById('game-screen');
    var ctx = canvas.getContext('2d');
    ctx.canvas.width = 600;
    ctx.canvas.height = 500;
    this.canvasCtx = ctx;
  }
};
</script>

<style scoped>
.game-container {
  position: relative;
  width: 600px;
  height: 500px;
}

canvas {
  background-color: #000000;
}

button {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  border: none;
  background-color: #665a6a;
  color: #402e37;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 20px;
  letter-spacing: 2px;
  text-align: left;
}

button:hover {
  color: #665a6a;
  background-color: #402e37;
}
</style>

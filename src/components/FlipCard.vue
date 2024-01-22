<script setup lang="ts">
interface cardInfo {
    heading: string
    data: Array<string>
}
defineProps<{
    cardInfo: cardInfo
}>()
</script>

<template>
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <h3>{{ cardInfo.heading }}</h3>
      </div>
      <div class="flip-card-back">
        <ul v-for="cardInfoData in cardInfo.data" :key="cardInfoData">
          <li class="p-2.5">{{ cardInfoData }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  background-color: transparent;
  width: 300px;
  height: 300px;
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.flip-card-front {
  background-color: #414d08;
  color: #dae2e2;
  text-align: center;
}
.flip-card-back {
  background-color: #402e37;
  color: #dae2e2;
  transform: rotateY(180deg);
  text-align: left;
}
</style>

<script setup lang="ts">
import { PropType } from 'vue';
import { Bot } from '../models/bot';

defineProps({
  bot: {
    type: Object as PropType<Bot>,
    required: true
  }
});
</script>

<template>
  <q-card class="my-card">
    <q-card-section :class="{ cooking: bot.orderId, pending: !bot.orderId }">
      <div class="text-h6 text-center">
        Robot
        {{ bot.id }}
      </div>
    </q-card-section>

    <q-card-section>
      <div>
        <div class="text-center" v-if="bot.orderId">
          <span class="text-bold text-h6">Preparing</span>
          <div class="text-h6">Order ID: {{ bot.orderId }}</div>
          <div class="loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="text-bold text-center text-h6" v-else>Ready</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style>
.pending {
  background-color: rgb(102, 163, 255);
}
.cooking {
  background-color: #fc6c3e;
}

.loading span {
  width: 5px;
  height: 5px;
  margin: 0 2px;
  background-color: #000;
  border-radius: 50%;
  display: inline-block;
  animation: loading 1.4s infinite linear;
}

.loading span:nth-child(2) {
  animation-delay: 0.4s;
}

.loading span:nth-child(3) {
  animation-delay: 0.8s;
}

@keyframes loading {
  20% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>

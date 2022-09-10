<script setup lang="ts">
import { ref, computed } from 'vue';
import { Order, Bot } from '../models/order';

let botIndex = 1;
let orderIndex = 1;
const bots = ref<Bot[]>([]);
const orders = ref<Order[]>([]);

const pendingOrders = computed(() =>
  orders.value
    .filter((order) => order.isCompleted === false)
    .sort((orderA, orderB) => Number(orderB.isVIP) - Number(orderA.isVIP))
);

const completedOrders = computed(() =>
  orders.value.filter((order) => order.isCompleted === true)
);

function addBot() {
  const bot = {
    id: botIndex++,
    orderId: null
  };
  bots.value.push(bot);
  botGetOrder(bot);
}

function removeBot() {
  let removedBot = bots.value.pop();
  if (removedBot?.orderId) {
    var selectedOrder = orders.value.find(
      (order) => order.id === removedBot?.orderId
    );
    if (selectedOrder) {
      selectedOrder.botId = null;
      removedBot.orderId = null;
      removeTimer(removedBot);
    }
  }
}

function addOrder(isVIP = false) {
  orders.value.push({
    id: orderIndex++,
    isVIP: isVIP,
    botId: null,
    isCompleted: false,
    cookPeriod: 10
  });

  const freeBot: Bot = bots.value.filter((bot) => bot.orderId === null)[0];

  if (freeBot) {
    botGetOrder(freeBot);
  }
}

function removeTimer(bot: Bot) {
  bot.timer = null;
}

function botGetOrder(bot: Bot) {
  const freePendingOrder: Order = orders.value
    .filter((order) => order.botId === null)
    .sort((orderA, orderB) => Number(orderB.isVIP) - Number(orderA.isVIP))[0];

  if (freePendingOrder) {
    freePendingOrder.botId = bot.id;
    bot.orderId = freePendingOrder.id;

    const cookInterval = setInterval(() => {
      console.log(freePendingOrder.cookPeriod);
      freePendingOrder.cookPeriod = freePendingOrder.cookPeriod - 1;
    }, 1000);

    bot.timer = setTimeout(() => {
      removeTimer(bot);
      clearInterval(cookInterval);
      freePendingOrder.isCompleted = true;
      bot.orderId = null;
      botGetOrder(bot);
    }, freePendingOrder.cookPeriod * 1000);
  }
}
</script>

<template>
  <div class="column window-height bg-none">
    <div class="col-shrink">
      <div class="text-h5 text-center q-pa-md">FeedMe McDonald Cooking Bot</div>
      <div class="row">
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
              <div class="text-h6 row items-center justify-center">
                <span>Robot</span>
                <span
                  ><q-icon
                    name="smart_toy"
                    size="1.5rem"
                    class="q-pa-xs q-py-sm"
                  />
                </span>
              </div>
            </q-card-section>

            <q-card-actions align="around">
              <q-btn flat @click="removeBot()">- Bot</q-btn>
              <q-btn flat @click="addBot()">+ Bot</q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
              <div class="text-h6 text-center">Order</div>
            </q-card-section>

            <q-card-actions align="around">
              <q-btn flat @click="addOrder()">New Normal Order</q-btn>
              <q-btn flat @click="addOrder(true)">New VIP Order</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <div class="col q-pa-md">
      <q-card class="my-card">
        <q-card-section class="bg-purple text-white">
          <div class="text-h6 text-center">Processing</div>
        </q-card-section>

        <q-scroll-area style="height: 280px">
          <div class="row">
            <div v-for="bot in bots" :key="bot.id" class="col-4 q-pa-sm">
              <div class="q-ma-sm q-pa-md" style="border: 1px solid black">
                <div>Robot ID: {{ bot.id }}</div>
                <div>
                  Order ID:
                  {{ bot.orderId == null ? 'Pending Task' : bot.orderId }}
                </div>
                <div>
                  Status: {{ bot.orderId == null ? 'Pending' : 'Cooking' }}
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-card>
    </div>
    <div class="col bg-grey-4">
      <div class="row">
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
              <div class="text-h6 text-center">Pending</div>
            </q-card-section>

            <div class="q-pa-sm">
              <q-scroll-area style="height: 200px">
                <table
                  class="text-center"
                  style="width: 100%; border-collapse: collapse"
                >
                  <tr>
                    <td>Order ID</td>
                    <td>Order Type</td>
                    <td>Status</td>
                    <td>Count Down (Second)</td>
                    <td>Queue</td>
                  </tr>

                  <tr v-for="(order, index) in pendingOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td :class="order.isVIP ? 'text-orange-8 text-bold' : ''">
                      {{ order.isVIP ? 'VIP Order' : 'Normal Order' }}
                    </td>
                    <td>
                      <span v-if="order.botId">
                        <q-icon
                          name="outdoor_grill"
                          size="1.5rem"
                          class="q-pa-xs q-py-sm"
                          color="red"
                        />
                      </span>
                      <span v-else>
                        <q-icon
                          name="hourglass_top"
                          size="1.5rem"
                          class="q-pa-xs q-py-sm"
                        />
                      </span>
                    </td>
                    <td>{{ order.cookPeriod }}</td>
                    <td>{{ index + 1 }}</td>
                  </tr>
                </table>
              </q-scroll-area>
            </div>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
              <div class="text-h6 text-center">Complete</div>
            </q-card-section>

            <div class="q-pa-sm">
              <q-scroll-area style="height: 200px">
                <table class="text-center" style="width: 100%">
                  <tr>
                    <td>Order ID</td>
                    <td>Order Type</td>
                    <td>Status</td>
                    <td>Queue</td>
                  </tr>
                  <tr v-for="(order, index) in completedOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.isVIP ? 'VIP Order' : 'Normal Order' }}</td>
                    <td class="text-green text-bold">Completed</td>
                    <td>{{ index + 1 }}</td>
                  </tr>
                </table>
              </q-scroll-area>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.processing {
  color: blue;
}
</style>

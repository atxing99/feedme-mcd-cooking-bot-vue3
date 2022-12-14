<script setup lang="ts">
import { ref, computed } from 'vue';
import { Order, resetOrder, completeOrder } from '../models/order';
import { Bot, resetBot } from '../models/bot';
import RobotCard from 'src/components/robotCard.vue';
import moment from 'moment';

let botIndex = 1;
let orderIndex = 1;
const bots = ref<Bot[]>([]);
const orders = ref<Order[]>([]);

const pendingOrders = computed(() =>
  orders.value
    .filter((order) => order.isCompleted === false && order.isDeleted !== true)
    .sort((orderA, orderB) => Number(orderB.isVIP) - Number(orderA.isVIP))
);

const completedOrders = computed(() =>
  orders.value
    .filter((order) => order.isCompleted === true && !order.isDeleted)
    .sort(
      (a, b) =>
        moment(a.completedAt).toDate().getTime() -
        moment(b.completedAt).toDate().getTime()
    )
);

function addBot() {
  bots.value.push({
    id: botIndex++,
    orderId: null
  });
  processOrder();
}

function removeBot() {
  let removedBot = bots.value.pop();
  if (removedBot?.orderId) {
    var selectedOrder = orders.value.find(
      (order) => order.id === removedBot?.orderId
    );
    if (selectedOrder) {
      resetOrder(selectedOrder);
      resetBot(removedBot);
    }
  }
  processOrder();
}

function addOrder(isVIP = false) {
  orders.value.push({
    id: orderIndex++,
    isVIP: isVIP,
    botId: null,
    isCompleted: false,
    cookPeriod: null,
    isDeleted: false,
    completedAt: ''
  });
  processOrder();
}

function removeOrder(orderId: number) {
  const orderToRemove = orders.value.find((order) => order.id == orderId);
  if (orderToRemove) {
    orderToRemove.isDeleted = true;
    const bot = bots.value.find((bot) => bot.orderId == orderToRemove.id);
    if (bot) {
      resetBot(bot);
    }
    processOrder();
  }
}

function processOrder() {
  const freeBot = bots.value.find((bot) => bot.orderId === null);
  const freePendingOrder: Order = orders.value
    .filter((order) => order.botId === null && !order.isDeleted)
    .sort((orderA, orderB) => Number(orderB.isVIP) - Number(orderA.isVIP))[0];
  if (freeBot && freePendingOrder) {
    botGetOrder(freeBot, freePendingOrder);
    processOrder();
  }
}

function botGetOrder(bot: Bot, freePendingOrder: Order) {
  freePendingOrder.botId = bot.id;
  bot.orderId = freePendingOrder.id;
  freePendingOrder.cookPeriod = freePendingOrder.botId % 2 == 0 ? 10 : 5;

  freePendingOrder.cookTimer = setInterval(() => {
    if (freePendingOrder.cookPeriod) {
      freePendingOrder.cookPeriod--;
      if (freePendingOrder.cookPeriod <= 0) {
        clearInterval(freePendingOrder.cookTimer);
        resetBot(bot);
        completeOrder(freePendingOrder);
        processOrder();
      }
    }
  }, 1000);
}
</script>

<template>
  <div class="column window-height bg-grey-4">
    <div class="col-shrink">
      <div class="text-h5 text-center q-pa-md">FeedMe McDonald Cooking Bot</div>
      <div class="row">
        <div class="col q-px-md">
          <q-card class="my-card">
            <q-card-section class="bg-grey-8 text-white">
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
        <div class="col q-px-md">
          <q-card class="my-card">
            <q-card-section class="bg-grey-8 text-white">
              <div class="text-h6 row items-center justify-center">
                <span>Order</span>
                <span
                  ><q-icon
                    name="receipt_long"
                    size="1.5rem"
                    class="q-pa-xs q-py-sm"
                  />
                </span>
              </div>
            </q-card-section>

            <q-card-actions align="around">
              <q-btn flat @click="addOrder()">New Normal Order</q-btn>
              <q-btn flat @click="addOrder(true)">New VIP Order</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <div class="col q-px-md">
      <q-card class="my-card">
        <q-card-section class="bg-grey-8 text-white">
          <div class="text-h6 text-center">
            Robots
            <div class="robot-status">
              <ul>
                <li><span class="pending-box"></span> = Pending</li>
                <li><span class="preparing-box"></span> = Preparing</li>
              </ul>
            </div>
          </div>
        </q-card-section>

        <q-scroll-area style="height: 120px">
          <div class="row">
            <div
              v-for="bot in bots"
              :key="bot.id"
              class="col-4 col-md-2 q-pa-sm"
            >
              <robot-card :bot="bot" />
            </div>
          </div>
        </q-scroll-area>
      </q-card>
    </div>
    <div class="col-shrink">
      <div class="row">
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-grey-8 text-white">
              <div class="text-h6 text-center">Pending</div>
            </q-card-section>

            <div class="q-pa-sm">
              <q-scroll-area style="height: 120px">
                <table
                  class="text-center"
                  style="width: 100%; border-collapse: collapse"
                >
                  <tr>
                    <th>Order ID</th>
                    <th>Order Type</th>
                    <th>Status</th>
                    <th>Count Down (Second)</th>
                    <th>Queue</th>
                  </tr>

                  <tr v-for="(order, index) in pendingOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td :class="order.isVIP ? 'text-yellow-8' : ''">
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
                    <td>
                      <q-icon name="hourglass_top" size="1rem" color="blue" />{{
                        order.cookPeriod
                      }}
                      / {{ order.botId! % 2 === 0 ? '10' : '5' }} (Bot
                      {{ order.botId }})
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td @click="removeOrder(order.id)" style="cursor: pointer">
                      <q-icon name="delete" size="1.5rem" color="red" />
                    </td>
                  </tr>
                </table>
              </q-scroll-area>
            </div>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-grey-8 text-white">
              <div class="text-h6 text-center">Complete</div>
            </q-card-section>

            <div class="q-pa-sm">
              <q-scroll-area style="height: 120px">
                <table class="text-center" style="width: 100%">
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Order Type</th>
                    <th>Status</th>
                    <th>Completed At</th>
                  </tr>
                  <tr v-for="(order, index) in completedOrders" :key="order.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ order.id }}</td>
                    <td :class="order.isVIP ? 'text-yellow-8' : ''">
                      {{ order.isVIP ? 'VIP Order' : 'Normal Order' }}
                    </td>
                    <td class="text-green text-bold">
                      <q-icon name="done" size="1rem" color="green" />
                    </td>
                    <td>
                      {{ moment(order.completedAt).format('HH:mm:ss A') }}
                    </td>
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

<style scoped>
.robot-status {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}
.robot-status > ul {
  list-style: none;
}
.robot-status > ul > li {
  text-align: left;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
}
.robot-status > ul > li > span {
  display: inline-block;
}
.pending-box {
  width: 10px;
  height: 10px;
  background-color: #66a3ff;
}
.preparing-box {
  width: 10px;
  height: 10px;
  background-color: #fc6c3e;
}
</style>

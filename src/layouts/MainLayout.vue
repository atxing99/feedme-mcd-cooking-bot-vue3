<script setup lang="ts">
import { ref, computed } from 'vue';
import YoutubeVideo from 'src/components/youtubeVideo.vue';

interface Order {
  id: number;
  isVIP: boolean;
  botId: number | null;
  isCompleted: boolean;
}

interface Bot {
  id: number;
  orderId: number | null;
  timer?: NodeJS.Timeout;
}

interface IYoutubeBox {
  link: string;
  title: string;
}

const youtubeBoxes: IYoutubeBox[] = [
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  },
  {
    link: 'https://www.youtube.com/embed/rivk3p5Ps6Q',
    title: 'THE BLACKFAST'
  }
];

let botIndex = 1;
let orderIndex = 1;
const cookTime = ref<number>(10);
const bots = ref<Bot[]>([]);
const orders = ref<Order[]>([]);

const timer = setTimeout(() => {
  cookTime.value--;
}, 1000);

const pendingOrders = computed(() =>
  orders.value.filter((order) => order.isCompleted === false)
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

      clearTimeout(removedBot.timer);
    }
  }
}

function addOrder(isVIP = false) {
  orders.value.push({
    id: orderIndex++,
    isVIP: isVIP,
    botId: null,
    isCompleted: false
  });

  const freeBot: Bot = bots.value.filter((bot) => bot.orderId === null)[0];

  if (freeBot) {
    botGetOrder(freeBot);
  }
}

function botGetOrder(bot: Bot) {
  const freePendingOrder: Order = orders.value
    .filter((order) => order.botId === null)
    .sort((orderA, orderB) => Number(orderB.isVIP) - Number(orderA.isVIP))[0];

  if (freePendingOrder) {
    freePendingOrder.botId = bot.id;
    bot.orderId = freePendingOrder.id;
    bot.timer = setTimeout(() => {
      freePendingOrder.isCompleted = true;
      bot.orderId = null;
      botGetOrder(bot);
    }, 10000);
  }
}
</script>

<template>
  <div class="row">
    <div
      class="col-md-3"
      v-for="(youtubeBox, index) in youtubeBoxes"
      :key="index"
    >
      <youtube-video :link="youtubeBox.link" :title="youtubeBox.title" />
    </div>
  </div>

  <div class="column window-height bg-grey hidden">
    <div class="col-shrink">
      <div class="text-h5 text-center q-pa-md">FeedMe</div>
      <div class="row">
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
              <div class="text-h6 text-center">Robot</div>
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
              <table class="text-center" style="width: 100%">
                <tr>
                  <td>Order ID</td>
                  <td>Order Type</td>
                  <td>Status</td>
                  <td>Count Down</td>
                  <td>Queue</td>
                </tr>

                <tr v-for="(order, index) in pendingOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.isVIP ? 'VIP Order' : 'Normal Order' }}</td>
                  <td :class="{ processing: order.botId }">
                    {{
                      !order.botId
                        ? 'Pending'
                        : 'Processing in Bot ' + order.botId
                    }}
                  </td>
                  <td>1</td>
                  <td>{{ index + 1 }}</td>
                </tr>
              </table>
            </div>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
              <div class="text-h6 text-center">Complete</div>
            </q-card-section>

            <div class="q-pa-sm">
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

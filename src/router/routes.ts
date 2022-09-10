import { RouteRecordRaw } from 'vue-router';
import OrderPage from 'pages/order.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => OrderPage
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;

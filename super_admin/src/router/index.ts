import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import AppRecordsListView from '@/views/AppRecordsListView.vue';
import DbInfoRecordsListView from '@/views/DbInfoRecordsListView.vue';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/apps',
    name: 'apps',
    component: AppRecordsListView,
  },
  {
    path: '/databases',
    name: 'databases',
    component: DbInfoRecordsListView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

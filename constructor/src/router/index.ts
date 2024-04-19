import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DataTypesView from '../views/DataTypesView.vue';
import MetadataKindsView from '../views/MetadataKindsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/datatypes',
    name: 'datatypes',
    component: DataTypesView,
  },
  {
    path: '/metadatakinds',
    name: 'metadatakinds',
    component: MetadataKindsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

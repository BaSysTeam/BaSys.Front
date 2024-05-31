import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import FileStorageTest from '@/views/FileStorageTest.vue';
import HomeView from '../views/HomeView.vue';
import UserSettingsView from '../views/UserSettingsView.vue';
import DataObjectsView from '../views/DataObjectsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/usersettings',
    name: 'usersettings',
    component: UserSettingsView,
  },
  {
    path: '/filestoragetest',
    name: 'filestoragetest',
    component: FileStorageTest,
  },
  {
    path: '/data-objects/:kind/:name',
    name: 'data-objects',
    props: true,
    component: DataObjectsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

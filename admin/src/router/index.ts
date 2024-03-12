import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import UserListView from '../views/UserListView.vue';
import UserEditView from '../views/UserEditView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/users',
    name: 'users',
    component: UserListView,
  },
  {
    path: '/edit/user',
    name: 'editUser',
    component: UserEditView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

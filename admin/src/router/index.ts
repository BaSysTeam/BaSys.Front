import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainSettingView from '@/views/MainSettingView.vue';
import LoggingSettingView from '@/views/LoggingSettingView.vue';
import HomeView from '../views/HomeView.vue';
import UserListView from '../views/UserListView.vue';
import UserEditView from '../views/UserEditView.vue';
import MigrationsView from '../views/MigrationsView.vue';
import UserSettingsView from '../../../app/src/views/UserSettingsView.vue';

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
  {
    path: '/settings/main',
    name: 'mainSetting',
    component: MainSettingView,
  },
  {
    path: '/settings/logging',
    name: 'loggingSetting',
    component: LoggingSettingView,
  },
  {
    path: '/usersettings',
    name: 'usersettings',
    component: UserSettingsView,
  },
  {
    path: '/migrations',
    name: 'migrations',
    component: MigrationsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

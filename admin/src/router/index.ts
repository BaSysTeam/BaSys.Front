import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainSettingView from '@/views/MainSettingView.vue';
import LoggingSettingView from '@/views/LoggingSettingView.vue';
import FileStorageSettingsView from '@/views/FileStorageSettingsView.vue';
import HomeView from '../views/HomeView.vue';
import UserListView from '../views/UserListView.vue';
import UserEditView from '../views/UserEditView.vue';
import MigrationsView from '../views/MigrationsView.vue';

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
    path: '/migrations',
    name: 'migrations',
    component: MigrationsView,
  },
  {
    path: '/settings/fileStorage',
    name: 'fileStorageSetting',
    component: FileStorageSettingsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

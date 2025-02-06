import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainSettingView from '@/views/MainSettingView.vue';
import LoggingSettingView from '@/views/LoggingSettingView.vue';
import FileStorageSettingsView from '@/views/FileStorageSettingsView.vue';
import UserGroupsView from '@/views/UserGroupsView.vue';
import UserGroupEditView from '@/views/UserGroupEditView.vue';
import WorkflowsBoardView from '@/views/WorkflowsBoardView.vue';
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
    path: '/UserGroups',
    name: 'userGroups',
    component: UserGroupsView,
  },
  {
    path: '/edit/userGroup',
    name: 'editUserGroup',
    component: UserGroupEditView,
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
  {
    path: '/workflows-board',
    name: 'workflows-board',
    component: WorkflowsBoardView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

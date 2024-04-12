import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DataTypesComponent from '../components/DataTypesComponent.vue';
import UserSettingsView from '../../../app/src/views/UserSettingsView.vue';
import MetadataKindsComponent from '../components/MetadataKindsComponent.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/datatypes',
    name: 'datatypes',
    component: DataTypesComponent,
  },
  {
    path: '/usersettings',
    name: 'usersettings',
    component: UserSettingsView,
  },
  {
    path: '/metadatakinds',
    name: 'metadatakinds',
    component: MetadataKindsComponent,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

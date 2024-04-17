import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DataTypesComponent from '../components/DataTypesComponent.vue';
import UserSettingsView from '../../../app/src/views/UserSettingsView.vue';
import MetadataKindsListView from '../views/MetadataKindsListView.vue';
import MetadataKindsEditView from '../views/MetadataKindsEditView.vue';

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
    path: '/metadata-kinds',
    name: 'metadata-kinds',
    component: MetadataKindsListView,
  },
  {
    path: '/metadata-kinds/edit/:name',
    name: 'metadata_kinds_edit',
    component: MetadataKindsEditView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

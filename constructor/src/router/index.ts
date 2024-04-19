import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DataTypesView from '../views/DataTypesView.vue';
import UserSettingsView from '../../../app/src/views/UserSettingsView.vue';
<<<<<<< HEAD
import MetadataKindsListView from '../views/MetadataKindsListView.vue';
import MetadataKindsEditView from '../views/MetadataKindsEditView.vue';
=======
import MetadataKindsView from '../views/MetadataKindsView.vue';
>>>>>>> develop

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
    path: '/usersettings',
    name: 'usersettings',
    component: UserSettingsView,
  },
  {
<<<<<<< HEAD
    path: '/metadata-kinds',
    name: 'metadata-kinds',
    component: MetadataKindsListView,
  },
  {
    path: '/metadata-kinds/edit/:name',
    name: 'metadata-kinds-edit',
    component: MetadataKindsEditView,
    props: true,
=======
    path: '/metadatakinds',
    name: 'metadatakinds',
    component: MetadataKindsView,
>>>>>>> develop
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

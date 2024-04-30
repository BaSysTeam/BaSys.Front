import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MetaObjectEditView from '@/views/MetaObjectEditView.vue';
import HomeView from '../views/HomeView.vue';
import DataTypesView from '../views/DataTypesView.vue';
import MetadataKindsListView from '../views/MetadataKindsListView.vue';
import MetadataKindsEditView from '../views/MetadataKindsEditView.vue';
import MetadataInstanceView from '../views/MetadataInstanceView.vue';

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
    path: '/metadata-kinds',
    name: 'metadata-kinds',
    component: MetadataKindsListView,
  },
  {
    path: '/metadata-kinds/edit/:name',
    name: 'metadata-kinds-edit',
    component: MetadataKindsEditView,
    props: true,
  },
  {
    path: '/meta-object/edit/:kind/:name',
    name: 'meta-object-edit',
    component: MetaObjectEditView,
    props: true,
  },
  {
    path: '/metadata-instance',
    name: 'metadata-instance',
    component: MetadataInstanceView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

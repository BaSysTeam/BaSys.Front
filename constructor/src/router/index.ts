import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MetaObjectEditView from '@/views/MetaObjectEditView.vue';
import MetaObjectsListView from '@/views/MetaObjectsListView.vue';
import ExpressionsConsoleView from '@/views/ExpressionsConsoleView.vue';
import MetaObjectMenuEditView from '@/views/MetaObjectMenuEditView.vue';
import MetaObjectWorkflowEditView from '@/views/MetaObjectWorkflowEditView.vue';
import HomeView from '../views/HomeView.vue';
import DataTypesView from '../views/DataTypesView.vue';
import MetadataKindsListView from '../views/MetaObjectKindsListView.vue';
import MetadataKindsEditView from '../views/MetaObjectKindsEditView.vue';

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
    path: '/console',
    name: 'console',
    component: ExpressionsConsoleView,
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
    path: '/meta-menus/add',
    name: 'meta-menus-add',
    component: MetaObjectMenuEditView,
    props: true,
  },
  {
    path: '/meta-menus/edit/:name',
    name: 'meta-menus-edit',
    component: MetaObjectMenuEditView,
    props: true,
  },
  {
    path: '/meta-menus/copy/:name',
    name: 'meta-menus-copy',
    component: MetaObjectMenuEditView,
    props: true,
  },
  {
    path: '/meta-workflows/add',
    name: 'meta-workflows-add',
    component: MetaObjectWorkflowEditView,
    props: true,
  },
  {
    path: '/meta-workflows/edit/:name',
    name: 'meta-workflows-edit',
    component: MetaObjectWorkflowEditView,
    props: true,
  },
  {
    path: '/meta-workflows/copy/:name',
    name: 'meta-workflows-copy',
    component: MetaObjectWorkflowEditView,
    props: true,
  },
  {
    path: '/meta-objects/add/:kind',
    name: 'meta-objects-add',
    component: MetaObjectEditView,
    props: true,
  },
  {
    path: '/meta-objects/edit/:kind/:name',
    name: 'meta-objects-edit',
    component: MetaObjectEditView,
    props: true,
  },
  {
    path: '/meta-objects/copy/:kind/:name',
    name: 'meta-objects-copy',
    component: MetaObjectEditView,
    props: true,
  },
  {
    path: '/meta-objects/list/:kind',
    name: 'meta-objects-list',
    component: MetaObjectsListView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

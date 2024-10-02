<script setup lang="ts">
import {
  ref, onMounted, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import MetaObject from '@/models/metaObject';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import MetaObjectCreateComponent from '@/components/MetaObjectCreateComponent.vue';
import { useI18n } from 'vue-i18n';
import MetaObjectCreateDto from '@/models/metaObjectCreateDto';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// @component
const name = 'MetaObjectsListView';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({ kind: { type: String, required: true } });

// Data
const isWaiting = ref(false);
const isCreateDialogOpen = ref(false);
const kindTitle = ref('');
const items = ref<MetaObject[]>([]);
const selectedRow = ref<any>({});

const dataTableStyle = computed(() => ({
  height: `${window.innerHeight - 150}px`,
}));

const formTitle = computed(() => `${t('metaObjects')}: ${kindTitle.value}`);

const provider = new MetaObjectProvider();

async function updateListAsync(kindName: string): Promise<void> {
  isWaiting.value = true;

  const result = await provider.getKindList(kindName);

  if (result.isOK) {
    kindTitle.value = result.data.title;
    items.value = [];
    result.data.items.forEach((item: any) => {
      items.value.push(item);
    });

    if (items.value.length) {
      const [firstValue] = items.value;
      selectedRow.value = firstValue;
    }
  }

  isWaiting.value = false;
}

function isSelectedRowEmpty(): boolean {
  return Object.keys(selectedRow.value).length === 0;
}

function navigateToEdit(): void {
  if (isSelectedRowEmpty()) {
    return;
  }
  const metaObject = selectedRow.value as MetaObject;
  router.push({ name: 'meta-objects-edit', params: { kind: props.kind, name: metaObject.name } });
}

watch(() => props.kind, async (newVal) => {
  await updateListAsync(newVal);
});

// Event handlers
function onAddClicked(): void {
  isCreateDialogOpen.value = true;
}

function onEditClicked(): void {
  navigateToEdit();
}

function onDeleteClicked(): void {
  console.log('Delete clicked');
}

function onRowDblClick(): void {
  navigateToEdit();
}

async function onCreateDialogClose(args: MetaObjectCreateDto): Promise<void> {
  isCreateDialogOpen.value = false;
  if (args) {
    console.log('Object to create', args);
    const response = await provider.create(args);
    if (response.isOK) {
      await router.push({ name: 'meta-objects-edit', params: { kind: props.kind, name: args.name } });
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
}

// Life cycle hooks
onMounted(async () => {
  await updateListAsync(props.kind);
});

</script>

<template>
  <!--View title-->
  <div class="grid">
    <div class="col">
      <ViewTitleComponent :title="formTitle" :is-modified="false" :is-waiting="isWaiting" />
    </div>
  </div>
  <!--Command panel-->
  <div class="grid">
    <div class="col-12">
      <ButtonGroup>
        <Button
          :label="$t('add')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-plus"
          @click="onAddClicked"
        />
        <Button
          :label="$t('edit')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-pencil"
          @click="onEditClicked"
        />
        <Button
          :label="$t('delete')"
          severity="danger"
          size="small"
          outlined
          icon="pi pi-trash"
          @click="onDeleteClicked"
        />
      </ButtonGroup>
    </div>
  </div>
  <!--Divider-->
  <div class="grid">
    <Divider class="m-2" />
  </div>
  <!--List-->
  <div class="grid">
    <div class="col-12">
      <div class="card m-1">
        <DataTable
          v-model:selection="selectedRow"
          :value="items"
          :style="dataTableStyle"
          :metaKeySelection="true"
          showGridlines
          size="small"
          selectionMode="single"
          dataKey="uid"
          @row-dblclick="onRowDblClick"
        >
          <template #empty> {{$t('noItemsFound')}} </template>
          <Column header="#" style="width: 50px">
            <template #body="currentRow">
              {{ currentRow.index + 1 }}
            </template>
          </Column>
          <Column field="title" :header="$t('title')"></Column>
          <Column field="name" :header="$t('name')"></Column>
          <Column field="memo" :header="$t('memo')"></Column>
          <Column field="isActive" :header="$t('isActive')" data-type="boolean">
            <template #body="{ data }">
              <div class="flex justify-content-center flex-wrap">
                <i v-if="data.isActive" class="pi pi-check-circle text-green-500"></i>
              </div>
            </template>
          </Column>

        </DataTable>
      </div>
    </div>
  </div>

  <!--Create dialog-->
  <MetaObjectCreateComponent v-if="isCreateDialogOpen"
                             :kind-name="props.kind"
                             :kind-title="kindTitle"
                             @close="onCreateDialogClose"></MetaObjectCreateComponent>
</template>

<style scoped>

</style>

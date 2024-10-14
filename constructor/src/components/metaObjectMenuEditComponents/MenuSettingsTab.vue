<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, PropType, defineEmits, watch, computed,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import SplitButton from 'primevue/splitbutton';
import Listbox from 'primevue/listbox';
import Badge from 'primevue/badge';
import ConfirmDialog from 'primevue/confirmdialog';
import MenuSettingsPropertiesPanel
  from '@/components/metaObjectMenuEditComponents/MenuSettingsPropertiesPanel.vue';
import MetaObjectKind from '@/models/metaObjectKind';
import MenuSettings from '../../../../shared/src/models/menuModel/menuSettings';
import UpDownHelper from '../../../../shared/src/helpers/upDowHelper';

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MenuSettings>,
    required: true,
  },
  kindsSource: {
    type: Object as PropType<MetaObjectKind>,
  },
});

// Infrastructure
const confirmVue = useConfirm();
const { t } = useI18n({ useScope: 'global' });

// Data
const addMenuGroupItems = ref<any[]>([]);
const selectedGroup = ref<any>(null);

// Emits
const emit = defineEmits({ change: () => true });

// Methods
function deleteMenuGroup(): void {
  if (!selectedGroup.value) {
    return;
  }

  props.settings.deleteItem(selectedGroup.value);

  if (props.settings.items.length) {
    const [firstItem] = props.settings.items;
    selectedGroup.value = firstItem;
  }
}

// Event handlers
function onMenuGroupAddClick(kind: string): void {
  let newGroup: any;
  switch (kind) {
    case 'group':
      newGroup = props.settings.addGroup();
      break;
    case 'item':
      newGroup = props.settings.addItem();
      break;
    case 'separator':
      newGroup = props.settings.addSeparator();
      break;
    default:
      throw new Error(`Unknown group kind ${kind}`);
  }

  selectedGroup.value = newGroup;
  emit('change');
}

function onMenuGroupDeleteClick(): void {
  if (!selectedGroup.value) {
    return;
  }

  confirmVue.require({
    message: t('deleteItemQuestion'),
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('delete'),
    accept: () => deleteMenuGroup(),
  });
}

function onMenuGroupUpClick(): void {
  if (!selectedGroup.value) {
    return;
  }
  UpDownHelper.up(props.settings.items, selectedGroup.value);

  emit('change');
}

function onMenuGroupDownClick(): void {
  if (!selectedGroup.value) {
    return;
  }
  UpDownHelper.down(props.settings.items, selectedGroup.value);

  emit('change');
}

function onChange(): void {
  emit('change');
}

// Life cycle hooks.
onBeforeMount(() => {
  addMenuGroupItems.value = [
    {
      label: 'Group',
      command: () => onMenuGroupAddClick('group'),
    },
    {
      label: 'Item',
      command: () => onMenuGroupAddClick('item'),
    },
    {
      label: 'Separator',
      command: () => onMenuGroupAddClick('separator'),
    },
  ];
});

</script>

<template>
<div class="grid">
  <div class="col-3 h-screen" style="border-right: 1px solid #ececec;">
    <!--Menu toolbar-->
    <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
      <template #start>
        <SplitButton
          v-tooltip.top="$t('add')"
          label="+"
          icon = "pi pi-plus"
          severity="primary"
          size="small"
          class="ml-1"
          outlined
          :model="addMenuGroupItems"
        />
        <Button icon="pi pi-times"
                v-tooltip.top="$t('delete')"
                severity="danger"
                size="small"
                text
                @click="onMenuGroupDeleteClick" />
        <Button class="ml-2"
                v-tooltip.top="$t('up')"
                icon="pi pi-arrow-up"
                severity="primary"
                size="small"
                text
                @click="onMenuGroupUpClick" />
        <Button icon="pi pi-arrow-down"
                v-tooltip.top="$t('down')"
                severity="primary"
                size="small"
                text
                @click="onMenuGroupDownClick" />
      </template>
    </Toolbar>

    <!--Groups list-->
    <Listbox v-if="settings"
             v-model="selectedGroup"
             :options="settings.items"
             option-label="title">
      <template #option="{option, index}">
        <div>
          <Badge :value="index+1" severity="info"></Badge>
          <span class="ml-2" v-if="option.kind == 2">--------------</span>
          <span class="ml-2" v-if="option.kind != 2">{{option.title}}</span>
        </div>
      </template>
    </Listbox>
  </div>

  <div class="col-3 h-screen" style="border-right: 1px solid #ececec;"></div>

  <div class="col-6">
    <MenuSettingsPropertiesPanel :menu-group="selectedGroup"
                                 :kinds-source="kindsSource"
                                 @change="onChange"></MenuSettingsPropertiesPanel>
  </div>
</div>

  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>

</style>

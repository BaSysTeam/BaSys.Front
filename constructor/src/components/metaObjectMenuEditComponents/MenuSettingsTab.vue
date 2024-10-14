<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, PropType, defineEmits, watch, computed,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import SplitButton from 'primevue/splitbutton';
import Listbox from 'primevue/listbox';
import Badge from 'primevue/badge';
import ConfirmDialog from 'primevue/confirmdialog';
import MenuSettingsPropertiesPanel
  from '@/components/metaObjectMenuEditComponents/MenuSettingsPropertiesPanel.vue';
import MetaObjectKind from '@/models/metaObjectKind';
import MenuSettings from '../../../../shared/src/models/menuModel/menuSettings';
import MenuSettingsColumn from '../../../../shared/src/models/menuModel/menuSettingsColumn';
import MenuSettingsSubItem from '../../../../shared/src/models/menuModel/menuSettingsSubItem';
import MenuSettingsLinkItem from '../../../../shared/src/models/menuModel/menuSettingsLinkItem';
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
const addMenuColumnItems = ref<any[]>([]);
const selectedGroup = ref<any>(null);
const selectedMenuColumn = ref<MenuSettingsColumn>(null);
const selectedSubItem = ref<MenuSettingsSubItem>(null);
const selectedItem = ref<MenuSettingsLinkItem>(null);

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

function onMenuColumnAddClick(kind: string): void {
  switch (kind) {
    case 'column':
      if (selectedGroup.value) {
        selectedMenuColumn.value = selectedGroup.value.newColumn();
      }
      break;
    case 'subGroup':
      if (selectedMenuColumn.value) {
        selectedSubItem.value = selectedMenuColumn.value.newSubItem();
      }
      break;
    case 'item':
      if (selectedSubItem.value) {
        selectedItem.value = selectedSubItem.value.newItem();
      }
      break;
    case 'separator':
      if (selectedSubItem.value) {
        selectedItem.value = selectedSubItem.value.newSeparator();
      }
      break;
    default:
      throw new Error(`Unknown group kind ${kind}`);
  }
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

function onMenuItemClick(option:any, menuColumn:any): void {
  console.log('OnMenuItemClick', option, menuColumn);
  selectedItem.value = option;
  selectedMenuColumn.value = menuColumn.value;
}

function onMenuSubItemClick(option:any, menuColumn:any): void {
  console.log('OnMenuSubItemClick', option, menuColumn);
  selectedSubItem.value = option;
  selectedMenuColumn.value = menuColumn;
}

function onSubItemDeleteClick(option:any, menuColumn:any): void {
  console.log('OnSubItemDeleteClick', option, menuColumn);
}

// Life cycle hooks.
onBeforeMount(() => {
  addMenuGroupItems.value = [
    {
      label: t('menu'),
      command: () => onMenuGroupAddClick('group'),
    },
    {
      label: t('item'),
      command: () => onMenuGroupAddClick('item'),
    },
    {
      label: t('separator'),
      command: () => onMenuGroupAddClick('separator'),
    },
  ];

  addMenuColumnItems.value = [
    {
      label: t('column'),
      command: () => onMenuColumnAddClick('column'),
    },
    {
      label: t('subGroup'),
      command: () => onMenuColumnAddClick('subGroup'),
    },
    {
      label: t('item'),
      command: () => onMenuColumnAddClick('item'),
    },
    {
      label: t('separator'),
      command: () => onMenuColumnAddClick('separator'),
    },
  ];
});

</script>

<template>
<div class="grid bs-menu-settings-tab">
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

  <!-- Items column-->
  <div class="col-3 h-screen" style="border-right: 1px solid #ececec;">
    <div v-if="selectedGroup && selectedGroup.kind == 3">
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
            :model="addMenuColumnItems"
          />
        </template>

      </Toolbar>

      <Card :key="menuColumn.uid"
            class="mb-1"
            v-for="menuColumn in selectedGroup.items">
        <template #content>
          <Listbox :options="menuColumn.items"
                   option-label="title"
                   option-group-label="title"
                   option-group-children="items">
            <template #optiongroup="{option}">
              <div role="button"
                   tabindex="0"
                   @keydown.enter="onMenuSubItemClick(option, menuColumn)"
                   @keydown.space="onMenuSubItemClick(option, menuColumn)"
                   @click="onMenuSubItemClick(option, menuColumn)">
                <span>{{option.title}}</span>
              </div>
            </template>
            <template #option="{option}">
              <div role="button"
                   tabindex="0"
                   @keydown.enter="onMenuItemClick(option, menuColumn)"
                   @keydown.space="onMenuItemClick(option, menuColumn)"
                   @click="onMenuItemClick(option, menuColumn)">
                <span>{{option.title}}</span>
              </div>
            </template>
          </Listbox>
        </template>

      </Card>
    </div>

  </div>

  <!-- Properties column-->
  <div class="col-6">
    <MenuSettingsPropertiesPanel :menu-group="selectedGroup"
                                 :sub-group="selectedSubItem"
                                 :link-item="selectedItem"
                                 :kinds-source="kindsSource"
                                 @change="onChange"></MenuSettingsPropertiesPanel>
  </div>
</div>

  <ConfirmDialog></ConfirmDialog>
</template>

<style>
.bs-menu-settings-tab .p-card-body{
  padding: 0!important;
}

.bs-menu-settings-tab .bs-selected{
  background-color: #ececec;
}

</style>

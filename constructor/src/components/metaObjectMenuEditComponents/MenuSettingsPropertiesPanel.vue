<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, PropType, defineEmits, watch, computed, onDeactivated,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputSwitch from 'primevue/inputswitch';
import MetaObjectKind from '@/models/metaObjectKind';
import MenuSettingsGroupItem from '../../../../shared/src/models/menuModel/menuSettingsGroupItem';
import MenuSettingsSubItem from '../../../../shared/src/models/menuModel/menuSettingsSubItem';
import MenuSettingsLinkItem from '../../../../shared/src/models/menuModel/menuSettingsLinkItem';

// Props
const props = defineProps({
  menuGroup: {
    type: Object as PropType<MenuSettingsGroupItem>,
  },
  subGroup: {
    type: Object as PropType<MenuSettingsSubItem>,
  },
  linkItem: {
    type: Object as PropType<MenuSettingsLinkItem>,
  },
  kindsSource: {
    type: Object as PropType<MetaObjectKind>,
  },
});

// Infrastructure
const { t } = useI18n({ useScope: 'global' });

// Data
const groupKindOptions = ref<any[]>([]);
const itemKindOptions = ref<any[]>([]);
const windowHeight = ref(window.innerHeight);
const containerStyle = computed(() => ({
  height: `${windowHeight.value - 150}px`,
  overflowY: 'auto',
}));

// Emits
const emit = defineEmits({ change: () => true });

// Event handlers
function onResize(): void {
  windowHeight.value = window.innerHeight;
}

function onChange():void {
  emit('change');
}

// Life cycle hooks
onBeforeMount(() => {
  groupKindOptions.value = [
    {
      label: t('menu'),
      value: 3,
    },
    {
      label: t('item'),
      value: 1,
    },
    {
      label: t('separator'),
      value: 2,
    },
  ];

  itemKindOptions.value = [
    {
      label: t('item'),
      value: 1,
    },
    {
      label: t('separator'),
      value: 2,
    },
  ];
});

onMounted(async () => {
  window.addEventListener('resize', onResize);
  windowHeight.value = window.innerHeight;
});

onDeactivated(() => {
  window.removeEventListener('resize', onResize);
});

</script>

<template>
  <div :style="containerStyle">
  <Accordion :multiple="true" :active-index="[0, 1, 2]">
    <AccordionTab :header="$t('menu')" v-if="menuGroup">
      <div class="grid">
        <div class="col-12">
          <!--Group kind-->
          <SelectButton :options="groupKindOptions"
                        option-label="label"
                        option-value="value"
                        v-model="menuGroup.kind"
                        @change="onChange"></SelectButton>
        </div>
      </div>
      <div class="grid" v-if="menuGroup.kind != 2">
        <div class="col-12">

          <!--Title-->
          <FieldGridComponent :title="$t('title')"
                              label-for="group-title">
            <InputText id="group-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="menuGroup.title"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Icon class-->
          <FieldGridComponent :title="$t('icon')"
                              label-for="group-icon-class">
            <InputText id="group-icon-class"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="menuGroup.iconClass"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Link-->
          <FieldGridComponent :title="$t('link')"
                              label-for="group-link"
                              :required="true" v-if="menuGroup.kind === 1">
            <InputText id="group-link"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="menuGroup.url"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Auto-fill-->
          <FieldGridComponent :title="$t('autoFill')"
                              label-for="group-auto-fill"
                              v-if="menuGroup.kind == 3">
            <InputSwitch id="group-auto-fill"
                         v-model="menuGroup.autoFill"
                         @change="onChange"></InputSwitch>

          </FieldGridComponent>

          <!--Meta object kind-->
          <FieldGridComponent :title="$t('metaObjectKind')"
                              label-for="group-meta-object-kind"
                              :required="true"
                              v-if="menuGroup.kind == 3 && menuGroup.autoFill">
            <Dropdown v-model="menuGroup.metaObjectKindUid"
                      :options="kindsSource"
                      option-label="title"
                      option-value="uid"
                      class="w-full"
                      size="small"
                      @change="onChange"></Dropdown>

          </FieldGridComponent>

          <!--Items per column-->
          <FieldGridComponent :title="$t('itemsPerColumn')"
                              label-for="group-items-per-column"
                              :required="true"
                              v-if="menuGroup.kind == 3 && menuGroup.autoFill">
            <InputNumber id="group-items-per-column"
                         v-model="menuGroup.itemsPerColumn"
                         size="small"
                         @change="onChange"></InputNumber>
          </FieldGridComponent>

          <!--Is visible-->
          <FieldGridComponent :title="$t('isVisible')"
                              label-for="group-is-visible">
            <InputSwitch id="group-is-visible"
                         v-model="menuGroup.isVisible"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>

        </div>
      </div>

    </AccordionTab>

    <!--Sub group-->
    <AccordionTab :header="$t('subGroup')" v-if="subGroup">
      <div class="grid">
        <div class="col-12">
          <!--Title-->
          <FieldGridComponent :title="$t('title')"
                              label-for="sub-group-title">
            <InputText id="sub-group-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="subGroup.title"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Is visible-->
          <FieldGridComponent :title="$t('isVisible')"
                              label-for="link-is-visible">
            <InputSwitch id="link-is-visible"
                         v-model="subGroup.isVisible"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>
        </div>
      </div>
    </AccordionTab>

    <!--Link item-->
    <AccordionTab :header="$t('item')" v-if="linkItem">
      <div class="grid">
        <div class="col-12">
          <!--Group kind-->
          <SelectButton :options="itemKindOptions"
                        option-label="label"
                        option-value="value"
                        v-model="linkItem.kind"
                        @change="onChange"></SelectButton>
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
          <!--Title-->
          <FieldGridComponent :title="$t('title')"
                              label-for="link-title"
                              v-if="linkItem.kind == 1">
            <InputText id="link-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="linkItem.title"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Icon class-->
          <FieldGridComponent :title="$t('icon')"
                              label-for="link-icon-class"
                              v-if="linkItem.kind == 1">
            <InputText id="link-icon-class"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="linkItem.iconClass"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Link-->
          <FieldGridComponent :title="$t('link')"
                              label-for="group-link"
                              :required="true" v-if="linkItem.kind === 1">
            <InputText id="group-link"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="linkItem.url"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Is visible-->
          <FieldGridComponent :title="$t('isVisible')"
                              label-for="link-is-visible">
            <InputSwitch id="link-is-visible"
                         v-model="linkItem.isVisible"
                         @change="onChange"></InputSwitch>
          </FieldGridComponent>
        </div>
      </div>
    </AccordionTab>
  </Accordion>
  </div>
</template>

<style scoped>

</style>

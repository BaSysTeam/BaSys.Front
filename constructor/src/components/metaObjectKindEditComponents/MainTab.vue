<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeMount,
  defineProps,
  defineEmits,
  watch,
  computed,
  PropType,
  onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import MetaObjectKindSettings from '../../../../shared/src/models/metaObjectKindSettings';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectKindSettings>,
    required: true,
  },
  windowHeight: {
    type: Number,
    required: true,
  },
});

// Data
const containerStyle = computed(() => ({
  height: `${props.windowHeight - 180}px`,
  overflowY: 'auto',
}));

// Emits
const emit = defineEmits(
  {
    change: () => true,
    canCreateRecordsChange: () => true,
  },
);

// Methods

// Event handlers
function onChange(): void {
  emit('change');
}

function onCanCreateRecordsChange(): void {
  emit('canCreateRecordsChange');
}

// Life cycle hooks

</script>

<template>
<div class="grid" :style="containerStyle">
  <div class="col-8">
    <!--Uid-->
    <FieldGridComponent title="Uid" label-for="fld-uid">
      <InputText id="fld-uid"
                 size="small"
                 autocomplete="off"
                 disabled
                 class="w-full"
                 v-model="settings.uid"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Title-->
    <FieldGridComponent :title="$t('title')"
                        :required="true"
                        label-for="fld-title">
      <InputText id="fld-title"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.title"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Name-->
    <FieldGridComponent :title="$t('name')"
                        :required="true"
                        label-for="fld-name">
      <InputText id="fld-name"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.name"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Prefix-->
    <FieldGridComponent :title="$t('prefix')"
                        :required="true"
                        label-for="fld-prefix">
      <InputText id="fld-prefix"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.prefix"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Icon class-->
    <FieldGridComponent :title="$t('iconClass')"
                        label-for="fld-icon-class">
      <InputText id="fld-icon-class"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.iconClass"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Store data-->
    <FieldGridComponent :title="$t('storeData')"
                        label-for="fld-store-data">
      <InputSwitch id="fld-store-data"
                   v-model="settings.storeData"
                   @change="onChange"></InputSwitch>
    </FieldGridComponent>

    <!--Is reference-->
    <FieldGridComponent :title="$t('isReference')"
                        label-for="fld-is-reference">
      <InputSwitch id="fld-is-reference"
                   v-model="settings.isReference"
                   @change="onChange"></InputSwitch>
    </FieldGridComponent>

    <!--Allow attached files-->
    <FieldGridComponent :title="$t('allowAttachedFiles')"
                        label-for="fld-allow-attached-files">
      <InputSwitch id="fld-allow-attached-files"
                   v-model="settings.allowAttachedFiles"
                   @change="onChange"></InputSwitch>
    </FieldGridComponent>

    <!--Use Detail Tables-->
    <FieldGridComponent :title="$t('detailsTables')"
                        label-for="fld-use-detail-tables">
      <InputSwitch id="fld-use-detail-tables"
                   v-model="settings.useDetailsTables"
                   @change="onChange"></InputSwitch>
    </FieldGridComponent>

    <!--Can create records-->
    <FieldGridComponent :title="$t('canCreateRecords')"
                        label-for="fld-can-create-records">
      <InputSwitch id="fld-can-create-records"
                   v-model="settings.canCreateRecords"
                   @change="onCanCreateRecordsChange"></InputSwitch>
    </FieldGridComponent>

    <!--OrderBy Expression-->
    <FieldGridComponent :title="$t('orderExpression')"
                        label-for="fld-order-by-expression">
      <InputText id="fld-order-by-expression"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.orderByExpression"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Display expression-->
    <FieldGridComponent :title="$t('displayExpression')"
                        label-for="fld-display-expression">
      <InputText id="fld-display-expression"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.displayExpression"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Memo-->
    <FieldGridComponent :title="$t('memo')"
                        label-for="fld-memo">
      <Textarea id="fld-memo"
                size="small"
                autocomplete="off"
                class="w-full"
                rows="3"
                v-model="settings.memo"
                @change="onChange"></Textarea>
    </FieldGridComponent>
  </div>
</div>
</template>

<style scoped>

</style>

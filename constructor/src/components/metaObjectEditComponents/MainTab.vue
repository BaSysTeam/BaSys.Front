<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, inject,
} from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import OverlayPanel from 'primevue/overlaypanel';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import NameHelper from '../../../../shared/src/helpers/nameHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });

const editMethods = ref([
  { value: 0, text: t('editMethodPage') },
  { value: 1, text: t('editMethodDialog') },
]);

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
});

// Data
const helpService: any = inject('helpService');
const helpPanel = ref();
const helpText = ref<string>('');

// Emits
const emit = defineEmits({ change: () => true });

// Event handlers
function onChange():void {
  emit('change');
}

function onTitleChange(): void {
  if (!props.settings.name) {
    props.settings.name = NameHelper.prepareName(props.settings.title, true, 30);
  }

  emit('change');
}

function onHelpClick(evt: any, key: string): void {
  helpText.value = helpService.getHelp(key);
  helpPanel.value.toggle(evt);
}

</script>

<template>
<div class="grid">
  <div class="col-8">

    <!--Uid-->
    <FieldGridComponent title="Uid"
                        label-for="fld-uid"
                        :is-help="true"
                        help-key="constructor.uid"
                        @helpClick="onHelpClick">
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
                        label-for="fld-title"
                        :is-help="true"
                        help-key="constructor.title"
                        @helpClick="onHelpClick">
      <InputText id="fld-title"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.title"
                 @change="onTitleChange"></InputText>
    </FieldGridComponent>

    <!--Name-->
    <FieldGridComponent :title="$t('name')"
                        :required="true"
                        label-for="fld-name"
                        :is-help="true"
                        help-key="metaObject.name"
                        @helpClick="onHelpClick">
      <InputText id="fld-name"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.name"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Order expression-->
    <FieldGridComponent :title="$t('orderExpression')"
                        label-for="fld-order-expression"
                        :is-help="true"
                        help-key="metaObject.orderByExpression"
                        @helpClick="onHelpClick">

      <InputText id="fld-order-expression"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.orderByExpression"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Display expression-->
    <FieldGridComponent :title="$t('displayExpression')"
                        label-for="fld-display-expression"
                        :is-help="true"
                        help-key="metaObject.displayExpression"
                        @helpClick="onHelpClick">
      <InputText id="fld-display-expression"
                 size="small"
                 autocomplete="off"
                 class="w-full"
                 v-model="settings.displayExpression"
                 @change="onChange"></InputText>
    </FieldGridComponent>

    <!--Edit method-->
    <FieldGridComponent :title="$t('editMethod')"
                        label-for="fld-edit-method"
                        :is-help="true"
                        help-key="metaObject.editMethod"
                        @helpClick="onHelpClick">

      <Dropdown id="fld-edit-method"
                class="w-full"
                size="small"
                v-model="settings.editMethod"
                :options="editMethods"
                option-label="text"
                option-value="value"
                @change="onChange"></Dropdown>

    </FieldGridComponent>

    <!--Is active-->
    <FieldGridComponent :title="$t('isActive')"
                        label-for="fld-is-active"
                        :is-help="true"
                        help-key="metaObject.isActive"
                        @helpClick="onHelpClick">

      <InputSwitch id="fld-is-active"
                   v-model="settings.isActive"
                   @change="onChange"></InputSwitch>
    </FieldGridComponent>

    <!--Memo-->
    <FieldGridComponent :title="$t('memo')"
                        label-for="fld-memo"
                        :is-help="true"
                        help-key="constructor.memo"
                        @helpClick="onHelpClick">
      <Textarea id="fld-memo"
                size="small"
                autocomplete="off"
                class="w-full"
                rows="5"
                v-model="settings.memo"
                @change="onChange"></Textarea>
    </FieldGridComponent>

  </div>
</div>

  <OverlayPanel ref="helpPanel">
    <div class="flex flex-column gap-3 w-20rem">
      <p class="m-0">
        {{helpText}}
      </p>
    </div>

  </OverlayPanel>

</template>

<style scoped>
.field.grid {
  margin-bottom: 0.5rem;
}

.bs-label{
  margin-bottom: 0;
}
</style>

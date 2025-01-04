<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onMounted, inject,
} from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import OverlayPanel from 'primevue/overlaypanel';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';
import NameHelper from '../../../../shared/src/helpers/nameHelper';

// @component
const name = 'MainTab';

const editMethods = ref([
  { value: 0, text: 'Page' },
  { value: 1, text: 'Dialog' },
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
    <div class="field grid">
      <label for="fld-name" class="col-4 bs-label bs-required">{{$t('name')}}</label>
      <div class="col-8">
        <InputText id="fld-name"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="settings.name"
                   @change="onChange"></InputText>
      </div>
    </div>

    <!--Memo-->
    <div class="field grid">
      <label for="fld-memo" class="col-4 bs-label">{{$t('memo')}}</label>
      <div class="col-8">
        <Textarea id="fld-memo"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   rows="5"
                   v-model="settings.memo"
                   @change="onChange"></Textarea>
      </div>
    </div>

    <!--Order expression-->
    <div class="field grid">
      <label for="fld-order-expression" class="col-4 bs-label">{{$t('orderExpression')}}</label>
      <div class="col-8">
        <InputText id="fld-order-expression"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="settings.orderByExpression"
                   @change="onChange"></InputText>
      </div>
    </div>

    <!--Display expression-->
    <div class="field grid">
      <label for="fld-display-expression"
             class="col-4 bs-label">{{$t('displayExpression')}}</label>
      <div class="col-8">
        <InputText id="fld-display-expression"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="settings.displayExpression"
                   @change="onChange"></InputText>
      </div>
    </div>

    <!--Edit method-->
    <div class="field grid">
      <label for="fld-edit-method"
             class="col-4 bs-label bs-required">{{$t('editMethod')}}</label>
      <div class="col-8">
       <Dropdown id="fld-edit-method"
                 class="w-full"
                 size="small"
                 v-model="settings.editMethod"
                 :options="editMethods"
                 option-label="text"
                 option-value="value"
                 @change="onChange"></Dropdown>
      </div>
    </div>

    <!--Is active-->
    <div class="field grid">
      <label for="fld-is-active"
             class="col-4 bs-label">{{$t('isActive')}}</label>
      <div class="col-8">
        <InputSwitch id="fld-is-active"
                     v-model="settings.isActive"
                     @change="onChange"></InputSwitch>
      </div>
    </div>

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

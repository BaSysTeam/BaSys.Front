<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onMounted,
} from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

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

// Emits
const emit = defineEmits({ change: () => true });

// Event handlers
function onChange():void {
  console.log('MainTab.OnChange');
  emit('change');
}

</script>

<template>
<div class="grid">
  <div class="col-8">

    <!--Uid-->
    <div class="field grid">
      <label for="fld-uid" class="col-4 bs-label">Uid</label>
      <div class="col-8">
        <InputText id="fld-uid"
                   size="small"
                   autocomplete="off"
                   disabled
                   class="w-full"
                   v-model="settings.uid"
                   @change="onChange"></InputText>
      </div>
    </div>

    <!--Title-->
    <div class="field grid">
      <label for="fld-title" class="col-4 bs-label bs-required">{{$t('title')}}</label>
      <div class="col-8">
        <InputText id="fld-title"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="settings.title"
                   @change="onChange"></InputText>
      </div>
    </div>

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
</template>

<style scoped>
.field.grid {
  margin-bottom: 0.5rem;
}

.bs-label{
  margin-bottom: 0;
}
</style>

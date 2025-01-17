<script setup lang="ts">
import {
  defineProps, defineEmits, PropType,
} from 'vue';
import InputText from 'primevue/inputtext';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import NameHelper from '../../../../shared/src/helpers/nameHelper';

// Props
const props = defineProps({
  settings: { type: Object as PropType<any>, required: true },
});

// Emits
const emit = defineEmits(
  {
    change: () => true,
  },
);

// Event handlers
function onChange(): void {
  emit('change');
}

function onTitleChange(): void {
  if (!props.settings.name) {
    props.settings.name = NameHelper.prepareName(props.settings.title, true, 0);
  }

  emit('change');
}

</script>

<template>
  <div class="grid">
    <div class="col-12">

      <!--Title-->
      <FieldGridComponent :title="$t('title')"
                          :required="true"
                          label-for="fld-title">
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
                          label-for="fld-name">
        <InputText id="fld-name"
                   size="small"
                   autocomplete="off"
                   class="w-full"
                   v-model="settings.name"
                   @change="onChange"></InputText>
      </FieldGridComponent>

      <!--Custom fields-->
      <slot></slot>

      <!--Memo-->
      <FieldGridComponent :title="$t('memo')"
                          label-for="fld-memo">
      <Textarea id="fld-memo"
                size="small"
                autocomplete="off"
                class="w-full"
                rows="5"
                v-model="settings.memo"
                @change="onChange"></Textarea>
      </FieldGridComponent>

      <!--Is active-->
      <FieldGridComponent :title="$t('isActive')"
                          label-for="fld-is-active">
        <InputSwitch id="fld-is-active"
                     v-model="settings.isActive"
                     @change="onChange"></InputSwitch>
      </FieldGridComponent>

    </div>
  </div>
</template>

<style scoped>

</style>

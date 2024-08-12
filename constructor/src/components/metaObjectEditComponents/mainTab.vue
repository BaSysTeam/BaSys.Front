<script setup lang="ts">
import {
  defineProps, PropType, defineEmits, ref, watch, onMounted,
} from 'vue';
import InputText from 'primevue/inputtext';
import MetaObjectStorableSettings from '../../../../shared/src/models/metaObjectStorableSettings';

// @component
const name = 'MainTab';

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

    <!--Title-->
    <div class="field grid">
      <label for="fld-title" class="col-4 bs-label bs-required">Title</label>
      <div class="col-8">
        <InputText id="fld-title"
                   size="small"
                   class="w-full"
                   v-model="settings.title"
                   @change="onChange"></InputText>
      </div>
    </div>

    <!--Name-->
    <div class="field grid">
      <label for="fld-name" class="col-4 bs-label bs-required">Name</label>
      <div class="col-8">
        <InputText id="fld-name"
                   size="small"
                   class="w-full"
                   v-model="settings.name"
                   @change="onChange"></InputText>
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

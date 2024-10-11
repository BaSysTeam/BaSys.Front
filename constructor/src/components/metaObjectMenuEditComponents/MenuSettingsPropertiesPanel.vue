<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, PropType, defineEmits, watch, computed,
} from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import InputText from 'primevue/inputtext';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import MenuSettingsGroupItem from '../../../../shared/src/models/menuModel/menuSettingsGroupItem';

// Props
const props = defineProps({
  menuGroup: {
    type: Object as PropType<MenuSettingsGroupItem>,
  },
});

// Emits
const emit = defineEmits({ change: () => true });

// Event handlers
function onChange():void {
  emit('change');
}

</script>

<template>
  <Accordion :multiple="true" :active-index="[0, 1, 2]">
    <AccordionTab header="Group">
      <div class="grid" v-if="menuGroup">
        <div class="col-12">
          <!--Title-->
          <FieldGridComponent :title="$t('title')"
                              label-for="group-title"
                              :required="true">
            <InputText id="group-title"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="menuGroup.title"
                       @change="onChange"></InputText>
          </FieldGridComponent>

          <!--Icon class-->
          <FieldGridComponent :title="$t('icon')"
                              label-for="group-icon-class"
                              :required="true">
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
                              :required="true">
            <InputText id="group-link"
                       size="small"
                       autocomplete="off"
                       class="w-full"
                       v-model="menuGroup.link"
                       @change="onChange"></InputText>
          </FieldGridComponent>

        </div>
      </div>

    </AccordionTab>
  </Accordion>
</template>

<style scoped>

</style>

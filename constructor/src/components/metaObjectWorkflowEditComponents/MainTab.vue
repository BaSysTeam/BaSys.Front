<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import InputSwitch from 'primevue/inputswitch';
import FieldGridComponent from '@/components/FieldGridComponent.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<WorkflowSettings>,
    required: true,
  },
});

// Emits
const emit = defineEmits({ change: () => true });

// Methods

// Event handlers
function onChange(): void {
  emit('change');
}

// Life cycle hooks
</script>

<template>
  <div class="grid">
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
.field.grid {
  margin-bottom: 0.5rem;
}
</style>

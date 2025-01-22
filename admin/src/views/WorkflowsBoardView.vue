<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

// Infrastructure
// const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({});

// Data
const isWaiting = ref(false);

// Methods

// Event handlers
function onUpdateClick(): void {
  console.log('Update');
}

// Life cycle hooks
</script>

<template>
  <div>

    <!-- Form title-->
    <div class="grid">
      <div class="col-12">
        <ViewTitleComponent :title="$t('workflowsBoard')"
                            :is-modified="false"
                            :is-waiting="isWaiting"/>
      </div>
    </div>

    <!-- Command panel -->
    <div class="grid">
      <div class="col-12">
        <Button
          :label="$t('update')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-refresh"
          @click="onUpdateClick"
        />
      </div>
    </div>

    <!--Divider-->
    <div class="grid">
      <div class="col-12">
        <Divider class="m-2" />
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>

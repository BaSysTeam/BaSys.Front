<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Sidebar from 'primevue/sidebar';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Data
const isVisible = ref(false);

// Methods

// Watch
watch(() => props.visible, (visible) => {
  isVisible.value = visible;
});

// Emit
const emit = defineEmits({ hide: () => true });

// Event handlers
function onHide(): void {
  isVisible.value = false;
  emit('hide');
}

// Life cycle hooks
onBeforeMount(() => {
  isVisible.value = props.visible;
});

</script>

<template>
  <Sidebar v-model:visible="isVisible"
           class="w-full md:w-20rem lg:w-30rem"
           header="Settings"
           position="right"
           @hide="onHide">
    <div>Settings</div>
  </Sidebar>
</template>

<style scoped>

</style>

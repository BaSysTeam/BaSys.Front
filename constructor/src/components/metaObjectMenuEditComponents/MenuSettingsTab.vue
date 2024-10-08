<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, PropType, defineEmits, watch, computed,
} from 'vue';
import MenuSettings from '../../../../shared/src/models/menuModel/menuSettings';

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<MenuSettings>,
    required: true,
  },
});

// Emits
const emit = defineEmits({ change: () => true });
</script>

<template>
<div>Menu settings</div>
</template>

<style scoped>

</style>

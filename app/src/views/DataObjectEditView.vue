<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';

@Component
class MyComponent extends Vue {}
export default toNative(MyComponent);
</script>

<template>
<div>
  <h3>DataObject Edit</h3>
</div>
</template>

<style scoped>

</style>

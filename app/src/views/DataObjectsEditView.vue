<script lang="ts">
import {
  Prop, Component, Vue, toNative,
} from 'vue-facing-decorator';

@Component
class DataObjectEditView extends Vue {
  @Prop({ required: true, type: String })
  kind!: string;

  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ required: true, type: String })
  uid!: string;
}
export default toNative(DataObjectEditView);
</script>

<template>
<div>
  <h3>DataObject Edit</h3>
</div>
</template>

<style scoped>

</style>

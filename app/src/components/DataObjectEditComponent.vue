<script lang="ts">
import {
  Vue, Component, toNative, Prop,
} from 'vue-facing-decorator';

@Component({})
class DataObjectEditComponent extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  kind!: string;

  @Prop({
    required: true,
    type: String,
  })
  name!: string;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  uid!: string;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  copyUid!: string;
}
export default toNative(DataObjectEditComponent);
</script>

<template>
<div>DataObject Edit</div>
</template>

<style scoped>

</style>

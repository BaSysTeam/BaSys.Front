<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { useToast } from 'primevue/usetoast';

@Options({})
export default class DataObjectDetailTableEdit extends Vue {
  // Identifier of detail table.
  @Prop({
    required: false,
    type: String,
    default: '',
  })
  tableUid!: string;
}
</script>

<template>
<div>
  <h3>Detail table</h3>
  <h3>{{tableUid}}</h3>
</div>
</template>

<style scoped>

</style>

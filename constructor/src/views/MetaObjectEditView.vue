<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Options({
  components: {
    ViewTitleComponent,
  },
  props: {
    kind: { type: String },
    name: { type: String },
  },
})
export default class MetaObjectEditView extends Vue {
  isModified = false;
  isWaiting = false;
  name!: string;
  kind!: string;
}
</script>

<template>
  <div>
    <!--View title-->
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="MetaObject"
                            :is-modified="isModified"
                            :is-waiting="isWaiting"/>
      </div>
    </div>
  </div>
  <div class="grid">
    <div class="col">
      <div>{{ kind }}/{{ name }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>

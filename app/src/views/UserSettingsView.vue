<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="App:UserSettings" :is-modified="false" :is-waiting="false" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Options({
  components: {
    ViewTitleComponent,
  },
})
export default class UserSettingsView extends Vue {

}
</script>

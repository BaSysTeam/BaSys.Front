<template>
  <div class="about">
    <h1>Template of VUE 3 app for BaSys project</h1>
  </div>
  <div>
    <Button label="Test" icon="pi pi-check" class="h-2rem" outlined
    v-on:click="onBtnClicked"></Button>
  </div>
</template>

<script lang="ts">
import Button from 'primevue/button';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    Button,
  },
})
export default class AboutView extends Vue {
  onBtnClicked() {
    alert('Button clicked');
  }
}
</script>

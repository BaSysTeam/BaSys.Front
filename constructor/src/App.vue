<template>
  <Toast />
  <AppHeaderComponent
    title="BaSys: Constructor"
    @burgerClicked="onBurgerClicked"
  />
  <div class="grid h-screen" style="margin:0">
    <div class="bs-nav-panel col-fixed" style="padding:0"
      :style="{ 'width': navPanelWidth + 'px' }">
      <MetadataTreeComponent v-show="!isMenuMinimized"/>
      <div v-if="isMenuMinimized">
        <h4 class="bs-metadatatree-text">Metadata Tree</h4>
      </div>
    </div>
    <div class="col">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Toast from 'primevue/toast';
import MetadataTreeComponent from '@/components/MetadataTreeComponent.vue';
import AppHeaderComponent from '../../shared/src/components/AppHeaderComponent.vue';

@Options({
  components: {
    AppHeaderComponent,
    MetadataTreeComponent,
    Toast,
  },
})
export default class App extends Vue {
  isMenuMinimized = false;
  navPanelWidth = 200;

  onBurgerClicked(): void {
    this.isMenuMinimized = !this.isMenuMinimized;
    if (this.isMenuMinimized) {
      this.navPanelWidth = 50;
    } else {
      this.navPanelWidth = 200;
    }
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.bs-nav-panel {
  border-right: 1px solid var(--surface-200);
}

.bs-metadatatree-text {
  transform: rotate(-90deg);
  width: auto;
  position: fixed;
  left: -30px;
  top: 100px;
  margin: 0;
}
</style>

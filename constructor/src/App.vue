<template>
  <Toast />
  <AppHeaderComponent
    title="BaSYS: Constructor"
    @burgerClicked="onBurgerClicked"
  >
    <template #userActions>
      <UserActionsComponent @profileClicked="onProfileClicked"/>
    </template>
  </AppHeaderComponent>
  <div class="grid h-screen" style="margin:0">
    <div class="bs-nav-panel col-fixed" style="padding:0"
      :style="{ 'width': navPanelWidth + 'px' }">
      <NavigationPanelComponent :is-minimized="isMenuMinimized"></NavigationPanelComponent>
      <div v-if="isMenuMinimized">
        <h4 class="bs-metadatatree-text">Metadata</h4>
      </div>
    </div>
    <div class="col">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRouter } from 'vue-router';
import { usePrimeVue } from 'primevue/config';
import Toast from 'primevue/toast';
import EventEmitter from '@/utils/eventEmitter';
import NavigationPanelComponent from '@/components/NavigationPanelComponent.vue';
import AppHeaderComponent from '../../shared/src/components/AppHeaderComponent.vue';
import UserActionsComponent from '../../shared/src/components/UserActionsComponent.vue';
import LocaleSwitcher from '../../shared/src/i18n/localeSwitcher';

@Options({
  components: {
    AppHeaderComponent,
    UserActionsComponent,
    NavigationPanelComponent,
    Toast,
  },
})
export default class App extends Vue {
  isMenuMinimized = false;
  navPanelWidth = 200;
  router = useRouter();
  primeVue = usePrimeVue();

  mounted(): void {
    LocaleSwitcher.setLocale(this.primeVue);
  }

  onBurgerClicked(): void {
    this.isMenuMinimized = !this.isMenuMinimized;
    if (this.isMenuMinimized) {
      this.navPanelWidth = 50;
    } else {
      this.navPanelWidth = 200;
    }
    EventEmitter.emit('burger-clicked', this.isMenuMinimized);
  }

  onProfileClicked(): void {
    window.location.href = '/app#/usersettings';
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
  left: -10px;
  top: 100px;
  margin: 0;
}

.p-accordion-content{
  padding-bottom:0;
}

.bs-required:after {
  content: "*";
  color: red;
  font-size: 12pt;
}
</style>

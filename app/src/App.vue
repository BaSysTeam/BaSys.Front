<template>
  <Toast/>
  <AppHeaderComponent
    title="BaSYS: Application"
    @burgerClicked="onBurgerClicked"
  >
    <template #userActions>
      <UserActionsComponent @profileClicked="router.push('/usersettings')"/>
    </template>
  </AppHeaderComponent>
  <div class="grid h-screen" style="margin:0">
    <div class="bs-nav-panel col-fixed" style="padding:0"
         :style="{ 'width': navPanelWidth + 'px' }">
      <NavigationPanelComponent :is-minimized="isMenuMinimized"></NavigationPanelComponent>
      <div v-if="isMenuMinimized">
        <h4 class="bs-nav-panel-minimized-text">Menu</h4>
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
import Menu from 'primevue/menu';
import NavigationPanelComponent from '@/components/NavigationPanelComponent.vue';
import AppHeaderComponent from '../../shared/src/components/AppHeaderComponent.vue';
import UserActionsComponent from '../../shared/src/components/UserActionsComponent.vue';
import LocaleSwitcher from '../../shared/src/i18n/localeSwitcher';

@Options({
  components: {
    AppHeaderComponent,
    UserActionsComponent,
    Toast,
    Menu,
    NavigationPanelComponent,
  },
})
export default class App extends Vue {
  isMenuMinimized = false;
  navPanelWidth = 200;
  primeVue = usePrimeVue();
  router = useRouter();

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
  min-width: 1280px;
}

body, html {
  min-width: 1280px;
}

.bs-nav-panel {
  border-right: 1px solid var(--surface-200);
}

.bs-nav-panel-minimized-text {
  transform: rotate(-90deg);
  width: auto;
  position: fixed;
  left: -10px;
  top: 100px;
  margin: 0;
}

.bs-required:after {
  content: "*";
  color: red;
  font-size: 12pt;
}
.p-inputnumber-input{
  text-align: right !important;
}

</style>

<template>
  <Toast/>
  <AppHeaderComponent
    title="BaSys: Application"
    @burgerClicked="onBurgerClicked"
  >
    <template #userActions>
      <UserActionsComponent @profileClicked="router.push('/usersettings')"/>
    </template>
  </AppHeaderComponent>
  <div class="grid h-screen" style="margin:0; padding: 10px">
    <div class="col-12">
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
import AppHeaderComponent from '../../shared/src/components/AppHeaderComponent.vue';
import UserActionsComponent from '../../shared/src/components/UserActionsComponent.vue';
import LocaleSwitcher from '../../shared/src/i18n/localeSwitcher';

@Options({
  components: {
    AppHeaderComponent,
    UserActionsComponent,
    Toast,
    Menu,
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

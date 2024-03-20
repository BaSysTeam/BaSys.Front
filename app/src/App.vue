<template>
  <Toast/>
  <AppHeaderComponent
    title="BaSys: Application"
    :locale="currentLocale"
    @burgerClicked="onBurgerClicked"
    @localeChanged="onLocaleChanged"
  />
  <div class="grid h-screen" style="margin:0; padding: 10px">
    <div class="col-12">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Menu from 'primevue/menu';
import AppHeaderComponent from '../../shared/src/components/AppHeaderComponent.vue';
import ToastHelper from '../../shared/src/helpers/toastHelper';
import pvLocaleRu from '../../shared/src/i18n/primevueLocales/ru.json';
import pvLocaleEn from '../../shared/src/i18n/primevueLocales/en.json';

@Options({
  components: {
    AppHeaderComponent,
    Toast,
    Menu,
  },
})
export default class App extends Vue {
  isMenuMinimized = false;
  navPanelWidth = 200;
  currentLocale = 'En';
  primeVue = usePrimeVue();
  toastHelper = new ToastHelper(useToast());

  menuItems: any = ref([
    { label: 'Home', icon: 'pi pi-home', route: '/' },
    { separator: true },
    { label: 'Users', icon: 'pi pi-user', route: '/users' },
    { separator: true },
  ]);

  onBurgerClicked(): void {
    this.isMenuMinimized = !this.isMenuMinimized;

    if (this.isMenuMinimized) {
      this.navPanelWidth = 50;
    } else {
      this.navPanelWidth = 200;
    }
  }

  onLocaleChanged(selectedLocale: string): void {
    if (selectedLocale === 'En') {
      this.primeVue.config.locale = pvLocaleEn;
    } else {
      this.primeVue.config.locale = pvLocaleRu;
    }

    this.currentLocale = selectedLocale;
    this.toastHelper.info(`The locale has changed to ${this.currentLocale}`);
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
</style>

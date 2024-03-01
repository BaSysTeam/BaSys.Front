<template>
  <AppHeaderComponent
    title="BaSys: DB manage"
    @burgerClicked="onBurgerClicked">
  </AppHeaderComponent>
  <div class="grid h-screen" style="margin:0">
    <div class="bs-nav-panel col-fixed" style="padding:0" :style="{'width': navPanelWidth + 'px'}">
      <nav>
        <Menu :model="menuItems" style="min-width: 0; border: 0;">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                <div v-if="isMenuMinimized">
                  <span :class="item.icon" v-tooltip.right="item.label" />
                </div>
                <div v-else>
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </div>
              </a>
            </router-link>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
              <div v-if="isMenuMinimized">
                <span :class="item.icon" v-tooltip.right="item.label" />
              </div>
              <div v-else>
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </div>
            </a>
          </template>
        </Menu>
      </nav>
    </div>
    <div class="col">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue';
import Menu from 'primevue/menu';
import AppHeaderComponent from './components/AppHeaderComponent.vue';

@Options({
  components: {
    AppHeaderComponent,
    Menu,
  },
})
export default class App extends Vue {
  isMenuMinimized = false;
  navPanelWidth = 200;

  menuItems: any = ref([
    { label: 'Home', icon: 'pi pi-home', route: '/' },
    { separator: true },
    { label: 'Apps', icon: 'pi pi-desktop', route: '/apps' },
    { label: 'Databases', icon: 'pi pi-database', route: '/databases' },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out' },
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

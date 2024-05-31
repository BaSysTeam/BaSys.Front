<template>
  <Toast/>
  <AppHeaderComponent
    title="BaSys: Admin"
    @burgerClicked="onBurgerClicked"
  >
    <template #userActions>
      <UserActionsComponent @profileClicked="onProfileClicked"/>
    </template>
  </AppHeaderComponent>
  <div class="grid h-screen" style="margin:0">
    <div class="bs-nav-panel col-fixed" style="padding:0" :style="{'width': navPanelWidth + 'px'}">
      <nav>
        <TieredMenu
          :model="menuItems"
          style="min-width: 0; border: 0;"
          class="bs-tieredmenu-submenu-list">
          <template #item="{ item, props, hasSubmenu }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :href="href" v-bind="props.action" @click="navigate" class="p-2 pr-0">
                <div v-if="isMenuMinimized" class="flex align-items-center" style="height: 20px;">
                  <span :class="item.icon" v-tooltip.right="item.label" />
                  <span v-if="item.key === 'settings-submenu'" class="ml-2">{{ item.label }}</span>
                </div>
                <div v-else class="flex align-items-center" style="height: 20px;">
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </div>
              </a>
            </router-link>
            <a v-else
              v-ripple
              :href="item.url"
              :target="item.target"
              v-bind="props.action"
              class="p-2 pr-0"
            >
              <div v-if="isMenuMinimized" class="flex align-items-center" style="height: 20px;">
                <span :class="item.icon" v-tooltip.right="item.label" />
                <span v-if="item.key === 'settings-submenu'" class="ml-2">{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-angle-right" />
              </div>
              <div v-else class="flex align-items-center" style="height: 20px;">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-angle-right ml-7 vertical-align-text-bottom" />
              </div>
            </a>
          </template>
        </TieredMenu>
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
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { usePrimeVue } from 'primevue/config';
import Toast from 'primevue/toast';
import TieredMenu from 'primevue/tieredmenu';
import AccountProvider from '@/dataProviders/accountProvider';
import UserActionsComponent from '../../shared/src/components/UserActionsComponent.vue';
import AppHeaderComponent from '../../shared/src/components/AppHeaderComponent.vue';
import ToastHelper from '../../shared/src/helpers/toastHelper';
import LocaleSwitcher from '../../shared/src/i18n/localeSwitcher';

@Options({
  components: {
    AppHeaderComponent,
    UserActionsComponent,
    Toast,
    TieredMenu,
  },
})
export default class App extends Vue {
  isMenuMinimized = false;
  navPanelWidth = 200;
  toastHelper = new ToastHelper(useToast());
  router = useRouter();
  primeVue = usePrimeVue();

  menuItems: any = ref([
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '/',
    },
    { separator: true },
    {
      label: 'Users',
      icon: 'pi pi-user',
      route: '/users',
    },
    {
      label: 'User groups',
      icon: 'pi pi-users',
      route: '/userGroups',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Main',
          route: '/settings/main',
          key: 'settings-submenu',
        },
        {
          label: 'Logging',
          route: '/settings/logging',
          key: 'settings-submenu',
        },
        {
          label: 'File storage',
          route: '/settings/fileStorage',
          key: 'settings-submenu',
        },
      ],
    },
    {
      label: 'Migrations',
      icon: 'pi pi-database',
      route: '/migrations',
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logOut(),
    },
  ]);

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

  async logOut(): Promise<void> {
    console.log('Log out clicked');
    const accountProvider = new AccountProvider();
    const response = await accountProvider.logout();
    if (response.isOK) {
      window.location.href = window.location.origin;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
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

.bs-tieredmenu-submenu-list {
  .p-submenu-list {
    z-index: 2;
    min-width: 200px;
  }
}
</style>

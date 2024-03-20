<template>
  <div class="grid">
    <div class="col-12"></div>
    <h2>Wellcome</h2>
  </div>
  <Divider></Divider>
  <div class="grid">
    <div class="col-12">
      <Button label="Logout"
      size="small"
      severity="primary"
      outlined icon="pi pi-sign-out"
      @click="onLogoutClick"></Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import AccountProvider from '@/dataProviders/accountProvider';

@Options({
  components: {
    Button,
    Divider,
  },
})
export default class HomeView extends Vue {
  async onLogoutClick():Promise<void> {
    console.log('Logout');
    const accountProvider = new AccountProvider();
    const response = await accountProvider.logout();
    if (response.isOK) {
      window.location.href = window.location.origin;
    } else {
      console.error(response.message);
    }
  }
}
</script>

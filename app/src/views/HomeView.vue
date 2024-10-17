<template>
  <div class="grid">
    <div class="col-12">
      <h3>Welcome, {{ userName }}!</h3>
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
  userName = 'Unknown';

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

  async mounted():Promise<void> {
    const accountProvider = new AccountProvider();
    const response = await accountProvider.currentUser();
    if (response.isOK) {
      this.userName = response.data.userName;
    } else {
      console.error(response.presentation);
    }
  }
}
</script>

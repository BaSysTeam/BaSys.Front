<template>
  <SplitButton
    class="h-full bs-useractions-btn"
    :label="userName"
    :model="userActions"
    text
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SplitButton from 'primevue/splitbutton';
import AccountProvider from '../dataProviders/accountProvider';

@Options({
  components: {
    SplitButton,
  },
  emits: {
    profileClicked: null,
  },
})
export default class UserActionsComponent extends Vue {
  userName = 'Unknown';

  userActions = [
    {
      label: 'Profile',
      command: () => this.$emit('profileClicked'),
    },
    { separator: true },
    {
      label: 'Logout',
      command: () => this.logOut(),
    },
  ]

  async mounted():Promise<void> {
    const accountProvider = new AccountProvider();
    const response = await accountProvider.currentUserName();
    if (response.isOK) {
      this.userName = response.data;
    } else {
      console.error(response.presentation);
    }
  }

  async logOut(): Promise<void> {
    const accountProvider = new AccountProvider();
    const response = await accountProvider.logout();
    if (response.isOK) {
      window.location.href = window.location.origin;
    } else {
      console.error(response.presentation);
    }
  }
}
</script>

<style>
.bs-useractions-btn {
  .p-splitbutton-defaultbutton {
    color: white;
  }
  .p-splitbutton-menubutton {
    color: white;
  }
}
</style>

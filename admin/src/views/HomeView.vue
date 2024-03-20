<template>
  <div class="home">
   <h3>Wellcome, {{ userName }}!</h3>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AccountProvider from '@/dataProviders/accountProvider';

@Options({

})
export default class HomeView extends Vue {
  userName = 'Unknown';

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

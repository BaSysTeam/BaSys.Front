<template>
  <div>
    <Dialog
      modal
      class="pb-0"
      :visible="true"
      :draggable="false"
      :header="header"
      :style="{width: '25rem'}"
      @update:visible="updateVisible"
    >
      <div>
        <div class="grid">
          <div class="col">
            <span id="passwordLength">Password length</span>
            <InputNumber
              v-model="passwordLength"
              aria-labelledby="passwordLength"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span>New password</span>
            <InputGroup>
              <InputText v-model="password" />
              <Button label="Generate" @click="generatePassword" />
            </InputGroup>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Close"
          size="small"
          severity="secondary"
          @click="closeClick"
          outlined
        />
        <Button label="Change" size="small" @click="changeClick" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import UserProvider from '../dataProviders/userProvider';
import User from '../models/user';
import PasswordGenerator from '../utils/passwordGenerator';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  props: {
    user: {
      type: User,
      required: true,
    },
  },
  components: {
    Dialog,
    Button,
    InputNumber,
    InputGroup,
    InputText,
  },
  emits: {
    close: null,
  },
})
export default class ChangePasswordComponent extends Vue {
  header = 'Change Password: ';
  passwordLength = 6;
  password = '';
  user!:User;
  dataProvider = new UserProvider();
  toastHelper = new ToastHelper(useToast());

  mounted(): void {
    this.header += this.user.userName;
  }

  generatePassword(): void {
    this.password = PasswordGenerator.generate(this.passwordLength);
  }

  closeClick(): void {
    this.$emit('close');
  }

  async changeClick(): Promise<void> {
    const response = await this.dataProvider.changePassword(this.user.id, this.password);
    if (response.isOK) {
      this.toastHelper.success(response.message);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }
}
</script>

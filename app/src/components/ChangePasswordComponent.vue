<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '45rem'}"
      :draggable="false"
      :header="headerText"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <div>
          <!--            Old password -->
          <div class="grid">
            <div class="col-4 flex align-items-center">
              <span class="bs-required">Old password</span>
            </div>
            <div class="col-7">
              <InputText
                v-model="changePasswordModel.oldPassword"
                type="text"
                size="small"
                class="w-full"
                @keyup.enter="onInputChange"
                @focusout="onInputChange"
                :invalid="isOldPasswordInvalid"
              />
            </div>
          </div>
          <!--            New password -->
          <div class="grid">
            <div class="col-4 flex align-items-center">
              <span class="bs-required">New password</span>
            </div>
            <div class="col-7">
              <InputText
                v-model="changePasswordModel.newPassword"
                type="text"
                size="small"
                class="w-full"
                @keyup.enter="onInputChange"
                @focusout="onInputChange"
                :invalid="isNewPasswordInvalid"
              />
            </div>
          </div>
          <!--            New password confirm -->
          <div class="grid">
            <div class="col-4 flex align-items-center">
              <span class="bs-required">New password confirm</span>
            </div>
            <div class="col-7">
              <InputText
                v-model="newPasswordConfirm"
                type="text"
                size="small"
                class="w-full"
                @keyup.enter="onInputChange"
                @focusout="onInputChange"
                :invalid="isNewPasswordConfirmInvalid"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          size="small"
          outlined
          @click="cancelClick"
        />
        <Button
          label="Save"
          :disabled="isSaveDisabled"
          size="small"
          @click="saveClick"
        />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import { Options, Vue } from 'vue-class-component';
import ChangePasswordDto from '@/models/changePassword';

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
    Checkbox,
  },
  emits: {
    cancel: null,
    save: null,
  },
})
export default class ChangePasswordComponent extends Vue {
  headerText = 'Change password';
  changePasswordModel = new ChangePasswordDto();
  newPasswordConfirm = '';
  isSaveDisabled = true;
  isOldPasswordInvalid = false;
  isNewPasswordInvalid = false;
  isNewPasswordConfirmInvalid = false;

  cancelClick(): void {
    this.$emit('cancel');
  }

  saveClick(): void {
    this.$emit('save', this.changePasswordModel);
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  onInputChange(): void {
    if (!this.changePasswordModel.oldPassword) {
      this.isOldPasswordInvalid = true;
    } else {
      this.isOldPasswordInvalid = false;
    }

    if (!this.changePasswordModel.newPassword) {
      this.isNewPasswordInvalid = true;
    } else {
      this.isNewPasswordInvalid = false;
    }

    if (!this.newPasswordConfirm) {
      this.isNewPasswordConfirmInvalid = true;
    } else {
      this.isNewPasswordConfirmInvalid = false;
    }

    if (this.newPasswordConfirm !== this.changePasswordModel.newPassword) {
      this.isNewPasswordConfirmInvalid = true;
    } else {
      this.isNewPasswordConfirmInvalid = false;
    }

    if (this.isOldPasswordInvalid
      || this.isNewPasswordInvalid
      || this.isNewPasswordConfirmInvalid) {
      return;
    }

    this.isOldPasswordInvalid = false;
    this.isNewPasswordInvalid = false;
    this.isNewPasswordConfirmInvalid = false;
    this.isSaveDisabled = false;
  }
}
</script>

<style scoped>
  .bs-required:after {
    content: "*";
    color: red;
    font-size: 12pt;
  }
</style>

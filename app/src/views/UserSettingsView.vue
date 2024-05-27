<template>
  <div>
    <!--    Header-->
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="App:UserSettings" :is-modified="false" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>

    <!--Card-->
    <div class="grid">
      <div class="col-4">
        <Card>
          <template #content>
            <!--            UserName-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">User name</span>
              </div>
              <div class="col">
                <InputText
                  v-model="userSettings.userName"
                  @keyup.enter="save"
                  @focusout="save"
                  type="text"
                  size="small"
                  class="w-full"
                  id="userNameInput"
                />
              </div>
            </div>
            <!--            Language-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Language</span>
              </div>
              <div class="col">
                <Dropdown
                  v-model="userSettings.language"
                  :options="languages"
                  @change="save"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select language"
                  class="w-full md:w-14rem"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <div class="grid">
      <div class="col-2">
        <Button
          :label="$t('changePassword')"
          size="small"
          outlined
          @click="onChangePasswordClick()"
        />
      </div>
    </div>

    <ChangePasswordComponent
      v-if="isChangePasswordDialogVisible"
      @cancel="isChangePasswordDialogVisible = false"
      @save="changePassword"
    />

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { usePrimeVue } from 'primevue/config';
import Dropdown from 'primevue/dropdown';
import ChangePasswordComponent from '@/components/ChangePasswordComponent.vue';
import UserSettingsProvider from '../../../shared/src/dataProviders/userSettingsProvider';
import Language from '../../../shared/src/models/language';
import UserSettings from '../../../shared/src/models/userSettings';
import ChangePassword from '../../../shared/src/models/changePassword';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import LocaleSwitcher from '../../../shared/src/i18n/localeSwitcher';

@Options({
  components: {
    ChangePasswordComponent,
    ViewTitleComponent,
    Divider,
    Card,
    InputText,
    InputGroup,
    InputGroupAddon,
    Button,
    Dropdown,
  },
})
export default class UserSettingsView extends Vue {
  userSettingsProvider = new UserSettingsProvider();
  userSettings = new UserSettings(null);
  userSettingsCached = new UserSettings(null);
  toastHelper = new ToastHelper(useToast());
  isWaiting = false;
  languages: Language[] = [];
  isChangePasswordDialogVisible = false;
  primeVue = usePrimeVue();

  async mounted(): Promise<void> {
    await this.getLanguages();
    await this.update();
  }

  async getLanguages(): Promise<void> {
    this.isWaiting = true;

    const response = await this.userSettingsProvider.getLanguages();
    if (response.isOK) {
      this.languages = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async update(): Promise<void> {
    this.isWaiting = true;

    const response = await this.userSettingsProvider.getUserSettings();
    if (response.isOK) {
      this.userSettings = response.data;
      this.userSettingsCached = { ...response.data };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async save(): Promise<void> {
    if (JSON.stringify(this.userSettings) === JSON.stringify(this.userSettingsCached)) {
      console.log('dont save');
      return;
    }

    const response = await this.userSettingsProvider.updateUserSettings(this.userSettings);
    if (response.isOK) {
      this.toastHelper.success(response.message);

      if (this.userSettings.language !== this.userSettingsCached.language) {
        LocaleSwitcher.setLocale(this.primeVue, this.userSettings.language);
      }

      this.userSettingsCached = { ...this.userSettings };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  onChangePasswordClick(): void {
    this.isChangePasswordDialogVisible = true;
  }

  async changePassword(dto: ChangePassword): Promise<void> {
    this.isWaiting = true;

    const response = await this.userSettingsProvider.changePassword(dto);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.isChangePasswordDialogVisible = false;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }
}
</script>

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
import { watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import UserSettingsProvider from '@/dataProviders/userSettingsProvider';
import Language from '@/models/language';
import UserSettings from '@/models/userSettings';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
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
  userSettings = new UserSettings();
  userSettingsCached = new UserSettings();
  toastHelper = new ToastHelper(useToast());
  isWaiting = false;
  languages: Language[] = [];

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
      console.log('save');
      this.toastHelper.success('');
      this.userSettingsCached = { ...this.userSettings };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
}
</script>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Settings: Main" :is-modified="false" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2" />
    </div>
    <div class="grid">
      <div class="col-6">
        <Card>
          <template #content>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Application title</span>
              </div>
              <div class="col">
                <InputText
                  v-model="appConstants.applicationTitle"
                  @keyup.enter="save"
                  @focusout="save"
                  type="text"
                  size="small"
                  class="w-full"
                  id="appTitleInput"
                />
              </div>
            </div>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Database uid</span>
              </div>
              <div class="col">
                <InputGroup>
                  <InputMask
                    id="basic"
                    v-model="appConstants.dataBaseUid"
                    @keyup.enter="save"
                    @focusout="save"
                    mask="********-****-****-****-************"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    class="text-sm"
                  />
                  <Button label="Generate ?" size="small" @click="onGenerateUid" />
                </InputGroup>
              </div>
            </div>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span>App version</span>
              </div>
              <div class="col">
                <b>{{ appConstants.appVersion }}</b>
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
import { Guid } from 'guid-typescript';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import AppConstants from '@/models/appConstants';
import AppConstantsProvider from '../dataProviders/appConstantsProvider';
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
    InputMask,
  },
})
export default class MainSettingView extends Vue {
  isWaiting = false;
  appConstants = new AppConstants();
  appConstantsCached = new AppConstants();
  toastHelper = new ToastHelper(useToast());
  dataProvider = new AppConstantsProvider();

  async mounted(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataProvider.getAppConstants();
    if (response.isOK) {
      this.appConstants = response.data;
      this.appConstantsCached = { ...response.data };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async onGenerateUid(): Promise<void> {
    this.appConstants.dataBaseUid = Guid.create().toString();
    await this.save();
  }

  async save(): Promise<void> {
    const appTitleInput = document.getElementById('appTitleInput');

    if (JSON.stringify(this.appConstants) === JSON.stringify(this.appConstantsCached)) {
      appTitleInput?.blur();
      return;
    }

    this.isWaiting = true;

    const response = await this.dataProvider.updateAppConstants(this.appConstants);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.appConstantsCached = { ...this.appConstants };
    } else {
      this.appConstants = { ...this.appConstantsCached };
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    appTitleInput?.blur();

    this.isWaiting = false;
  }
}
</script>

<style>
.bs-required:after {
    content: "*";
    color: red;
    font-size: 12pt;
}
</style>

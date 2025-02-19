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
            <!--Application title-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span>Application title</span>
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

            <!--DataBase UID -->
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
                  <Button
                    label="Generate"
                    size="small"
                    @click="isGenerateUidDialogVisible = true"
                  />
                </InputGroup>
              </div>
            </div>

            <!--Use workflows scheduler-->
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Use workflows scheduler</span>
              </div>
              <div class="col">
                <InputSwitch v-model="appConstants.useWorkflowsScheduler"
                             @change="save"></InputSwitch>
              </div>
            </div>

            <!--App version-->
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

    <GenerateUidDialogComponent
      v-if="isGenerateUidDialogVisible"
      @reject="isGenerateUidDialogVisible = false"
      @accept="generateUid"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Guid } from 'guid-typescript';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import Checkbox from 'primevue/checkbox';
import AppConstants from '@/models/appConstants';
import GenerateUidDialogComponent from '@/components/GenerateUidDialogComponent.vue';
import AppConstantsProvider from '../dataProviders/appConstantsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    GenerateUidDialogComponent,
    Divider,
    Card,
    InputText,
    InputSwitch,
    InputGroup,
    InputGroupAddon,
    Button,
    InputMask,
    Checkbox,
  },
})
export default class MainSettingView extends Vue {
  isGenerateUidDialogVisible = false;
  isWaiting = false;
  appConstants = new AppConstants(null);
  appConstantsCached = new AppConstants(null);
  toastHelper = new ToastHelper(useToast());
  confirm = useConfirm();
  dataProvider = new AppConstantsProvider();
  checked = false;

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

  async generateUid(): Promise<void> {
    this.isGenerateUidDialogVisible = false;
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

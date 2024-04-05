<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Settings: Main" :is-modified="false" :is-waiting="false"/>
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
                  v-model="appConstantsRecord.applicationTitle"
                  @keyup.enter="save"
                  @focusout="save"
                  type="text"
                  size="small"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Database uid</span>
              </div>
              <div class="col">
                <InputGroup>
                  <InputText
                    v-model="appConstantsRecord.dataBaseUid"
                    @keyup.enter="save"
                    @focusout="save"
                    type="text"
                    size="small"
                  />
                  <Button label="Generate" size="small" @click="onGenerateUid" />
                </InputGroup>
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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Guid } from 'guid-typescript';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button';
import AppConstantsRecord from '@/models/appConstantsRecord';
import AppConstantsRecordProvider from '../dataProviders/appConstantsRecordProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import ResultWrapper from '../../../shared/src/models/resultWrapper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    Card,
    InputText,
    InputGroup,
    InputGroupAddon,
    Button,
  },
})
export default class MainSettingView extends Vue {
  appConstantsRecord = new AppConstantsRecord();
  appConstantsRecordCached = new AppConstantsRecord();
  toastHelper = new ToastHelper(useToast());
  dataProvider = new AppConstantsRecordProvider();

  async mounted(): Promise<void> {
    const response = await this.dataProvider.getAppConstantsRecord();
    if (response.isOK) {
      this.appConstantsRecord = response.data;
      this.appConstantsRecordCached = { ...response.data };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async onGenerateUid(): Promise<void> {
    this.appConstantsRecord.dataBaseUid = Guid.create().toString();
    await this.save();
  }

  async save(): Promise<void> {
    console.log('save');

    if (JSON.stringify(this.appConstantsRecord) === JSON.stringify(this.appConstantsRecordCached)) {
      return;
    }

    let response = new ResultWrapper<number>();

    if (this.appConstantsRecord.uid) {
      response = await this.dataProvider.updateAppConstantsRecord(this.appConstantsRecord);
    } else {
      response = await this.dataProvider.createAppConstantsRecord(this.appConstantsRecord);
    }

    console.log('response', response);

    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.appConstantsRecordCached = { ...this.appConstantsRecord };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
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

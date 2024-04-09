<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent
          title="Settings: Logging"
          :is-modified="false"
          :is-waiting="isWaiting"
        />
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
                <span>Is enabled</span>
              </div>
              <div class="col">
                <InputSwitch v-model="model.isEnabled" @change="save"/>
              </div>
            </div>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Logger type</span>
              </div>
              <div class="col">
                <Dropdown
                  v-model="model.loggerType"
                  optionLabel="name"
                  optionValue="identifier"
                  class="w-full"
                  :options="loggerKinds"
                  @update:model-value="save"
                />
              </div>
            </div>
            <div class="grid" v-if="model.loggerType === mongoKind">
              <div class="col-3 flex align-items-center">
                <span>Auto cleaning interval</span>
              </div>
              <div class="col">
                <Dropdown
                  v-model="model.autoClearInterval"
                  optionLabel="name"
                  optionValue="identifier"
                  class="w-full"
                  :options="autoClearIntervalKinds"
                  @update:model-value="save"
                />
              </div>
            </div>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Minimum log level</span>
              </div>
              <div class="col">
                <Dropdown
                  v-model="model.minimumLogLevel"
                  optionLabel="name"
                  optionValue="identifier"
                  class="w-full"
                  :options="eventTypeLevelKinds"
                />
              </div>
            </div>
            <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Connection string</span>
              </div>
              <div class="col">
                <InputText
                  v-model="model.connectionString"
                  @keyup.enter="save"
                  @focusout="save"
                  type="text"
                  size="small"
                  class="w-full"
                  id="connectionStringInput"
                />
              </div>
            </div>
            <!-- <div class="grid">
              <div class="col-3 flex align-items-center">
                <span class="bs-required">Table name</span>
              </div>
              <div class="col">
                <InputText
                  v-model="model.tableName"
                  type="text"
                  size="small"
                  class="w-full"
                />
              </div>
            </div> -->
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { LoggerKinds } from '@/enums/loggerKinds';
import { EventTypeLevelKinds } from '@/enums/eventTypeLevelKinds';
import { AutoClearIntervalKinds } from '@/enums/autoClearIntervalKinds';
import { useToast } from 'primevue/usetoast';
import LoggerConfig from '@/models/loggerConfig';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import LoggerConfigProvider from '../dataProviders/loggerConfigProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    Card,
    InputText,
    Dropdown,
    InputSwitch,
  },
})
export default class LoggingSettingView extends Vue {
  isWaiting = false;
  mongoKind = LoggerKinds.MongoDb;
  model = new LoggerConfig();
  modelCached = new LoggerConfig();
  dataProvider = new LoggerConfigProvider();
  toastHelper = new ToastHelper(useToast());

  loggerKinds = ([
    { name: LoggerKinds[LoggerKinds.MsSql], identifier: LoggerKinds.MsSql },
    { name: LoggerKinds[LoggerKinds.PgSql], identifier: LoggerKinds.PgSql },
    { name: LoggerKinds[LoggerKinds.MongoDb], identifier: LoggerKinds.MongoDb },
  ]);

  eventTypeLevelKinds = ([
    {
      name: EventTypeLevelKinds[EventTypeLevelKinds.Trace],
      identifier: EventTypeLevelKinds.Trace,
    },
    {
      name: EventTypeLevelKinds[EventTypeLevelKinds.Info],
      identifier: EventTypeLevelKinds.Info,
    },
    {
      name: EventTypeLevelKinds[EventTypeLevelKinds.Debug],
      identifier: EventTypeLevelKinds.Debug,
    },
    {
      name: EventTypeLevelKinds[EventTypeLevelKinds.Warning],
      identifier: EventTypeLevelKinds.Warning,
    },
    {
      name: EventTypeLevelKinds[EventTypeLevelKinds.Error],
      identifier: EventTypeLevelKinds.Error,
    },
    {
      name: EventTypeLevelKinds[EventTypeLevelKinds.Critical],
      identifier: EventTypeLevelKinds.Critical,
    },
  ]);

  autoClearIntervalKinds = ([
    {
      name: AutoClearIntervalKinds[AutoClearIntervalKinds.None],
      identifier: AutoClearIntervalKinds.None,
    },
    {
      name: AutoClearIntervalKinds[AutoClearIntervalKinds.Week],
      identifier: AutoClearIntervalKinds.Week,
    },
    {
      name: AutoClearIntervalKinds[AutoClearIntervalKinds.Month],
      identifier: AutoClearIntervalKinds.Month,
    },
    {
      name: AutoClearIntervalKinds[AutoClearIntervalKinds.Quarter],
      identifier: AutoClearIntervalKinds.Quarter,
    },
    {
      name: AutoClearIntervalKinds[AutoClearIntervalKinds.Year],
      identifier: AutoClearIntervalKinds.Year,
    },
  ]);

  async mounted(): Promise<void> {
    this.isWaiting = true;

    const response = await this.dataProvider.getLoggerConfig();
    if (response.isOK) {
      this.model = response.data;
      this.modelCached = { ...response.data };
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    this.isWaiting = false;
  }

  async save(): Promise<void> {
    const connectionStringInput = document.getElementById('connectionStringInput');

    if (JSON.stringify(this.model) === JSON.stringify(this.modelCached)) {
      connectionStringInput?.blur();
      return;
    }

    this.isWaiting = true;

    const response = await this.dataProvider.updateLoggerConfig(this.model);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.modelCached = { ...this.model };
    } else {
      this.model = { ...this.modelCached };
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }

    connectionStringInput?.blur();

    this.isWaiting = false;
  }
}
</script>

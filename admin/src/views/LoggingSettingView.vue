<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Settings: Logging" :is-modified="false" :is-waiting="false" />
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
                <span class="bs-required">Logger type</span>
              </div>
              <div class="col">
                <Dropdown
                  v-model="model.loggerType"
                  optionLabel="name"
                  optionValue="identifier"
                  class="w-full"
                  :options="loggerKinds"
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
                  type="text"
                  size="small"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid">
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
            </div>
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
import LoggerConfig from '@/models/loggerConfig';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    Card,
    InputText,
    Dropdown,
  },
})
export default class LoggingSettingView extends Vue {
  model = new LoggerConfig();

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
}
</script>
@/enums/eventTypeLevelKinds

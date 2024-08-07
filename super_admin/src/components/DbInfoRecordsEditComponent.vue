<template>
    <div>
      <Dialog
        :visible="true"
        :style="{width: '55rem'}"
        :draggable="false"
        :header="headerText"
        class="pb-0"
        modal
        @update:visible="updateVisible"
      >
        <div>
          <div class="grid">
            <div class="col">
              <span id="dbInfoRecordAppId">AppId</span>
              <Dropdown
                v-model="dbInfoRecord.appId"
                :options="appIds"
                aria-labelledby="dbInfoRecordAppId"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="dbInfoRecordTitle">Title</span>
              <InputText
                v-model="dbInfoRecord.title"
                size="small"
                aria-labelledby="dbInfoRecordTitle"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="dbInfoRecordName">Name</span>
              <InputText
                v-model="dbInfoRecord.name"
                size="small"
                aria-labelledby="dbInfoRecordName"
                class="w-full"
                :disabled="dbInfoRecord.isExists === true"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="dbInfoRecordDbKind">DbKind</span>
              <Dropdown
                v-model="dbInfoRecord.dbKind"
                optionLabel="name"
                optionValue="identifier"
                :options="dbKinds"
                aria-labelledby="dbInfoRecordDbKind"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="dbInfoRecordConnectionString">Connection string</span>
              <InputText
                v-model="dbInfoRecord.connectionString"
                size="small"
                aria-labelledby="dbInfoRecordConnectionString"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <span id="dbInfoRecordMemo">Memo</span>
              <Textarea
                v-model="dbInfoRecord.memo"
                rows="5"
                aria-labelledby="appRecordMemo"
                class="w-full"
              />
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
          <Button label="Save" size="small" @click="saveClick" />
        </template>
      </Dialog>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { DbKinds } from '@/enums/dbKinds';
import AppRecordProvider from '@/dataProviders/appRecordProvider';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import DbInfoRecord from '@/models/dbInfoRecord';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
    Checkbox,
    Dropdown,
  },
  props: {
    dbInfoRecord: {
      type: DbInfoRecord,
      required: true,
    },
  },
  emits: {
    cancel: null,
    save: null,
  },
})
export default class DbInfoRecordsEditView extends Vue {
  dbInfoRecord!: DbInfoRecord;
  selectedDbKind = ref();
  dataProvider = new AppRecordProvider();
  toastHelper = new ToastHelper(useToast());
  headerText = 'DbInfoRecord';

  dbKinds = ([
    { name: DbKinds[DbKinds.Postgres], identifier: DbKinds.Postgres },
    { name: DbKinds[DbKinds.SqlServer], identifier: DbKinds.SqlServer },
  ]);

  appIds:string[] = [];

  mounted(): void {
    if (this.dbInfoRecord.id === 0 || this.dbInfoRecord.id === undefined) {
      this.headerText += ' (New)';
    } else {
      const dbKind = this.dbKinds.find((x) => x.identifier === this.dbInfoRecord.dbKind);
      if (dbKind) {
        this.selectedDbKind = ref(dbKind);
      }
    }

    this.loadData();
  }

  async loadData(): Promise<void> {
    const response = await this.dataProvider.getAppRecords();
    if (response.isOK) {
      this.appIds = response.data.map(({ id }) => id);
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  cancelClick(): void {
    this.$emit('cancel');
  }

  saveClick(): void {
    this.$emit('save', this.dbInfoRecord);
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>

</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Ref } from 'vue-property-decorator';
import { useRouter } from 'vue-router';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import DataView from 'primevue/dataview';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import InputText from 'primevue/inputtext';
import Sidebar from 'primevue/sidebar';
import SplitButton from 'primevue/splitbutton';
import DataObjectEditComponent from '@/components/DataObjectEditComponent.vue';
import LogPanel from '@/components/LogPanel.vue';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

@Options({
  components: {
    LogPanel,
    ViewTitleComponent,
    DataView,
    Divider,
    Button,
    ButtonGroup,
    InputText,
    Sidebar,
    SplitButton,
    DataObjectEditComponent,
  },
})
export default class DataObjectEditView extends Vue {
  // Name of metadata object kind.
  @Prop({ required: true, type: String })
  kind!: string;

  // Name of metadata object.
  @Prop({ required: true, type: String })
  name!: string;

  // Identifier of editing item.
  @Prop({ required: false, type: String, default: '' })
  uid!: string;

  // Identifier of source item (item which was copied).
  @Prop({ required: false, type: String, default: '' })
  copyUid!: string;

  @Ref()
  editComponentRef!: any;

  isWaiting = false;
  isModified = false;
  isCalculationLogOpen = false;
  closeAfterSave = false;
  title = 'BaSYS';
  editRegime = 'edit';
  model = new DataObjectWithMetadata(null);
  logger = new InMemoryLogger(LogLevels.Error);
  actionsButtonItems = [
    {
      label: 'Calculation log',
      command: () => this.onCalculationLogClick(),
    },
  ];

  router = useRouter();

  get isPrimaryKeyEnabled(): boolean {
    return this.model.isNew && this.model.isPrimaryKeyEditable;
  }

  get isAdd(): boolean {
    return this.$route.name === 'data-objects-add';
  }

  get isCopy(): boolean {
    return this.$route.name === 'data-objects-copy';
  }

  onBackClick(): void {
    this.returnToList();
  }

  onSaveCloseClick(): void {
    console.log('saveAndClose');
    if (this.editComponentRef) {
      this.closeAfterSave = true;
      console.log('It is edit component');
      this.editComponentRef.triggerSaveClick();
    }
  }

  onSaveClick(): void {
    console.log('save');
    if (this.editComponentRef) {
      console.log('It is edit component');
      this.editComponentRef.triggerSaveClick();
    }
  }

  onIsModifiedChanged(args: boolean): void {
    this.isModified = args;
  }

  onIsWaitingChanged(args: boolean): void {
    this.isWaiting = args;
  }

  onTitleChanged(args: string): void {
    this.title = args;
    document.title = `${args} - BaSYS`;
  }

  onSaved(args: string): void {
    console.log('saved', args);
    if (args && this.closeAfterSave) {
      this.returnToList();
    }
    this.closeAfterSave = false;
  }

  onCalculationLogClick(): void {
    this.isCalculationLogOpen = true;
  }

  onLogPanelHide(): void {
    this.isCalculationLogOpen = false;
  }

  returnToList(): void {
    this.router.push({
      name: 'data-objects',
      params: {
        kind: this.kind,
        name: this.name,
      },
    });
  }

  defineEditRegime(): void {
    if (this.$route.name === 'data-objects-copy') {
      this.editRegime = 'copy';
    } else if (this.$route.name === 'data-objects-add') {
      this.editRegime = 'add';
    } else {
      this.editRegime = 'edit';
    }
  }

  beforeMount(): void {
    this.defineEditRegime();
    console.log('DataObjectEditView before mount', this.editRegime, this.$route.name);
  }
}
</script>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="isModified" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <ButtonGroup>
          <Button
            :label="$t('back')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-arrow-left"
            @click="onBackClick"
          />
          <Button
            :label="$t('saveAndClose')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveCloseClick"
          />
          <Button
            :label="$t('save')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveClick"
          />

        </ButtonGroup>
        <SplitButton
          class="ml-1"
          :label="$t('actions')"
          severity="primary"
          size="small"
          outlined
          :model="actionsButtonItems">
        </SplitButton>

      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>
    <div class="grid">
      <div class="col-12">
        <DataObjectEditComponent ref="editComponentRef"
                                 :regime="editRegime"
                                 :kind="kind"
                                 :name="name"
                                 :uid="uid"
                                 :copyUid="copyUid"
                                 :logger="logger"
                                 render-place="page"
                                 @is-modified-changed="onIsModifiedChanged"
                                 @is-waiting-changed="onIsWaitingChanged"
                                 @title-changed="onTitleChanged"
                                 @saved="onSaved"></DataObjectEditComponent>
      </div>
    </div>
  </div>

  <LogPanel :visible="isCalculationLogOpen"
            :logger="logger"
            :title="$t('calculationLog')"
            @hide="onLogPanelHide"></LogPanel>
</template>

<style scoped>
.bs-required:after {
  content: "*";
  color: red;
  font-size: 12pt;
}
</style>

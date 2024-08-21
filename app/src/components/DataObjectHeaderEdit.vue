<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit, Watch } from 'vue-property-decorator';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toolbar from 'primevue/toolbar';
import DataObjectViewModel from '@/models/dataObjectViewModel';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import DataObjectHeaderFieldEditComponent
  from '@/components/DataObjectHeaderFieldEditComponent.vue';
import DataObjectDetailTableEdit from '@/components/DataObjectDetailTableEdit.vue';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import { PropType } from 'vue';
import ObjectEvaluator from '../evalEngine/objectEvaluator';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';

@Options({
  components: {
    Button,
    ButtonGroup,
    InputGroup,
    InputGroupAddon,
    InputText,
    InputNumber,
    InputIcon,
    IconField,
    Checkbox,
    Calendar,
    TabView,
    TabPanel,
    Toolbar,
    PrimaryKeyInput,
    DataObjectHeaderFieldEditComponent,
    DataObjectDetailTableEdit,
  },
})
export default class DataObjectHeaderEdit extends Vue {
  @Prop({
    type: Object as PropType<DataObjectViewModel>,
    required: true,
  })
  model!: DataObjectViewModel;

  // Logger.
  @Prop({
    type: Object as PropType<InMemoryLogger>,
    required: true,
  })
  logger!: InMemoryLogger;

  @Prop({
    type: Boolean,
    required: true,
  })
  isPrimaryKeyEnabled!: boolean;

  // Specify where component is used. In item edit page or item edit dialog.
  @Prop({
    required: true,
    type: String,
    default: 'page',
  })
  renderPlace!: string;

  searchString = '';
  sortKind = 1;
  windowHeight = window.innerHeight;
  objectEvaluator!: ObjectEvaluator;

  get fieldsContainerStyle(): any {
    if (this.renderPlace === 'page') {
      return {
        height: `${this.windowHeight - 200}px`,
        fontSize: '14px',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
      };
    }

    return { width: '100%' };
  }

  get headerColumnsFiltered(): MetaObjectColumnViewModel[] {
    let result: MetaObjectColumnViewModel[] = [];

    // Filter columns by name.
    if (!this.searchString) {
      result = this.model.headerColumns;
    } else {
      result = this.model.headerColumns.filter(
        (x) => x.title.toLowerCase()
          .includes(this.searchString.toLowerCase()),
      );
    }

    // Sort columns.
    switch (this.sortKind) {
      case 1:
        // Initial sort.
        return result;
      case 2:
        // Reverse.
        return result.slice()
          .reverse();
      case 3:
        // Sort by title.
        return result.slice()
          .sort((a, b) => a.title.localeCompare(b.title));
      case 4:
        // Sort by title DESC.
        return result.slice()
          .sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }

  @Emit('isModifiedChanged')
  isModifiedChanged(newValue: boolean): boolean {
    return newValue;
  }

  @Watch('model')
  onModelChanged(newValue: DataObjectViewModel): void {
    this.objectEvaluator = new ObjectEvaluator(
      this.logger,
      newValue.metaObjectSettings,
      newValue.item,
    );
  }

  onHeaderFieldChange(columnName: string): void {
    this.objectEvaluator.onHeaderFieldChanged(columnName);
    this.isModifiedChanged(true);
  }

  onFieldsSortChangeClick(args: number): void {
    this.sortKind = args;
  }

  onClearSearchClick(): void {
    this.searchString = '';
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
  }

  mounted(): void {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);

      this.objectEvaluator = new ObjectEvaluator(
        this.logger,
        this.model.metaObjectSettings,
        this.model.item,
      );
    });
  }
}
</script>

<template>

  <div class="grid">
    <div :class="{'col-6': renderPlace == 'page', 'col-12': renderPlace == 'dialog'}">
      <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
        <template #start>
          <a href="#"
             class="mr-2 ml-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(1)">
                      <span class="pi pi-sort-numeric-down"
                            :class="{'text-primary': sortKind == 1}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(2)">
                      <span class="pi pi-sort-numeric-up"
                            :class="{'text-primary': sortKind == 2}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(3)">
                      <span class="pi pi-sort-alpha-down"
                            :class="{'text-primary': sortKind == 3}"></span>
          </a>
          <a href="#"
             class="mr-2 bs-toolbar-action"
             tabindex="-1"
             @click.prevent="onFieldsSortChangeClick(4)">
                      <span class="pi pi-sort-alpha-up"
                            :class="{'text-primary': sortKind == 4}"></span>
          </a>
        </template>

        <template #end>
          <InputGroup>
            <InputText v-model="searchString"
                       :placeholder="$t('search')"
                       size="small"/>
            <Button icon="pi pi-times"
                    severity="secondary"
                    @click="onClearSearchClick"
                    outlined></Button>
          </InputGroup>

        </template>
      </Toolbar>
    </div>
  </div>

  <div class="grid" :style="fieldsContainerStyle">
    <div :class="{'col-6': renderPlace == 'page', 'col-12': renderPlace == 'dialog'}">
      <div class="field grid" v-for="column in headerColumnsFiltered"
           :key="column.uid">

        <DataObjectHeaderFieldEditComponent :key="column.uid"
                                            :column="column"
                                            :is-primary-key-enabled="isPrimaryKeyEnabled"
                                            :item="model.item"
                                            @change="onHeaderFieldChange">
        </DataObjectHeaderFieldEditComponent>

      </div>
    </div>

  </div>

</template>

<style scoped>
.field.grid {
  margin-bottom: 0.5rem;
}
</style>

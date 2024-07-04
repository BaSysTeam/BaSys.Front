<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import MetaObjectColumnFlags from '@/models/MetaObjectColumnFlags';
import DataObject from '@/models/dataObject';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';

@Options({
  components: {
    InputText,
    InputNumber,
    Calendar,
    Checkbox,
    PrimaryKeyInput,
  },
})
export default class DataObjectHeaderEditComponent extends Vue {
  @Prop({ type: Object as PropType<MetaObjectTableColumn>, required: true })
  column!: MetaObjectTableColumn;

  @Prop({ type: Object as PropType<DataType[]>, required: true })
  dataTypes!: DataType[];

  @Prop({ type: Object as PropType<DataObject>, required: true })
  item!: DataObject;

  @Prop({ type: Boolean, required: true })
  isPrimaryKeyEnabled!: boolean;

  columnFlags: MetaObjectColumnFlags = new MetaObjectColumnFlags(null, []);

  beforeMount(): void {
    this.columnFlags = new MetaObjectColumnFlags(this.column, this.dataTypes);
  }

  onChange(): void {
    this.$emit('change');
  }
}
</script>

<template>
  <label :for="column.uid"
         :class="{ 'bs-required': column.required }"
         class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>

  <div class="col-12 md:col-8" v-if="columnFlags.isPrimaryKey">

    <PrimaryKeyInput v-model="item.header[column.name]"
                     :id="column.uid"
                     :is-disabled="!isPrimaryKeyEnabled"
                     @change="onChange"></PrimaryKeyInput>

  </div>

  <div class="col-12 md:col-8" v-if="columnFlags.isString">
    <!--String input-->
    <InputText :id="column.uid"
               v-model="item.header[column.name]"
               autocomplete="off"
               size="small"
               class="w-full"
               @update:model-value="onChange"
    />
  </div>

  <!--Integer input-->
  <div class="col-12 md:col-4" v-if="columnFlags.isInt">
    <InputNumber :id="column.uid"
                 v-model="item.header[column.name]"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange"
    />
  </div>

  <!--Number input-->
  <div class="col-12 md:col-4" v-if="columnFlags.isNumber">
    <InputNumber :id="column.uid"
                 v-model="item.header[column.name]"
                 :min-fraction-digits="column.numberDigits"
                 :max-fraction-digits="column.numberDigits"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange"
    />
  </div>

  <!--Checkbox-->
  <div class="col-12 md:col-4" v-if="columnFlags.isBoolean">
    <Checkbox :id="column.uid"
              :binary="true"
              v-model="item.header[column.name]"
              @change="onChange">
    </Checkbox>
  </div>

  <!--Calendar-->
  <div class="col-12 md:col-4" v-if="columnFlags.isDate">
    <Calendar :id="column.uid"
              :show-time="false"
              :show-icon="true"
              :show-button-bar="true"
              iconDisplay="input"
              date-format="dd.mm.yy"
              class="w-full"
              v-model="item.header[column.name]"
              @update:model-value="onChange"></Calendar>

  </div>
</template>

<style scoped>

</style>

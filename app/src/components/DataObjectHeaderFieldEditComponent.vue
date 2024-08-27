<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DataObject from '@/models/dataObject';
import DropdownEditor from '@/components/editors/DropdownEditor.vue';
import SelectItemsProvider from '@/dataProviders/selectItemsProvider';

@Options({
  components: {
    DropdownEditor,
    InputText,
    Textarea,
    InputNumber,
    Calendar,
    Checkbox,
    InputSwitch,
    PrimaryKeyInput,
  },
})
export default class DataObjectHeaderEditComponent extends Vue {
  @Prop({ type: Object as PropType<MetaObjectColumnViewModel>, required: true })
  column!: MetaObjectColumnViewModel;

  @Prop({ type: Object as PropType<DataObject>, required: true })
  item!: DataObject;

  @Prop({ type: Boolean, required: true })
  isPrimaryKeyEnabled!: boolean;

  selectItemProvider = new SelectItemsProvider();

  onChange(columnName: string): void {
    this.$emit('change', columnName);
  }
}
</script>

<template>
  <label :for="column.uid"
         :class="{ 'bs-required': column.required }"
         class="col-12 mb-2 md:col-4 md:mb-0">{{ column.title }}</label>

  <div class="col-12 md:col-8" v-if="column.isPrimaryKey">

    <PrimaryKeyInput v-model="item.header[column.name]"
                     :id="column.uid"
                     :is-disabled="!isPrimaryKeyEnabled"
                     @change="onChange(column.name)"></PrimaryKeyInput>

  </div>

  <!--String input-->
  <div class="col-12 md:col-8" v-if="column.isTextInput">
    <InputText :id="column.uid"
               v-model="item.header[column.name]"
               autocomplete="off"
               size="small"
               class="w-full"
               @update:model-value="onChange(column.name)"
    />
  </div>

  <!--Text area-->
  <div class="col-12 md:col-8" v-if="column.isTextArea">
    <Textarea :id="column.uid"
              :auto-resize="true"
               v-model="item.header[column.name]"
               rows="3"
               size="small"
               class="w-full"
               @update:model-value="onChange(column.name)"
    />
  </div>

  <!--Integer input-->
  <div class="col-12 md:col-4" v-if="column.isInt">
    <InputNumber :id="column.uid"
                 v-model="item.header[column.name]"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange(column.name)"
    />
  </div>

  <!--Number input-->
  <div class="col-12 md:col-4" v-if="column.isNumber">
    <InputNumber :id="column.uid"
                 v-model="item.header[column.name]"
                 :min-fraction-digits="column.numberDigits"
                 :max-fraction-digits="column.numberDigits"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange(column.name)"
    />
  </div>

  <!--Checkbox-->
  <div class="col-12 md:col-4" v-if="column.isCheckbox">
    <Checkbox :id="column.uid"
              :binary="true"
              v-model="item.header[column.name]"
              @change="onChange(column.name)">
    </Checkbox>
  </div>

  <!--Switch-->
  <div class="col-12 md:col-4" v-if="column.isSwitch">
    <InputSwitch :id="column.uid"
              v-model="item.header[column.name]"
              @change="onChange(column.name)">
    </InputSwitch>
  </div>

  <!--Calendar-->
  <div class="col-12 md:col-4" v-if="column.isDateInput">
    <Calendar :id="column.uid"
              :show-time="false"
              :show-icon="true"
              :show-button-bar="true"
              iconDisplay="input"
              date-format="dd.mm.yy"
              class="w-full"
              v-model="item.header[column.name]"
              @update:model-value="onChange(column.name)"></Calendar>

  </div>

  <div class="col-12 md:col-4" v-if="column.isDateTimeInput">
    <Calendar :id="column.uid"
              :show-time="true"
              :show-icon="true"
              :show-button-bar="true"
              iconDisplay="input"
              date-format="dd.mm.yy"
              class="w-full"
              v-model="item.header[column.name]"
              @update:model-value="onChange(column.name)"></Calendar>

  </div>

  <!--Dropdown-->
  <div class="col-12 md:col-8" v-if="column.isDropdown">
      <DropdownEditor :id="column.uid"
                      :data-type-uid="column.dataTypeUid"
                      :provider="selectItemProvider"
                      v-model="item.header[column.name]"
                      @update:model-value="onChange(column.name)"></DropdownEditor>
  </div>

</template>

<style scoped>

</style>

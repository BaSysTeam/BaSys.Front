<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import PrimaryKeyInput from '@/components/editors/PrimaryKeyInput.vue';
import MetaObjectColumnViewModel from '@/models/MetaObjectColumnViewModel';
import DataObject from '@/models/dataObject';

@Options({
  components: {
    InputText,
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

  onChange(): void {
    this.$emit('change');
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
                     @change="onChange"></PrimaryKeyInput>

  </div>

  <div class="col-12 md:col-8" v-if="column.isString">
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
  <div class="col-12 md:col-4" v-if="column.isInt">
    <InputNumber :id="column.uid"
                 v-model="item.header[column.name]"
                 autocomplete="off"
                 size="small"
                 class="w-full"
                 @update:model-value="onChange"
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
                 @update:model-value="onChange"
    />
  </div>

  <!--Checkbox-->
  <div class="col-12 md:col-4" v-if="column.isCheckbox">
    <Checkbox :id="column.uid"
              :binary="true"
              v-model="item.header[column.name]"
              @change="onChange">
    </Checkbox>
  </div>

  <!--Switch-->
  <div class="col-12 md:col-4" v-if="column.isSwitch">
    <InputSwitch :id="column.uid"
              v-model="item.header[column.name]"
              @change="onChange">
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
              @update:model-value="onChange"></Calendar>

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
              @update:model-value="onChange"></Calendar>

  </div>
</template>

<style scoped>

</style>

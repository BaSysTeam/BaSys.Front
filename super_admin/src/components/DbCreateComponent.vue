<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '25rem'}"
      :draggable="false"
      header="Create DB"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <div class="col">
          <span id="adminLogin">Admin login</span>
          <InputText
            v-model="model.adminLogin"
            size="small"
            aria-labelledby="adminLogin"
            class="w-full"
          />
        </div>
        <div class="col">
          <span id="adminPassword">Admin password</span>
          <InputText
            v-model="model.adminPassword"
            size="small"
            aria-labelledby="adminPassword"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          size="small"
          outlined
          @click="$emit('close')"
        />
        <Button label="Create" size="small" @click="createClick" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InitDbRequestDto from '../models/initDbRequestDto';
import WorkDbProvider from '../dataProviders/workDbProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Dialog,
    InputText,
    Button,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  emits: {
    close: null,
  },
})
export default class DbCreateComponent extends Vue {
  id!: number;
  model = new InitDbRequestDto();
  dataProvider = new WorkDbProvider();
  toastHelper = new ToastHelper(useToast());

  async createClick(): Promise<void> {
    const response = await this.dataProvider.initDb(this.id, this.model);
    if (response.isOK) {
      this.toastHelper.success(response.message);
      this.$emit('close');
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }
}
</script>

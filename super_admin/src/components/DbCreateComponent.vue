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
          <span id="adminLogin" class="bs-required">Admin login</span>
          <InputText
            v-model="model.adminLogin"
            size="small"
            aria-labelledby="adminLogin"
            class="w-full"
          />
        </div>
        <div class="col">
          <span id="adminPassword" class="bs-required">Admin password</span>
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
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InitDbRequestDto from '../models/initDbRequestDto';

@Options({
  components: {
    Dialog,
    InputText,
    Button,
  },
  emits: {
    close: null,
    create: null,
  },
})
export default class DbCreateComponent extends Vue {
  model = new InitDbRequestDto();

  async createClick(): Promise<void> {
    this.$emit('close');
    this.$emit('create', this.model);
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
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

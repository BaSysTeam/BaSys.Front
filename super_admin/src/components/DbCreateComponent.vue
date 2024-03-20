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
          <span id="adminEmail">Admin email</span>
          <InputText
            v-model="model.adminEmail"
            size="small"
            aria-labelledby="adminEmail"
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
import DbCreateDto from '@/models/dbCreateDto';
import DbInfoRecord from '@/models/dbInfoRecord';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    Dialog,
    InputText,
    Button,
  },
  props: {
    dbInfoRecord: {
      type: DbInfoRecord,
      required: true,
    },
  },
  emits: {
    close: null,
  },
})
export default class HomeView extends Vue {
  dbInfoRecord!: DbInfoRecord;
  model = new DbCreateDto();
  toastHelper = new ToastHelper(useToast());

  mounted(): void {
    this.model.dbInfoRecordId = this.dbInfoRecord.id;
    this.model.dbInfoRecordName = this.dbInfoRecord.name;
  }

  createClick(): void {
    console.log('createClick');
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('close');
    }
  }
}
</script>

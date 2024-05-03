<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '25rem'}"
      :draggable="false"
      :header="header"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <div class="field grid">
          <span
            for="title"
            class="col-fixed bs-required"
            style="width:110px"
          >
            Title
          </span>
          <div class="col">
            <InputText
              id="title"
              size="small"
              class="w-full"
              autocomplete="off"
              v-model="metaObject.title"
            />
          </div>
        </div>
        <div class="field grid">
          <span
            for="name"
            class="col-fixed bs-required"
            style="width:110px"
          >
            Name
          </span>
          <div class="col">
            <InputText
              id="name"
              size="small"
              class="w-full"
              autocomplete="off"
              v-model="metaObject.name"
            />
          </div>
        </div>
        <div class="field grid">
          <span
            for="comment"
            class="col-fixed"
            style="width:110px"
          >
            Comment
          </span>
          <div class="col">
            <Textarea
              id="comment"
              rows="5"
              class="w-full"
              v-model="metaObject.memo"
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
          @click="$emit('cancel')"
        />
        <Button label="Create" size="small" @click="onCreateClick" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import MetaObject from '@/models/metaObject';

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
  },
  emits: {
    cancel: null,
    create: null,
  },
  props: {
    metadataKindTitle: {
      type: String,
      required: true,
    },
    metadataKindUid: {
      type: String,
      required: true,
    },
  },
})
export default class MetaObjectCreateComponent extends Vue {
  metadataKindTitle!:string;
  metadataKindUid!:string;
  header = 'New';
  metaObject = new MetaObject(null);

  mounted(): void {
    this.header = `${this.header} ${this.metadataKindTitle}`;
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  onCreateClick(): void {
    this.metaObject.metaObjectKindUid = this.metadataKindUid;
    this.$emit('create', this.metaObject);
  }
}
</script>

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
        <Button label="Create" size="small" @click="create" />
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

@Options({
  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
  },
  emits: {
    cancel: null,
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
  header = 'New';

  mounted(): void {
    this.header = `${this.header} ${this.metadataKindTitle}`;
  }

  updateVisible(value: boolean): void {
    if (!value) {
      this.$emit('cancel');
    }
  }

  create(): void {
    console.log('add');
  }
}
</script>

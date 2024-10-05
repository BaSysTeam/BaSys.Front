<script setup lang="ts">
import {
  ref, defineProps, defineEmits, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';

// @component
const name = 'ConsoleResultItemComponent';

const { t } = useI18n({ useScope: 'global' });

// props
const props = defineProps({
  kindUid: { type: String, required: true },
  kindTitle: { type: String, required: true },
});

// Data
const settings = ref<MetaObjectStorableSettings>(new MetaObjectStorableSettings());
const header = computed(() => `${props.kindTitle}`);

// Emits
const emit = defineEmits({ close: (item: MetaObjectStorableSettings) => true });

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

function onCreateClick(): void {
  settings.value.metaObjectKindUid = props.kindUid;
  emit('close', settings.value);
}

</script>

<template>
  <div>
    <Dialog
      :visible="true"
      :style="{width: '30rem'}"
      :draggable="false"
      :header="header"
      class="pb-0"
      modal
      @update:visible="updateVisible"
    >
      <div>
        <div class="field grid">
          <label
            for="fld-title"
            class="col-4 bs-required">
            {{$t('title')}}
          </label>
          <div class="col-8">
            <InputText
              id="fld-title"
              size="small"
              class="w-full"
              autocomplete="off"
              v-model="settings.title"
            />
          </div>
        </div>
        <div class="field grid">
          <label
            for="name"
            class="col-4 bs-required">
            {{$t('name')}}
          </label>
          <div class="col-8">
            <InputText
              id="name"
              size="small"
              class="w-full"
              autocomplete="off"
              v-model="settings.name"
            />
          </div>
        </div>
        <div class="field grid">
          <label
            for="comment"
            class="col-4">
            {{$t('memo')}}
          </label>
          <div class="col-8">
            <Textarea
              id="comment"
              rows="3"
              class="w-full"
              v-model="settings.memo"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          :label="$t('cancel')"
          severity="secondary"
          size="small"
          outlined
          @click="$emit('close')"
        />
        <Button :label="$t('create')"
                size="small"
                @click="onCreateClick" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>

</style>

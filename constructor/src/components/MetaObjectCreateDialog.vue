<script setup lang="ts">
import {
  ref, defineProps, defineEmits, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import MetaObjectCreateDto from '@/models/metaObjectCreateDto';

// @component
const name = 'ConsoleResultItemComponent';

const { t } = useI18n({ useScope: 'global' });

// props
const props = defineProps({
  kindName: { type: String, required: true },
  kindTitle: { type: String, required: true },
});

// Data
const metaObject = ref<MetaObjectCreateDto>(new MetaObjectCreateDto());
const header = computed(() => `${t('new')} ${props.kindTitle}`);

// Emits
const emit = defineEmits({ close: (item: MetaObjectCreateDto) => true });

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

function onCreateClick(): void {
  metaObject.value.kind = props.kindName;
  emit('close', metaObject.value);
}

</script>

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
          <label
            for="fld-title"
            class="col-fixed bs-required"
            style="width:110px">
            {{$t('title')}}
          </label>
          <div class="col">
            <InputText
              id="fld-title"
              size="small"
              class="w-full"
              autocomplete="off"
              v-model="metaObject.title"
            />
          </div>
        </div>
        <div class="field grid">
          <label
            for="name"
            class="col-fixed bs-required"
            style="width:110px">
            {{$t('name')}}
          </label>
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
          <label
            for="comment"
            class="col-fixed"
            style="width:110px">
            {{$t('memo')}}
          </label>
          <div class="col">
            <Textarea
              id="comment"
              rows="3"
              class="w-full"
              v-model="metaObject.memo"
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

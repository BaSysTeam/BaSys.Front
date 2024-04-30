<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Codemirror } from 'vue-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Divider from 'primevue/divider';

import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

@Options({
  components: {
    ViewTitleComponent,
    Button,
    SplitButton,
    Divider,
    Codemirror,
  },
  props: {
    kind: { type: String },
    name: { type: String },
  },
})
export default class MetaObjectEditView extends Vue {
  isModified = false;
  isWaiting = false;
  name!: string;
  kind!: string;
  settingsJson = '';

  codemirrorExtensions = [jsonLang(), githubLight];
  codemirrorEditor: any = null;

  onSaveClick():void {
    console.log('Save click');
  }

  onSettingsInput():void {
    this.isModified = true;
  }
}
</script>

<template>
  <div>
    <!--View title-->
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="MetaObject"
                            :is-modified="isModified"
                            :is-waiting="isWaiting"/>
      </div>
    </div>

    <!--Buttons-->
    <div class="grid">
      <div class="col-12">
        <span class="p-buttonset">
          <Button
            label="Save"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="onSaveClick"
          />
        </span>

      </div>
    </div>

    <div class="grid">
      <Divider class="m-2" />
    </div>

    <!--Settings edit-->
    <div class="grid">
      <div class="col-12">
        <codemirror
          ref="codemirrorEditor"
          v-model="settingsJson"
          placeholder="Code goes here..."
          :style="{ height: '500px' }"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="codemirrorExtensions"
          @change="onSettingsInput"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent title="Migrations" :is-modified="false" :is-waiting="isWaiting"/>
      </div>
    </div>

    <div class="grid">
      <Divider class="m-2"/>
    </div>

    <!--    Migrations grid-->
    <div class="grid">
      <div class="col-8">
        <div class="card m-1">
          <DataTable
            :value="migrations"
            :metaKeySelection="true"
            :style="dataTableStyle"
            showGridlines
            filterDisplay="menu"
            selectionMode="single"
            dataKey="id"
            size="normal"
            scrollable
            scrollHeight="flex"
          >
            <template #empty> No items found.</template>
            <Column header="Applied" bodyClass="text-center">
              <template #body="{ data }">
                <template v-if="data.isApplied === true">
                  <i class="pi pi-check-circle text-green-500" v-tooltip.left="'Applied'"></i>
                </template>
                <template v-else-if="data.isExists === false">
                </template>
              </template>
            </Column>
            <Column field="uid" header="Uid">
              <template #body="{ data }">
                <div style="font-size: 0.8em">
                  {{ data.uid }}
                </div>
              </template>
            </Column>
            <Column field="name" header="Name" style="width: 200px;">
              <template #body="{ data }">
                {{ data.name }}
              </template>
            </Column>
            <Column field="description" header="Description">
              <template #body="{ data }">
                <div style="font-size: 0.8em">
                  {{ data.description }}
                </div>
              </template>
            </Column>
            <Column field="migrationUtcIdentifier" header="Migration date">
              <template #body="{ data }">
                {{ formatDate(data.migrationUtcIdentifier) }}
              </template>
            </Column>
            <Column header=" " bodyClass="text-center">
              <template #body="{ data }">
                <template v-if="data.isPossibleRemove === true">
                  <Button
                    severity="danger"
                    size="small"
                    :disabled="isMigrationButtonsDisabled"
                    icon="pi pi-undo"
                    v-tooltip.left="'Remove migration'"
                    @click="removeMigration()"
                  />
                </template>
                <template v-else-if="data.isApplied === false">
                  <Button
                    severity="success"
                    size="small"
                    :disabled="isMigrationButtonsDisabled"
                    icon="pi pi-angle-double-right"
                    v-tooltip.left="'Apply migration'"
                    @click="applyMigration(data.uid)"
                  />
                </template>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import Divider from 'primevue/divider';
import Migration from '@/models/migration';
import DataTable from 'primevue/datatable';
import MigrationsProvider from '@/dataProviders/migrationsProvider';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Column from 'primevue/column';
import { format } from 'date-fns';
import { ResizeWindow } from '../../../shared/src/mixins/resizeWindow';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    DataTable,
    Column,
    Button,
  },
})
export default class MigrationsView extends mixins(ResizeWindow) {
  migrations: Migration[] = [];
  migrationsProvider = new MigrationsProvider();
  toastHelper = new ToastHelper(useToast());
  isWaiting = false;
  isMigrationButtonsDisabled = false;

  get dataTableStyle(): object {
    return {
      height: `${this.windowHeight - 150}px`,
    };
  }

  mounted(): void {
    this.actionUpdate();
    this.checkRunningMigrations();
  }

  async checkRunningMigrations(): Promise<void> {
    const isMigrationRun = await this.migrationsProvider.isMigrationRun();
    if (isMigrationRun) {
      await this.processMigration();
    }
  }

  async actionUpdate(useIsWaiting = true): Promise<void> {
    if (useIsWaiting) {
      this.isWaiting = true;
    }
    const response = await this.migrationsProvider.getMigrationList();
    if (response.isOK) {
      this.migrations = response.data;
    } else {
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
    if (useIsWaiting) {
      this.isWaiting = false;
    }
  }

  async applyMigration(uid: string): Promise<void> {
    this.isWaiting = true;
    this.isMigrationButtonsDisabled = true;
    const response = await this.migrationsProvider.applyMigration(uid);
    if (response.isOK) {
      await this.processMigration();
    } else {
      this.isMigrationButtonsDisabled = false;
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  async removeMigration(): Promise<void> {
    this.isWaiting = true;
    this.isMigrationButtonsDisabled = true;
    const response = await this.migrationsProvider.removeMigration();
    if (response.isOK) {
      await this.processMigration();
    } else {
      this.isMigrationButtonsDisabled = false;
      this.toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }

  formatDate(date: Date): string {
    return format(date, 'dd.MM.yyyy HH:mm');
  }

  async processMigration(): Promise<void> {
    this.isWaiting = true;
    this.isMigrationButtonsDisabled = true;
    let isMigrationRun = false;
    /* eslint-disable no-await-in-loop */
    do {
      await this.delay(500);
      await this.actionUpdate(false);
      isMigrationRun = await this.migrationsProvider.isMigrationRun();
    }
    while (isMigrationRun);
    /* eslint-enable no-await-in-loop */
    await this.actionUpdate(false);
    this.isWaiting = false;
    this.isMigrationButtonsDisabled = false;
  }

  delay(milliseconds: number): Promise<void> {
    return new Promise((r) => {
      setTimeout(r, milliseconds);
    });
  }
}
</script>

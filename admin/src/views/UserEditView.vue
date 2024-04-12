<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="false" :is-waiting="false" />
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <span class="p-buttonset">
          <Button
            label="Back"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-arrow-left"
            @click="router.push('/users')"
          />
          <Button
            label="Save & Close"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="saveAndClose"
          />
          <Button
            label="Save"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-save"
            @click="save"
          />
        </span>
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2" />
    </div>
    <div class="grid">
      <div class="col-3">
        <div class="grid">
          <div class="col">
            <span id="email" class="bs-required">Email</span>
            <InputText
              :value="user.email"
              @input="onEmailInput($event)"
              size="small"
              aria-labelledby="email"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span id="userName" class="bs-required">User name</span>
            <InputText
              v-model="user.userName"
              size="small"
              aria-labelledby="userName"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid" v-if="!user.id">
          <div class="col">
            <span id="password">Password</span>
            <InputText
              v-model="user.password"
              size="small"
              aria-labelledby="password"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <span>Roles</span>
            <div class="flex flex-column gap-3 mt-1">
              <div
                v-for="role of roles"
                :key="role.key"
                class="flex align-items-center">
                  <Checkbox
                    v-model="selectedRoles"
                    name="role"
                    :value="role.name"
                  />
                  <span class="ml-1">{{ role.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import User from '@/models/user';
import UserProvider from '@/dataProviders/userProvider';
import { RoleKinds } from '@/enums/roleKinds';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

@Options({
  components: {
    ViewTitleComponent,
    Divider,
    InputText,
    Button,
    Checkbox,
  },
})
export default class UserEditView extends Vue {
  title = 'User:';
  route = useRoute();
  router = useRouter();
  user = new User({});
  dataProvider = new UserProvider();
  toastHelper = new ToastHelper(useToast());
  selectedRoles:string[] = [];

  roles = [
    { name: RoleKinds[RoleKinds.Administrator], key: 'A' },
    { name: RoleKinds[RoleKinds.Designer], key: 'D' },
    { name: RoleKinds[RoleKinds.User], key: 'U' },
    { name: RoleKinds[RoleKinds.Readonly], key: 'R' },
  ];

  mounted(): void {
    this.init();
  }

  async init(): Promise<void> {
    if (this.route.query.id) {
      const userId = String(this.route.query.id);
      const response = await this.dataProvider.getUser(userId);
      if (response.isOK) {
        this.user = response.data;
        const checkedRoles = this.user.roles.filter((x) => x.isChecked).map((x) => x.name);
        this.selectedRoles = this.roles.filter(
          (x) => checkedRoles.includes(x.name.toLowerCase()),
        ).map((x) => x.name);
        this.title += ` ${this.user.userName}`;
      } else {
        this.toastHelper.error(response.message);
        console.error(response.presentation);
      }
    } else {
      this.title += ' (New)';
      this.selectedRoles = [RoleKinds[RoleKinds.User]];
      this.user.roles = [
        { name: RoleKinds[RoleKinds.Administrator].toLowerCase(), isChecked: false },
        { name: RoleKinds[RoleKinds.Designer].toLowerCase(), isChecked: false },
        { name: RoleKinds[RoleKinds.User].toLowerCase(), isChecked: false },
        { name: RoleKinds[RoleKinds.Readonly].toLowerCase(), isChecked: false },
      ];
    }
  }

  async save(): Promise<boolean> {
    this.user.roles.forEach((x) => { x.isChecked = false; });
    this.selectedRoles.forEach((selectedRole) => {
      const result = this.user.roles.find(
        (userRole) => userRole.name === selectedRole.toLowerCase(),
      );
      if (result) {
        result.isChecked = true;
      }
    });

    let response = null;

    if (this.user.id) {
      response = await this.dataProvider.updateUser(this.user);
    } else {
      response = await this.dataProvider.createUser(this.user);
    }

    if (response.isOK) {
      this.toastHelper.success(response.message);

      if (!this.user.id) {
        this.user.id = response.data.id;
      }

      return true;
    }

    this.toastHelper.error(response.message);
    console.error(response.presentation);

    return false;
  }

  async saveAndClose(): Promise<void> {
    if (await this.save()) {
      this.router.push('/users');
    }
  }

  onEmailInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.user.email = val;
    this.user.userName = val;
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

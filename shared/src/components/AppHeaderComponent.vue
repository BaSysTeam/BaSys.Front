<template>
    <div class="grid bs-app-header">
        <div
            class="col-fixed flex justify-content-center align-content-center flex-wrap"
            style="width:50px"
        >
            <span
                class="pi pi-bars"
                style="font-size: 1.5rem; cursor: pointer;"
                :onclick="burgerClick">
            </span>
        </div>
        <div class="col">
            <span> {{ title }}</span>
        </div>
        <div class="col flex justify-content-end flex-wrap h-full">
          <SplitButton
            class="h-full bs-locale-btn"
            :label="locale"
            :model="localeItems"
            text
          />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SplitButton from 'primevue/splitbutton';

@Options({
  props: {
    title: String,
    locale: String,
  },
  components: {
    SplitButton,
  },
  emits: {
    burgerClicked: null,
    localeChanged: null,
  },
})
export default class AppHeader extends Vue {
    title!:string;
    locale!:string;

    localeItems = [
      {
        label: 'En',
        command: () => this.$emit('localeChanged', 'En'),
      },
      {
        label: 'Ru',
        command: () => this.$emit('localeChanged', 'Ru'),
      },
    ]

    burgerClick(): void {
      this.$emit('burgerClicked');
    }
}

</script>

<style>
.bs-app-header {
    margin: 0 !important;
    height: 3rem;
    line-height: 2rem;
    font-size: 1.5rem;
    color: white;
    background-color: var(--primary-800);
}

.bs-locale-btn {
  .p-splitbutton-defaultbutton {
    color: white;
  }
  .p-splitbutton-menubutton {
    color: white;
  }
}
</style>

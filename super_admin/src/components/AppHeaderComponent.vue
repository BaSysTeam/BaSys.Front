<template>
    <div class="grid bs-app-header">
        <Toast/>
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
            :label="currentLocale"
            :model="localeItems"
            text
          />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { usePrimeVue } from 'primevue/config';
import { useToast } from 'primevue/usetoast';
import SplitButton from 'primevue/splitbutton';
import Toast from 'primevue/toast';
import ru from '../locales/ru.json';
import en from '../locales/en.json';

@Options({
  props: {
    title: String,
  },
  components: {
    SplitButton,
    Toast,
  },
  emits: {
    burgerClicked: null,
  },
})
export default class AppHeader extends Vue {
    title!:string;
    currentLocale = 'En';
    primeVue = usePrimeVue();
    toast = useToast();

    localeItems = [
      {
        label: 'En',
        command: () => this.changeLocale('En'),
      },
      {
        label: 'Ru',
        command: () => this.changeLocale('Ru'),
      },
    ]

    burgerClick(): void {
      this.$emit('burgerClicked');
    }

    changeLocale(locale: string): void {
      this.currentLocale = locale;

      if (locale === 'En') {
        this.primeVue.config.locale = en.primevue;
      } else {
        this.primeVue.config.locale = ru.primevue;
      }

      this.toast.add(
        {
          severity: 'info',
          summary: 'Info ',
          detail: `The locale has changed to ${this.currentLocale}`,
          life: 3000,
        },
      );
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

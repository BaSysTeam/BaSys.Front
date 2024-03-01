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
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from 'primevue/button';

@Options({
  props: {
    title: String,
  },
  components: {
    Button,
  },
  emits: {
    burgerClicked: null,
  },
})
export default class AppHeader extends Vue {
    title!:string;

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
</style>

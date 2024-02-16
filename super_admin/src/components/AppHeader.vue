<template>
    <div class="grid bs-app-header">
        <div class="col-fixed" style="width:30px"></div>
        <div class="col">
            <span> {{ title }}</span>
        </div>

    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    title: String,
  },
})
export default class AppHeader extends Vue {
    title!:string;
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

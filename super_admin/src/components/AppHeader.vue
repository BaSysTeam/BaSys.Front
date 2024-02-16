<template>
    <div class="bs-app-header"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({

})
export default class AppHeader extends Vue {}

</script>

<style>
.bs-app-header{
    min-height: 3rem;
    color: white;
    background-color: var(--primary-700);
}
</style>

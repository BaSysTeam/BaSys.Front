<template>
    <div class="bs-view-title">
        <h2>
            <span>{{ title }}</span>
            <span v-if="isModified" class="bs-view-title__asterisk">✱</span>
            <span>&nbsp;</span>
            <i v-if="isWaiting" class="pi pi-spin pi-spinner bs-view-title__spinner"></i>
        </h2>

    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    title: String,
    isWaiting: Boolean,
    isModified: Boolean,
  },
})
export default class ViewTitle extends Vue {
    title!:string;

    isWaiting!:boolean;

    isModified!:boolean;
}

</script>

<style>
.bs-view-title{
    color:var(--primary-900);
}

.bs-view-title h2{
    margin: 0.1rem auto;
}

.bs-view-title__asterisk{
    color:var(--red-700);
    vertical-align: 0.1rem;
}

.bs-view-title__spinner{
    font-size: 1.5rem
}

</style>

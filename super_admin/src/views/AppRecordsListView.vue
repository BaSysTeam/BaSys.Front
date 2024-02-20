<template>
    <div>
        <ViewTitle title="Applications" :is-modified="false" :is-waiting="false"></ViewTitle>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ViewTitle from '@/components/ViewTitle.vue';

@Options({
  components: {
    ViewTitle,

  },
})
export default class AppRecordsListView extends Vue {

}
</script>

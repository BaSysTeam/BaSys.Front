<template>
    <div>
      <div>
        <ViewTitle title="Db connections" :is-waiting="false"></ViewTitle>
    </div>
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
export default class DbInfoRecordsListView extends Vue {

}
</script>

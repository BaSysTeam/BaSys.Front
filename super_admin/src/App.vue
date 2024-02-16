<template>
  <AppHeader title="BaSys: DB manage"></AppHeader>
  <div class="grid h-screen" style="margin-top:0">
    <div class="bs-nav-panel col-fixed">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
    </div>
    <div class="col">
      <router-view />
    </div>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from './components/AppHeader.vue';

@Options({
  components: {
    AppHeader,
  },
})
export default class App extends Vue { }
</script>

<style>
body{
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.bs-nav-panel{
  width:200px;
  border-right:1px solid var(--surface-200);
}

</style>

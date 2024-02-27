import { Options, Vue } from 'vue-class-component';

@Options({
})
export class ResizeWindow extends Vue {
    windowHeight = window.innerHeight;

    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      });
    }

    beforeDestroy() {
      window.removeEventListener('resize', this.onResize);
    }

    onResize() {
      this.windowHeight = window.innerHeight;
    }
}

import { Options, Vue } from 'vue-class-component';

@Options({
})
export class ResizeWindow extends Vue {
    windowHeight = window.innerHeight;

    mounted(): void {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      });
    }

    beforeDestroy(): void {
      window.removeEventListener('resize', this.onResize);
    }

    onResize(): void {
      this.windowHeight = window.innerHeight;
    }
}

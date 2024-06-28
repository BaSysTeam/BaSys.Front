import {
  Component, Vue, toNative,
} from 'vue-facing-decorator';

@Component({
})
class ResizeWindowFacing extends Vue {
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

export default toNative(ResizeWindowFacing);

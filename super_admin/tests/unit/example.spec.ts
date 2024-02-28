import { shallowMount } from '@vue/test-utils';
import HelloWorldComponent from '@/components/HelloWorldComponent.vue';

describe('HelloWorldComponent.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorldComponent, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

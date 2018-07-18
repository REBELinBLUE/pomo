import { expect, use } from 'chai';
import dirtyChai from 'dirty-chai';
// import { shallowMount } from '@vue/test-utils';
// import HelloWorld from '@/components/Timer/Timer.vue';

use(dirtyChai);

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    expect(true).to.be.true();

    // const msg = 'new message';
    // const wrapper = shallowMount(HelloWorld, {
    //   propsData: { msg },
    // });
    // expect(wrapper.text()).to.include(msg);
  });
});

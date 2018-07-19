import { expect, use } from 'chai';
import dirtyChai from 'dirty-chai';
import { shallowMount } from '@vue/test-utils';
import Summary from '@/components/Timer/Summary.vue';

use(dirtyChai);

describe('Summary.vue', () => {
  it('renders props when passed', () => {
    const wrapper = shallowMount(Summary, {
      propsData: {
        failed: 1,
        completed: 5,
        target: 10,
      },
    });

    expect(wrapper.text()).to.include('Completed: 5 / 10');
    expect(wrapper.text()).to.include('Interruptions: 1');
  });
});

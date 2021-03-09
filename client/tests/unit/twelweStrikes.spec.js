import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import store from '@/store'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('AddScoreRecord.vue', () => {

  it('Total score is 300 after 12 strikes', async () => {
    const wrapper = shallowMount(AddScoreRecord, {store, localVue})
    for(let i = 0; i < 12; i++){
        await wrapper.vm.checkState(10) 
    }
    expect(wrapper.vm.total).toBe(300)
  })
})

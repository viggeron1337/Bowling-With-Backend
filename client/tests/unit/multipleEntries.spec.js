import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import store from '@/store'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('AddScoreRecord.vue', () => {

  it('Total score is 38', async () => {
    const wrapper = shallowMount(AddScoreRecord, {store, localVue})

    const entryArr = [10,6,4,4,0]

    for(let i = 0; i < 5; i++){
        await wrapper.vm.checkState(entryArr[i]) 
    }
    expect(wrapper.vm.total).toBe(38)
  })
})
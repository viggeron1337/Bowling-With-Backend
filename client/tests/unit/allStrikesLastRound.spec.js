import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import store from '@/store'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('AddScoreRecord.vue', () => {

  it('Total score is 48', async () => {
    const wrapper = shallowMount(AddScoreRecord, {store, localVue})

    const entryArr = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,10]

    for(let i = 0; i < entryArr.length; i++){
        await wrapper.vm.checkState(entryArr[i]) 
    }
    expect(wrapper.vm.total).toBe(48)
  })
})
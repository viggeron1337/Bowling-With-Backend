import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import store from '@/store'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('AddScoreRecord.vue', () => {

  it('Total score is 120', async () => {
    const wrapper = shallowMount(AddScoreRecord, {store, localVue})

    const entryArr = [5,4,10,10,7,2,5,5,1,1,2,3,7,2,4,5,10,5,5]

    for(let i = 0; i < entryArr.length; i++){
        await wrapper.vm.checkState(entryArr[i]) 
    }
    expect(wrapper.vm.total).toBe(120)
  })
})
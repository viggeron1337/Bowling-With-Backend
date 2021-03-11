import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import store from '@/store'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('AddScoreRecord.vue', () => {

  it('Total score is 150', async () => {
    const wrapper = shallowMount(AddScoreRecord, {store, localVue})

    const entryArr = [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]

    for(let i = 0; i < entryArr.length; i++){
        await wrapper.vm.checkState(entryArr[i]) 
    }
    expect(wrapper.vm.total).toBe(150)
  })
})
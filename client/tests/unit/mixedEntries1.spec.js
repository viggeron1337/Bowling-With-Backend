import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import store from '@/store'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('AddScoreRecord.vue', () => {

  it('Total score is 139', async () => {
    const wrapper = shallowMount(AddScoreRecord, {store, localVue})

    const entryArr = [5,4,3,3,4,6,6,4,5,5,6,2,2,2,10,10,5,5,10]

    for(let i = 0; i < entryArr.length; i++){
        await wrapper.vm.checkState(entryArr[i]) 
    }
    expect(wrapper.vm.total).toBe(139)
  })
})
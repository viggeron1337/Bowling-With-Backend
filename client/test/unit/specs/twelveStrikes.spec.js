import Vue from 'vue'
import Vuex from 'vuex'
import {AddScoreRecord} from '@/components/AddScoreRecord.vue'
import {istore} from '@/store'

Vue.use(Vuex)
describe('AddScoreRecord.vue', () => {

    const Component = Vue.extend({AddScoreRecord})

    var store = new Vuex.Store({istore})

    const vm = new Component({store}).$mount()

    var myCounter = class Counter {
        static counter = 0
    }

    it('The result of 12 strikes should be 300', async () => {
        for (let i = 0; i < 12; i++) {
            console.log('Sending...')
         await vm.checkState(10)
        }
        expect(myCounter.counter).to.equal(300)
    })
})

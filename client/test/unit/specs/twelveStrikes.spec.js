import Vue from 'vue'
import Vuex from 'vuex'
import AddScoreRecord from '@/components/AddScoreRecord.vue'
import {store} from '@/store'

Vue.use(Vuex)
describe('AddScoreRecord.vue', () => {

    const Component = Vue.extend(AddScoreRecord)
    const vm = new Component({store}).$mount()

    var myCounter = class Counter {
        static counter = 0
    }

    it('The result of 12 strikes should be 300', () => {
        let promises = []
        let responses = []
        for (let i = 0; i < 12; i++) {
            //vm.mCheckRound()
            console.log('Sending...')
           /*   promises.push(vm.calculate(10).then((res) => {
                //myCounter.counter += res.data.scoreContainer
                //responses.push(res)
            })) */
        }
      /* Promise.all(promises).then((res) =>
        {
          console.log(res)
        }) */
        expect(myCounter.counter).to.equal(300)
    })
})

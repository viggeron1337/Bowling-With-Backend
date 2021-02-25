import Api from '@/services/Api'

// State for this component, that can be accessed by the application.
const state = {
    totalScore: 0,
    totalTries: 0,
    player : {
        entries : [], 
        currTry : 0, 
        currRound : 0,
        latestEntry : 
        {
            value: 0,
            strike: false,
            spare: false
        }
    }
    }; 

//Getters for state props
const getters = {
    getTotal(state){
       return state.totalScore
    },
    getLatest(state){
        return state.player.latestEntry
    },
    getCurrRound(state){
        return state.player.currRound
    },
};

// Run services on backend and commit changes with actions, 
// deciding which mutation function to be called for each variant.
const actions = {
  async calculate({commit}, newScoreValue){
      var calcObj ={
          score : newScoreValue,
          totalTries: state.totalTries,
          player : state.player
      }
      await Api().put('calculateTotal', calcObj)
      .then( (res) => {
        commit('mFinishRound', res.data.scoreContainer)
      }
    )
  }
};


/*Submit to state via mutations. Usually this is done through
actions - but since most of the needed operations are not asynchronous,
I commit most of these mutations from a method in "AddScoreRecord.vue"*/
const mutations = {
    mCheckRound: (state)  => {
        const strikeStatus = state.player.latestEntry.strike
        if(state.player.currTry >= 2 || strikeStatus){
            state.player.currRound++
            state.player.currTry = 0
        }
    },
    mAddStrike: (state) => {
        const strikeEntry = {
            value: 10,
            strike: true,
            spare: false
        }
        state.player.latestEntry = strikeEntry
        state.player.entries.push(strikeEntry)
        state.player.currTry++
        console.log("Strike!")
    },
    mAddSpare: (state, newScore) => {
        const spareEntry = {
            value: newScore,
            strike: false,
            spare: true
        }
        state.player.latestEntry = spareEntry
        state.player.entries.push(spareEntry)
        state.player.currTry++
        console.log("Spare!")
    },
    mAddEntry: (state, newScore) =>{
        const entry = {
            value: newScore,
            strike: false,
            spare: false
        }
        state.player.latestEntry = entry
        state.player.entries.push(entry)
        state.player.currTry++
    },
    mFinishRound: (state, addToTotal) => {
        state.totalScore += addToTotal
        state.totalTries++;
        console.log('The total score is now: ' + state.totalScore)
    },

};

export default {
    state,
    getters, 
    actions, 
    mutations
}


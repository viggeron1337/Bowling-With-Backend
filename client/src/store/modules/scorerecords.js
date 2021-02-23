import Api from '@/services/Api'



// State for this component, that can be accessed by the application.
const state = {
    rounds:[],
    turnCount: 0,
    roundId: 0,
    activeScores:[],
    totalScore: 0
    }; 

//Gets the global state of the component
const getters = {
    allRoundRecords: (state) => state.rounds
};

// Run services on backend and commit changes with actions, 
// deciding which mutation function to be called for each variant.
const actions = {
  async addScore({commit}, newScoreValue){
      if(state.turnCount < 2)
      {
        const entryData = {
            entry:{
                value: newScoreValue,
                spare: false,
                strike: false,
            }
        }

        if(state.turnCount == 0 && entryData.entry.value == 10){
            entryData.entry.strike = true; 
            console.log('Strike!')
        }
        else if(state.turnCount > 0 && state.activeScores[0].entry.value + 
            entryData.entry.value >= 10){
                entryData.entry.spare = true;
                console.log('Spare!') 
            }

        state.activeScores[state.turnCount] = entryData
        state.turnCount++; 
   
        if(state.turnCount == 2 || entryData.entry.strike){
         await Api().put(`addScore`, 
            {completeTurn: state.activeScores, history: state.rounds, roundId: state.roundId})
            .then(
                commit('addScoreNew',state.activeScores) 
            )
            state.activeScores = []
        }
      }
  }
};

// Submit results of actions to the overall application state
const mutations = {
    addScoreNew: (state, newEntry, total)  => {
        state.rounds[state.roundId] = newEntry
        state.turnCount = 0
        state.roundId++;
    }
};

export default {
    state,
    getters, 
    actions, 
    mutations
}


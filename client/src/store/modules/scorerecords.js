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

//Gets the global state of the component
const getters = {
    getTotal(state){
       return state.totalScore
    }
};

// Run services on backend and commit changes with actions, 
// deciding which mutation function to be called for each variant.
const actions = {
      updatePlayer({commit}, newScoreValue){
      //if(state.intitalRecord)
      {
        /*Check status of game and round*/
        if(state.player.currRound < 12){
            
            var newEntry = {}
            /*Check if strike*/
            if(state.player.currTry == 0 && newScoreValue == 10){
                newEntry = {
                    value: newScoreValue,
                    strike: true,
                    spare: false
                }
                console.log('Strike!')
            }
            /*Check if spare*/
            else if(state.player.currTry == 1 && 
                (state.player.entries[state.player.entries.length - 1].value + newScoreValue) == 10){
                newEntry = {
                    value: newScoreValue,
                    strike: false,
                    spare: true
                }
                console.log('Spare!') 
            }
            else{
                newEntry = {
                    value: newScoreValue,
                    strike: false,
                    spare: false
                }
            }
        }

        /*Fetch the entry history to add to the player*/
        var entryArr = state.player.entries
        var arrSize = entryArr.push(newEntry)

        var newPlayerState = {}
        if(state.player.currRound == 0 && state.player.currTry == 0)
        {   
            newPlayerState = {
                entries : entryArr,
                currTry : state.player.currTry + 1,
                currRound : state.player.currRound,
                latestEntry : {}
               }
        }
        else{
            newPlayerState = {
                entries : entryArr,
                currTry : state.player.currTry + 1,
                currRound : state.player.currRound,
                latestEntry : entryArr[(arrSize - 1) -1]
               } 
        }
     
       commit('mUpdatePlayer', newPlayerState)
      }
  },
  async calculate({commit}, newScoreValue){
      var calcObj ={
          score : newScoreValue,
          totalTries: state.totalTries,
          player : state.player
      }
      await Api().put('calculateTotal', calcObj)
      .then( (res) => {
        commit('updateTotal', res.data.scoreContainer)
      }
    )
  }
};


// Submit results of actions to the overall application state
const mutations = {
    mUpdatePlayer: (state, playerState)  => {
        state.player = playerState

        const historyLength = state.player.entries.length
        const strikeStatus = state.player.entries[historyLength - 1].strike

        if(state.player.currTry >= 2 || strikeStatus){
            state.player.currRound++
            state.player.currTry = 0
        }
    },
    updateTotal: (state, addToTotal) => {
        state.totalScore += addToTotal
        state.totalTries++;

        console.log('The total score is now: ' + state.totalScore)
    }
};

export default {
    state,
    getters, 
    actions, 
    mutations
}


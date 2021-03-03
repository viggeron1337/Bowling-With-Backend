import Api from '@/services/Api'

// State that can be accessed by the application.
export const state = {
    totalScore: 0,
    totalTries: 0,
    player: {
        entries: [],
        currTry: 0,
        currRound: 0,
        latestEntry: {
            pinsHit: 0,
            strike: false,
            spare: false
        }
    }
};

// Getters for state props
 export const getters = {

};

// Run services on backend and commit changes with actions,
// deciding which mutation function to be called for each variant.
const actions = {
    async aCalculate({
        commit
    }, pinsHit) {
        var calcTotal = {
            pins: pinsHit,
            totalTries: state.totalTries,
            player: state.player
        }
        await Api().put('calculateTotal', calcTotal).then((res) => {
            commit('mAddToTotal', res.data.scoreContainer)
            console.log("Submitted")
        })
    },
    aAddEntry({commit},entry){
        commit('mAddEntry', entry)
    },
    aNextTry({commit}){
        commit('mNextTry')
    },
    aResetTries({commit}){
        commit('mResetTries')
    },
    aIncTotalTries({commit}){
        commit('mIncTotalTries')
    },
    aCheckRound({commit}){
        commit('mCheckRound')
    }
};



/*Submit to state via mutations. Usually this is done through
actions - but since most of the needed operations are not asynchronous,
I commit most of these mutations from a method in "AddScoreRecord.vue"*/
const mutations = {
    mCheckRound: (state) => {
        const strikeStatus = state.player.latestEntry.strike
        if (state.player.currTry >= 2 || strikeStatus) {
            state.player.currRound ++
        }
    },
    mAddEntry: (state, entry) =>{
        state.player.latestEntry = entry
        state.player.entries.push(entry)
    },
    mNextTry: (state) =>{
        state.player.currTry++
    },
    mResetTries: (state) =>{
        state.player.currTry = 0
    },
    mIncTotalTries: (state) =>{
        state.totalTries++
    },
    mAddToTotal: (state, addToTotal) => {
        state.totalScore += addToTotal
        console.log("Total score is now: " + state.totalScore)
    }
};

export default {state, getters, actions, mutations}

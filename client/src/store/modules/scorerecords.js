import Api from '@/services/Api'

// State container for the application
export const state = {
    totalScore: 0,
    totalTries: 0,
    maxTries: 20,
    player: {
        entries: [],
        currTry: 0,
        latestEntry: {
            pinsHit: 0,
            strike: false,
            spare: false,
        }
    }
};

// Getters for state props
export const getters = {};

// Run services on backend and commit changes with actions,
// deciding which mutation function to be called for each variant.
const actions = {
    async aCalculate({commit}, pinsHit) {
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
    aAddEntry({commit}, entry) {
        commit('mAddEntry', entry)
    },
    aNextTry({commit}) {
        commit('mNextTry')
    },
    aResetCurrTry({commit}) {
        commit('mResetCurrTry')
    },
    aIncTotalTries({commit}) {
        commit('mIncTotalTries')
    },
    aSetTotalTries({commit}, tryIndex) {
        commit('mSetTotalTries', tryIndex)
    },
    aSetMaxTries({commit}, max) {
        commit('mSetMaxTries', max)
    },
    aResetState({commit}){
        commit('mResetState')
    }
};

/*Submit to state via mutations.*/
const mutations = {
    mAddEntry: (state, entry) => {
        state.player.latestEntry = entry
        state.player.entries.push(entry)
    },
    mNextTry: (state) => {
        state.player.currTry ++
    },
    mResetCurrTry: (state) => {
        state.player.currTry = 0
    },
    mIncTotalTries: (state) => {
        state.totalTries ++
    },
    mAddToTotal: (state, addToTotal) => {
        state.totalScore += addToTotal
        console.log("Total score is now: " + state.totalScore)
    },
    mSetTotalTries: (state, tryIndex) => {
        state.totalTries = tryIndex
    },
    mSetMaxTries: (state, max) => {
        state.maxTries = max
    },
    mResetState: (state) => {
        state.totalScore = 0
        state.totalTries = 0
        state.maxTries = 20
        state.player.entries = []
        state.player.currTry = 0,
        state.player.latestEntry = {
            pinsHit: 0,
            strike: false,
            spare: false,
        }
    }
};

export default {state, getters, actions, mutations}

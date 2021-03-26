import Api from '@/services/Api'

// State container for the application
export const state = {
    playerID: 0,
    players: [
        {
            totalScore: 0,
            totalTries: 0,
            maxTries: 20,
            entries: [],
            currTry: 0,
            latestEntry: {
                pinsHit: 0,
                strike: false,
                spare: false
            }
        }
    ]
};

// Getters for state props
export const getters = {};

// Run services on backend and commit changes with actions,
// deciding which mutation function to be called for each variant.
const actions = {
    async aCalculate({
        commit
    }, pinsHit) {
        var calcTotal = {
            pins: pinsHit,
            player: state.players[state.playerID]
        }
        await Api().put('calculateTotal', calcTotal).then((res) => {
            commit('mAddToTotal', res.data.scoreContainer)
            console.log("Submitted")
        })
    },
    aAddEntry({
        commit
    }, entry) {
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
    aSetTotalTries({
        commit
    }, tryIndex) {
        commit('mSetTotalTries', tryIndex)
    },
    aNextPlayer({commit}) {
        commit("mNextPlayer")
    },
    aSetMaxTries({
        commit
    }, max) {
        commit('mSetMaxTries', max)
    },
    aResetState({commit}) {
        commit('mResetState')
    }
};

/*Submit to state via mutations.*/
const mutations = {
    mAddEntry: (state, entry) => {
        state.players[state.playerID].latestEntry = entry
        state.players[state.playerID].entries.push(entry)
    },
    mNextTry: (state) => {
        state.players[state.playerID].currTry ++
    },
    mResetCurrTry: (state) => {
        state.players[state.playerID].currTry = 0
    },
    mIncTotalTries: (state) => {
        state.players[state.playerID].totalTries ++
    },
    mAddToTotal: (state, addToTotal) => {
        state.players[state.playerID].totalScore += addToTotal
        console.log("Total score is now: " + state.players[state.playerID].totalScore)
    },
    mSetTotalTries: (state, tryIndex) => {
        state.players[state.playerID].totalTries = tryIndex
    },
    mNextPlayer: (state) => {
        state.playerID ++
        state.playerID %= state.players.length;
    },
    mSetMaxTries: (state, max) => {
        state.players[state.playerID].maxTries = max
    },
    mResetState: (state) => {
        const size = state.players.length;
        state.playerID = 0;
        for (let i = 0; i < size; i++) {
            state.players[i].totalScore = 0
            state.players[i].totalTries = 0
            state.players[i].maxTries = 20
            state.players[i].entries = []
            state.players[i].currTry = 0,
            state.players[i].latestEntry = {
                pinsHit: 0,
                strike: false,
                spare: false
            }
        }
    }
};

export default {state, getters, actions, mutations}

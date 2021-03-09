<template>
  <div>
    <h2>Enter Turn Score</h2>
    <ul>
      <li v-for="index in 11" :key="index">
        <button v-on:click="checkState(index - 1)" type="button">{{index - 1}}</button>
      </li>
    </ul>
    <div id="totalScore">
      <TotalScoreComponent :totalScore="this.total"></TotalScoreComponent>
    </div>
  </div>
</template>

<script>
import TotalScoreComponent from "../components/TotalScore.vue";
import store from "@/store/modules/scorerecords.js";
export default {
  name: "AddScoreRecord",
  components: {
    TotalScoreComponent
  },
  /*data - container for the data belonging to this component:
  needs to be returned from a function so that every new
  instance of this component gets thier own versions.
  This differs from props not only because of the above, but also
  because these are items we want to keep track of.*/
  data() {
    return {
      round: 0,
      latestEntry: {},
      total: 0,
      allPins : 10
    };
  },
  /*methods - contains the methods of this component,
  allows for parameters as opposed to computed*/
  methods: {
    async checkState(pinsHit) {
      
      this.round = store.state.player.currRound;
      this.latestEntry = store.state.player.latestEntry;

      if (this.round < 12) {
        /*Check if strike, spare or normal entry.*/
        this.CheckScoreType(pinsHit);
        /*Check if next round is to be started*/
        this.$store.dispatch('aCheckRound');
        /*Update total score with latest entry.*/
        await this.upateTotalScore(pinsHit);
        /*Set the current try*/
        this.$store.dispatch('aNextTry');
      }
    },
    async upateTotalScore(pinsHit) {
      await this.$store.dispatch('aCalculate', pinsHit).then(() => {
        /*After score has been registered, increase total tires and
        print new total*/
        this.$store.dispatch('aIncTotalTries');
        this.total = store.state.totalScore
        console.log("Done!");
      });
    },
    createEntry(pinsHit) {
      return {
        strike: false,
        spare: false,
        pinsHit: pinsHit
      };
    },
    CheckScoreType(pinsHit) {
      /*Create an empty entry*/
      var entry = this.createEntry(pinsHit);
      /*Check if strike*/
      if (pinsHit == this.allPins) {
        entry.strike = true;
        this.$store.dispatch('aAddEntry', entry);
        this.$store.dispatch('aResetTries');
      }
      /*Check if spare*/ 
      else if (pinsHit + this.latestEntry.pinsHit == this.allPins) {
        entry.spare = true;
        this.$store.dispatch('aAddEntry', entry);
        this.$store.dispatch('aResetTries');
      }
      /*Else just add entry*/ 
      else {
        this.$store.dispatch('aAddEntry', entry);
      }
    }
  },
  /*computed - properties does not get updated everytime we re-render -
  only when they have been affected. Often used when wanting to access
  results of state calculations.*/
  computed: {}
};
</script>

<style scoped>
h2 {
  position: static;
  padding: 20px 50.5px;
  background: rgb(42, 48, 53);
  color: rgb(65, 148, 107);
}
ul {
  position: relative;
  list-style-type: none;
  display: inline-flex;
  flex-direction: row;
}
li {
  padding-left: 4.5px;
}
</style>
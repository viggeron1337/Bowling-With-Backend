<template>
  <div>
    <ul>
      <li v-for="index in this.activeButtons" :key="index">
        <button v-on:click="checkState(index - 1)" type="button">
          {{ index - 1 }}
        </button>
      </li>
    </ul>
    <div id="totalScore">
      <TotalScoreComponent :totalScore="this.total"></TotalScoreComponent>
    </div>
    <div>
      <BowlingSchemaComponent
        :updateTrigger="this.schemaUpdateTrigger"
        @reset="onResetClickChild"
      ></BowlingSchemaComponent>
    </div>
  </div>
</template>

<script>
import TotalScoreComponent from "../components/TotalScore.vue";
import BowlingSchemaComponent from "../components/BowlingSchema.vue";
import store from "@/store/modules/scorerecords.js";
export default {
  name: "AddScoreRecord",
  components: {
    TotalScoreComponent,
    BowlingSchemaComponent,
  },
  /*data - container for the data belonging to this component:
  needs to be returned from a function so that every new
  instance of this component gets thier own versions.
  This differs from props not only because of the above, but also
  because these are items we want to keep track of.*/
  data() {
    return {
      latestEntry: {},
      total: 0,
      allPins: 10,
      totalTries: 0,
      gameExtended: false,
      activeButtons: 11,
      schemaUpdateTrigger: 0,
    };
  },
  /*methods - contains the methods of this component,
  allows for parameters as opposed to computed*/
  methods: {
    async checkState(pinsHit) {
      this.totalTries = store.state.totalTries;

      if (this.totalTries < store.state.maxTries) {
        /*Set the current try*/
        this.$store.dispatch("aNextTry");

        /*Check if strike, spare or normal entry.*/
        this.checkScoreType(pinsHit);

        /*Update total score with latest entry.*/
        await this.upateTotalScore(pinsHit);

        /*Adjust the buttons to be rendered*/
        this.adjustButtons(pinsHit);

        /*Award extra turns if spare or strike on last turn*/
        this.checkExtend();

        /*Trigger shcema update*/
        this.schemaUpdateTrigger++;
      }
    },
    checkScoreType(pinsHit) {
      /*Create an empty entry*/
      var entry = this.createEntry(pinsHit);

      //Fetch current try.
      const currTry = store.state.player.currTry;

      /*Check if strike*/
      if (pinsHit == this.allPins) {
        entry.strike = true;
        this.$store.dispatch("aAddEntry", entry);
        this.$store.dispatch("aResetCurrTry");
      } else if (
        /*Check if spare - currTry must be 2 not to evaluate spare acorss different tries*/
        pinsHit + this.latestEntry.pinsHit == this.allPins &&
        currTry == 2
      ) {
        entry.spare = true;
        this.$store.dispatch("aAddEntry", entry);
      } else {
        /*Else just add entry*/
        this.$store.dispatch("aAddEntry", entry);
      }
      /*Make sure to reset current try for new round*/
      if (currTry == 2) {
        this.$store.dispatch("aResetCurrTry");
      }
    },
    createEntry(pinsHit) {
      return {
        strike: false,
        spare: false,
        pinsHit: pinsHit,
      };
    },
    async upateTotalScore(pinsHit) {
      await this.$store.dispatch("aCalculate", pinsHit).then(() => {
        /*After score has been registered, increase total tires and
        print new total. Use the latest entry to determine how many tries 
        should be skipped.*/
        this.latestEntry = store.state.player.latestEntry;
        this.updateTotalTryIndex(this.latestEntry);
        this.total = store.state.totalScore;
        console.log("Done!");
      });
    },
    updateTotalTryIndex(entry) {
      /*Aslong as the game has not been extended, a strike counts as 2 tries*/
      if (entry.strike && !this.gameExtended) {
        this.$store.dispatch("aSetTotalTries", this.totalTries + 2);
      } else {
        this.$store.dispatch("aSetTotalTries", this.totalTries + 1);
      }
    },
    checkExtend() {
      /*If we are at the last round and we get a spare or a strike,
      award extra tries*/
      if (
        (this.latestEntry.spare || this.latestEntry.strike) &&
        store.state.totalTries == store.state.maxTries &&
        !this.gameExtended
      ) {
        this.extendGame(this.latestEntry);
      }
    },
    extendGame(entry) {
      if (entry.spare) {
        this.$store.dispatch("aSetMaxTries", store.state.maxTries + 1);
      } else {
        this.$store.dispatch("aSetMaxTries", store.state.maxTries + 2);
      }
      this.gameExtended = true;
    },
    adjustButtons(pinsHit) {
      if (
        store.state.player.currTry == 1 &&
        this.totalTries != store.state.maxTries - 1
      ) {
        this.activeButtons -= pinsHit;
      } else {
        this.activeButtons = 11;
      }
    },
    onResetClickChild() {
      this.total = 0;
      this.totalTries = 0;
      this.activeButtons = 11;
      this.gameExtended = false;
      this.latestEntry = {};
    },
  },

  /*computed - properties does not get updated everytime we re-render -
  only when they have been affected.*/
  computed: {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap");
ul {
  align-self: center;
  list-style-type: none;
  display: inline-flex;
  flex-direction: row;
  transform-origin: left;
}
li {
  padding-left: 10px;
  padding-right: 10px;
}
button {
  font-family: "Teko", sans-serif;
  transform: scale(1.5, 1.5);
  border-radius: 25px;
  background-color: thistle;
  border-color: rgb(94, 82, 82);
}
</style>
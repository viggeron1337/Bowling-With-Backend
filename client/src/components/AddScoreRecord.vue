<template>
  <div>
    <h2>Enter Turn Score</h2>
      <ul>
        <li v-for="index in 11" :key="index">
          <button v-on:click="checkState(index - 1)" type="button">{{index - 1}}</button>
        </li>
      </ul>
    <div id="totalScore">
      <TotalScoreComponent :totalScore="total"></TotalScoreComponent>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import TotalScoreComponent from "../components/TotalScore.vue";
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
    return {};
  },
  /*methods - contains the methods of this component,
  allows for parameters as opposed to computed*/
  methods: {
    ...mapActions(["calculate"]),
    ...mapMutations(["mAddStrike", "mAddSpare", "mAddEntry", "mCheckRound"]),
    async checkState(value) {
      if (this.round < 12) {
        if (value == 10) {
          this.mAddStrike();
        } else if (value + this.latestEntry.value == 10) {
          this.mAddSpare(value);
        } else {
          this.mAddEntry(value);
        }
        this.mCheckRound();
        await this.calculate(value).then(() => {
          console.log("Done!");
        });
      }
    }
  },
  /*computed - properties does not get updated everytime we re-render -
  only when they have been affected*/
  computed: {
    ...mapGetters({
      total: "getTotal",
      latestEntry: "getLatest",
      round: "getCurrRound"
    })
  }
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
  position:relative;
  list-style-type: none;
  display: inline-flex;
  flex-direction: row;
}
li {
  padding-left: 4.5px;
}
</style>
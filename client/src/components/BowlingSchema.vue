<template>
  <div>
    {{assignNewEntry}}
    <ul class="flex-container">
      <li v-for="index in 10" :key="index">
        <!--{{assignNewEntry[index - 1]}}-->
        <div class = "scoreContainer">
          {{schema[index - 1].first}} {{schema[index - 1].second}}
          {{schema[index - 1].total}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "@/store/modules/scorerecords.js";
export default {
  name: "BowlingSchema",

  data() {
    return {
      schema: [],
      schemaIndex: 0,
      turn: 0
    };
  },
  created: function() {
    for (let i = 0; i < 9; i++) {
      this.schema[i] = {
        first: "0",
        second: "0",
        total: "0"
      };
      this.schema[9] = {
        first: "0",
        second: "0",
        bonus1: "",
        bonus2: "",
        total: "0"
      };
    }
    this.created = true
  },
  computed: {
    assignNewEntry: function() {
      const entry = store.state.player.latestEntry;

      if (entry.strike) {
        this.schema[this.schemaIndex].total = "X";
        this.prevPinsHit = entry.pinsHit;
        this.schemaIndex++;
        this.turn = 1;
      } else if (entry.spare) {
        this.schema[this.schemaIndex].total = "/";
        this.prevPinsHit = entry.pinsHit;
        this.schemaIndex++;
        this.turn = 1;
      }

      if (this.turn == 0) {
        this.turn++;
      } else if (this.turn == 1) {
        this.schema[this.schemaIndex].first = entry.pinsHit;
        this.turn++;
      } else {
        this.schema[this.schemaIndex].second = entry.pinsHit;
        this.schemaIndex++;
        this.turn = 1;
      }
    }
  }
};
</script>

<style scoped>
.flex-container {
  list-style-type: none;
  flex-direction: row;
  display: flex;
  justify-content: center;
  border: 1em #4abc41;
  border-style: inset;
  padding-right: 0px;
  padding-left: 0px;
}
.scoreContainer {
  color: black;
  border-style: inset;  
  border-block-color: rgba(50, 200, 50, 255);
  background-color: mediumseagreen;
}
</style>
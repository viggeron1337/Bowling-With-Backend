<template>
  <div>
    {{assignNewEntry}}
    <ul class="flex-container">
      <li v-for="index in 10" :key="index">
        <div class="scoreContainer" v-if="index < 10">
          <span class="firstBall">{{schema[index - 1].first}}</span>
          <span class="secondBall">{{schema[index - 1].second}}</span>
          <div class="total">{{schema[index - 1].total}}</div>
        </div>
        <div class="scoreContainer" v-else>
          <span class="firstBall">{{schema[index - 1].first}}</span>
          <span class="secondBall">{{schema[index - 1].second}}</span>
          <span class="bonusBall">{{schema[index - 1].bonus}}</span>
          <div class="total">{{schema[index - 1].total}}</div>
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
      turn: 0,
      bonusCounter: 0,
      bonusMax: 0,
      extended: false
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
        bonus: "0",
        total: "0"
      };
    }
    this.created = true;
  },
  computed: {
    assignNewEntry: function() {
      const entry = store.state.player.latestEntry;

      if (this.turn == 0) {
        this.turn++;
        return;
      }
      
      if (this.schemaIndex < 9) {
        this.handleRounds(entry);
      } else {
        this.handleBonus(entry);
      }
    }
  },
  methods: {
    handleRounds(entry) {
      if (this.turn == 1) {
        if (entry.strike) {
          this.schema[this.schemaIndex].first = "X";
          this.schemaIndex++;
          return;
        }
        this.schema[this.schemaIndex].first = entry.pinsHit;
        this.turn++;
      } else if (this.turn == 2) {
        if (entry.spare) {
          this.schema[this.schemaIndex].second = "/";
        } else {
          this.schema[this.schemaIndex].second = entry.pinsHit;
        }
        this.schemaIndex++;
        this.turn = 1;
      }
    },
    handleBonus(entry) {
      if (this.bonusCounter <= this.bonusMax) {
        if (entry.strike) {
          this.handleStrikeBonus();
        } else if (entry.spare) {
          this.handleSpareBonus();
        } 
        else{
          this.handleRegularBonus(entry);
        }
        this.turn++;
      }
    },
    handleStrikeBonus() {
      if (this.turn == 1) {
        this.schema[this.schemaIndex].first = "X";
        this.bonusMax = 2;
        this.bonusCounter++;
        this.extended = true;
      } else if (this.turn == 2) {
        this.schema[this.schemaIndex].second = "X";
        this.bonusCounter++;
      } else if (this.turn == 3) {
        this.schema[this.schemaIndex].bonus = "X";
        this.bonusCounter++;
      }
    },
    handleSpareBonus() {
      if (this.turn == 2) {
        this.schema[this.schemaIndex].second = "/";
        this.bonusMax = 1;
        this.bonusCounter++;
        this.extended = true;
      } else if (this.turn == 3) {
        this.schema[this.schemaIndex].bonus = "/";
        this.bonusCounter++;
      }
    },
    handleRegularBonus(entry) {
      if (this.turn == 1) {
        this.schema[this.schemaIndex].first = entry.pinsHit;
      } else if(this.turn == 2) {
        this.schema[this.schemaIndex].second = entry.pinsHit;
        if (!this.extended) {
          this.bonusMax = -1;
        }
      }
      /*For last bonus ball if not spare or strike*/
      else{
          this.schema[this.schemaIndex].bonus = entry.pinsHit;
          this.bonusCounter++;
        }
      }
    }
  };
</script>

<style scoped>
.flex-container {
  list-style-type: none;
  flex-direction: row;
  display: inline-flex;
  border: 1em #4abc41;
  border-style: inset;
  padding-right: 0px;
  padding-left: 0px;
  transform: scaleX(2);
}
.firstBall {
  color: black;
  background-color: mediumseagreen;
}
.secondBall {
  color: black;
  border-style: solid;
  border-left-width: 3px;
  border-bottom-width: 3px;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
}
.bonusBall {
  color: black;
  border-style: solid;
  border-bottom-width: 3px;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  padding-right: 3%;
}
.total {
  position: inherit;
  color: black;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
}
.scoreContainer {
  display: inline-table;
  background-color: mediumseagreen;
  border-style: solid;
}
</style>
<template>
  <div>
    <ul class="flex-container">
      <li v-for="index in 10" :key="index">
        <div class="scoreContainer" v-if="index < 10">
          <tr>
            <td class="firstBall">{{ schema[index - 1].first }}</td>
            <td class="secondBall">{{ schema[index - 1].second }}</td>
          </tr>
          <tr>
            <div class="total">{{ schema[index - 1].total }}</div>
          </tr>
        </div>
        <div class="scoreContainer" v-else>
          <tr>
            <td class="firstBall">{{ schema[index - 1].first }}</td>
            <td class="secondBall">{{ schema[index - 1].second }}</td>
            <td class="bonusBall">{{ schema[index - 1].bonus }}</td>
          </tr>
          <tr>
            <td class="total">{{ schema[index - 1].total }}</td>
          </tr>
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
      turn: 1,
      bonusCounter: 0,
      bonusMax: 0,
      extended: false,
      totalContainer: 0,
      latestStrikeIdx: 0,
      latestSpareIdx: 0,
      spareEval: false,
      strikeEval: false,
    };
  },
  created: function () {
    for (let i = 0; i < 9; i++) {
      this.schema[i] = {
        first: "0",
        second: "0",
        total: "0",
      };
      this.schema[9] = {
        first: "0",
        second: "0",
        bonus: "0",
        total: "0",
      };
    }
  },
  props: ["updateTrigger"],
  watch: {
    updateTrigger: function () {
      /*These functions make changes to an array- and for vue to react to 
      these changes, the array is changed using the wrapped array functions (splice in this case).*/
      this.assignNewEntry();
    },
  },
  methods: {
    assignNewEntry() {
      const entry = store.state.player.latestEntry;

      if (this.schemaIndex < 10) {
        this.handleRounds(entry);
      } else {
        this.handleBonus(entry);
      }
    },
    handleRounds(entry) {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 1) {
        if (entry.strike) {
          newSchemaObj.second = "X";
          this.schema.splice(this.schemaIndex, 1, newSchemaObj);
          this.schemaIndex++;
        } else {
          newSchemaObj.first = entry.pinsHit;
          this.schema.splice(this.schemaIndex, 1, newSchemaObj);
          this.turn++;
        }
      } else if (this.turn == 2) {
        if (entry.spare) {
          newSchemaObj.second = "/";
          this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        } else {
          newSchemaObj.second = entry.pinsHit;
          this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        }
        this.turn = 1;
        this.schemaIndex++;
      }
      this.updSchemaTotal();
    },
    handleBonus(entry) {
      if (this.bonusCounter <= this.bonusMax) {
        if (entry.strike) {
          this.handleStrikeBonus();
        } else if (entry.spare) {
          this.handleSpareBonus();
        } else {
          this.handleRegularBonus(entry);
        }
        this.turn++;
      }
    },
    handleStrikeBonus() {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 1) {
        newSchemaObj.first = "X";
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        this.bonusMax = 2;
        this.bonusCounter++;
        this.extended = true;
      } else if (this.turn == 2) {
        newSchemaObj.second = "X";
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        this.bonusCounter++;
      } else if (this.turn == 3) {
        newSchemaObj.bonus = "X";
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        this.bonusCounter++;
      }
    },
    handleSpareBonus() {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 2) {
        newSchemaObj.second = "/";
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        this.bonusMax = 1;
        this.bonusCounter++;
        this.extended = true;
      } else if (this.turn == 3) {
        newSchemaObj.bonus = "/";
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        this.bonusCounter++;
      }
    },
    handleRegularBonus(entry) {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 1) {
        newSchemaObj.first = entry.pinsHit;
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
      } else if (this.turn == 2) {
        newSchemaObj.second = entry.pinsHit;
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        if (!this.extended) {
          this.bonusMax = -1;
        }
      } else {
        /*For last bonus ball if not spare or strike*/
        newSchemaObj.bonus = entry.pinsHit;
        this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        this.bonusCounter++;
      }
    },
    updSchemaTotal() {
      this.totalContainer = store.state.totalScore;

      let entry = store.state.player.latestEntry;
      var history = store.state.player.entries;
      var updSchemaObj = {};
      const historySize = history.length;

      /*Regular update*/
      if (!entry.spare && !entry.strike && this.turn == 1) {
        console.log("schema Index: " + this.schemaIndex);
        updSchemaObj = this.schema[this.schemaIndex - 1];
        updSchemaObj.total = this.totalContainer;
        this.schema.splice(this.schemaIndex - 1, 1, updSchemaObj);
      }

      var useIndex = 0;
      /*Strike and Spare evaluation*/
      if (historySize >= 3) {
        /*Check if a strike score is to be displayed- find which*/
        if (history[historySize - 3].strike) {
          this.strikeEval = true;
          console.log("Strike chekup");
          for (let i = this.latestStrikeIdx; i < this.schema.length; i++) {
            if (this.schema[i].second == "X") {
              this.latestStrikeIdx = i + 1;
              break;
            }
          }
          useIndex = this.latestStrikeIdx - 1;
          updSchemaObj = this.schema[useIndex];
        }

        /*Check if a spare score is to be displayed- find which*/
        if (history[historySize - 2].spare) {
          this.spareEval = true;
          console.log("Spare eval");
          for (let i = this.latestSpareIdx; i < this.schema.length; i++) {
            if (this.schema[i].second == "/") {
              this.latestSpareIdx = i + 1;
              break;
            }
          }
          useIndex = this.latestSpareIdx - 1;
          updSchemaObj = this.schema[useIndex];
        }

        const ball1 = history[historySize - 2];
        const ball2 = history[historySize - 1];

        /*CHECK*/
        if (this.strikeEval) {
          console.log("strike");
          if (ball2.spare) {
            console.log("X V /");
            this.totalContainer -= ball1.pinsHit;
          } else if (!ball2.spare && !ball1.strike) {
            console.log("X V V");
            this.totalContainer -= ball1.pinsHit + ball2.pinsHit;
          }
          else if(!ball2.spare || !ball2.strike){
            console.log("X X V")
            this.totalContainer -= ball2.pinsHit; 
          }
           else {
            console.log("X X X");
          }
          this.strikeEval = false;
          updSchemaObj.total = this.totalContainer;
          this.schema.splice(useIndex, 1, updSchemaObj);
        } else if (this.spareEval) {
          console.log("spare");
          if (ball2.strike) {
            //Do nothing
            console.log("/ X")
          } else {
            console.log("/ V");
            this.totalContainer -= entry.pinsHit;
          }
          this.spareEval = false;
          updSchemaObj.total = this.totalContainer;
          this.schema.splice(useIndex, 1, updSchemaObj);
        }
      }
    },
  },
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
  display: table-cell;
}
.secondBall {
  color: black;
  border-style: solid;
  border-left-width: 3px;
  border-bottom-width: 3px;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  display: table-cell;
}
.bonusBall {
  color: black;
  border-style: solid;
  border-bottom-width: 3px;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  display: table-cell;
}
.total {
  position: inherit;
  color: black;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  display: table-cell;
}
.scoreContainer {
  display: inline-table;
  background-color: mediumseagreen;
  border-style: solid;
}
</style>
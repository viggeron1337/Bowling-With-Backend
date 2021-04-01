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
    <div>
      <ResetSchema @reset="onResetClickChild"></ResetSchema>
    </div>
  </div>
</template>

<script>
import store from "@/store/modules/scorerecords.js";
import ResetSchema from "@/components/ResetSchema.vue";
export default {
  name: "BowlingSchema",
  components: {
    ResetSchema
  },
  data() {
    return {
      schema: [],
      schemaIndex: 0,
      turn: 1,
      bonusCounter: 0,
      bonusMax: 0,
      noBonusOnFinal: false,
      extended: false,
      totalContainer: 0,
      latestStrikeIdx: 0,
      latestSpareIdx: 0,
      lastField: false,
      history: [],
      historySize: 0,
      updSchemaObj: {},
      totalTries: 0,
      currEntry: {},
      currPlayerID: 0,
      players: []
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
  },
  props: ["updateTrigger"],
  watch: {
    updateTrigger: {
      /*This function makes changes to an array- and for vue to react to 
      these changes, the array is changed using the wrapped array functions (splice in this case).*/
      deep: true,
      handler() {
        this.assignNewEntry();
      }
    }
  },
  methods: {
    assignNewEntry() {
      this.players = store.state.players;
      this.currPlayerID = store.state.playerID;
      const entry = this.players[this.currPlayerID].latestEntry;

      if (this.schemaIndex < 9) {
        this.handleRounds(entry);
        if (this.schemaIndex == 9) {
          this.lastField = true;
        }
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
        }
      } else if (this.turn == 2) {
        if (entry.spare) {
          newSchemaObj.second = "/";
          this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        } else {
          newSchemaObj.second = entry.pinsHit;
          this.schema.splice(this.schemaIndex, 1, newSchemaObj);
        }
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
        this.updSchemaTotal();
      }
    },
    handleStrikeBonus() {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 1) {
        newSchemaObj.first = "X";
        this.bonusMax = 2;
        this.extended = true;
      } else if (this.turn == 2) {
        newSchemaObj.second = "X";
      } else if (this.turn == 3) {
        newSchemaObj.bonus = "X";
      }
      this.schema.splice(this.schemaIndex, 1, newSchemaObj);
      this.bonusCounter++;
    },
    handleSpareBonus() {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 2) {
        newSchemaObj.second = "/";
        this.bonusMax = 1;
        this.extended = true;
      } else if (this.turn == 3) {
        newSchemaObj.bonus = "/";
      }
      this.schema.splice(this.schemaIndex, 1, newSchemaObj);
      this.bonusCounter++;
    },
    handleRegularBonus(entry) {
      var newSchemaObj = this.schema[this.schemaIndex];
      if (this.turn == 1) {
        newSchemaObj.first = entry.pinsHit;
      } else if (this.turn == 2) {
        newSchemaObj.second = entry.pinsHit;
        if (!this.extended) {
          this.bonusMax = -1;
          this.noBonusOnFinal = true;
        }
      } else {
        /*For last bonus ball if not spare or strike*/
        newSchemaObj.bonus = entry.pinsHit;
        this.bonusCounter++;
      }
      this.schema.splice(this.schemaIndex, 1, newSchemaObj);
    },
    updSchemaTotal() {
      /*Get the raw total score*/
      this.totalContainer = this.players[this.currPlayerID].totalScore;

      /*If this is the last turn in the last field, just use the 
      raw total score to display*/
      if (!this.checkLastTurn()) {
        this.currEntry = this.players[this.currPlayerID].latestEntry;

        /*Symbol explanations
      V - Value 
      / - Spare
      X - Strike
      */

        /*Regular update - after a round finishes (V V).*/
        this.regularEval();

        this.historySize = this.players[this.currPlayerID].entries.length;

        /*Strike and Spare evaluation can only happen on or after turn 3*/
        if (this.historySize >= 3) {
          this.strikeEval();
          this.spareEval();
        }
        /*Check if game should move on to next schema field
      and update current turn.*/
        this.checkReset();
      }
    },
    checkLastTurn() {
      if (this.lastField && this.turn == 3) {
        this.schema[this.schemaIndex].total = this.totalContainer;
        return true;
      }
      return false;
    },
    regularEval() {
      if (
        (!this.currEntry.spare &&
          !this.currEntry.strike &&
          this.turn == 2 &&
          !this.lastField) ||
        this
          .noBonusOnFinal /*<--- In case we have failed to get a bonus, we want to show 
        the final score on last fields turn 2*/
      ) {
        this.updSchemaObj = this.schema[this.schemaIndex];
        this.updSchemaObj.total = this.totalContainer;
        this.schema.splice(this.schemaIndex, 1, this.updSchemaObj);
      }
    },
    strikeEval() {
      this.history = this.players[this.currPlayerID].entries;
      /*Check if a strike score is to be displayed- find which*/
      if (this.history[this.historySize - 3].strike) {
        for (let i = this.latestStrikeIdx; i < this.schema.length; i++) {
          if (this.schema[i].second == "X") {
            this.latestStrikeIdx = i + 1;
            break;
          }
        }
        this.useIndex = this.latestStrikeIdx - 1;
        this.updSchemaObj = this.schema[this.useIndex];

        /*Since this.totalScoreContainer contains more score 
        than what is to be shown, we have to deduct the 
        excess score here...(Same for spare)*/

        /*Only remove the excess if we are not on the 
          extended bonus rounds - since those never add to the total untill
          all turns are done... (Same for spare)*/
        this.totalTries = this.players[this.currPlayerID].totalTries;
        if (this.totalTries <= 20) {
          const ball1 = this.history[this.historySize - 2];
          const ball2 = this.history[this.historySize - 1];

          /*X V V*/
          if (!ball1.strike && !ball2.spare) {
            this.totalContainer -= ball1.pinsHit + ball2.pinsHit;
          } else if (!ball1.strike && ball2.spare) {
            /*X V /*/
            this.totalContainer -= ball1.pinsHit;
          } else if (ball1.strike && !ball2.strike) {
            /*X X V*/
            this.totalContainer -= ball2.pinsHit;
          }
          /*X X X*/
        }
        this.updSchemaObj.total = this.totalContainer;
        this.schema.splice(this.useIndex, 1, this.updSchemaObj);
      }
    },
    spareEval() {
      this.history = this.players[this.currPlayerID].entries;
      /*Check if a spare score is to be displayed- find which*/
      if (this.history[this.historySize - 2].spare) {
        for (let i = this.latestSpareIdx; i < this.schema.length; i++) {
          if (this.schema[i].second == "/") {
            this.latestSpareIdx = i + 1;
            break;
          }
        }
        this.useIndex = this.latestSpareIdx - 1;
        this.updSchemaObj = this.schema[this.useIndex];

        this.totalTries = this.players[this.currPlayerID].totalTries;

        if (this.totalTries <= 20) {
          const ball1 = this.history[this.historySize - 1];
          /*/ V*/
          if (!ball1.strike) {
            this.totalContainer -= ball1.pinsHit;
          }
          /*/ X*/
        }

        this.updSchemaObj.total = this.totalContainer;
        this.schema.splice(this.useIndex, 1, this.updSchemaObj);
      }
    },
    checkReset() {
      /*If entry was a strike, reset turn to 1, 
      else go to next turn. (Prevent from resetting on last field)*/
      if (this.currEntry.strike && !this.lastField) {
        this.turn = 1;
        this.$store.dispatch("aNextPlayer");
      } else {
        this.turn++;
      }

      /*If turn is greater than 2 - reset turn 
      and go to the next field in the bowling schema. (Prevent from resetting on last field)*/
      if (this.turn > 2 && !this.lastField) {
        this.turn = 1;
        this.schemaIndex++;
        this.$store.dispatch("aNextPlayer");
      }
    },
    onResetClickChild() {
      /*Reset the schema visually*/
      this.resetSchemaItems();
      /*Reset the local data*/
      this.resetLocalData();
      /*Dispatch action to reset the state*/
      this.$store.dispatch("aResetState");
      /*emit event to reset the local data of AddScoreRecords component.*/
      this.$emit("reset");
    },
    resetSchemaItems() {
      for (let i = 0; i < this.schema.length; i++) {
        this.schema.splice(i, 1, {
          first: "0",
          second: "0",
          total: "0"
        });
        this.schema.splice(9, 1, {
          first: "0",
          second: "0",
          bonus: "0",
          total: "0"
        });
      }
    },
    resetLocalData() {
      this.schemaIndex = 0;
      this.turn = 1;
      this.bonusCounter = 0;
      this.bonusMax = 0;
      this.noBonusOnFinal = false;
      this.totalContainer = 0;
      this.latestStrikeIdx = 0;
      this.latestSpareIdx = 0;
      (this.history = []), (this.historySize = 0);
      this.updSchemaObj = {};
      this.extended = false;
      this.lastField = false;
      (this.currEntry = {}), (this.totalTries = 0);
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap");
.flex-container {
  position: relative;
  align-self: center;
  list-style-type: none;
  flex-direction: row;
  display: inline-flex;
  border: 1em #4abc41;
  border-style: inset;
  padding-left: 0px;
  transform-origin: center;
  transform: scaleX(2);
}
.firstBall {
  color: black;
  background-color: mediumseagreen;
  display: table-cell;
  font-family: "Teko", sans-serif;
}
.secondBall {
  color: black;
  border-style: solid;
  border-left-width: 3px;
  border-bottom-width: 3px;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  display: table-cell;
  font-family: "Teko", sans-serif;
}
.bonusBall {
  color: black;
  border-style: solid;
  border-bottom-width: 3px;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  display: table-cell;
  font-family: "Teko", sans-serif;
}
.total {
  position: inherit;
  color: black;
  border-block-color: rgba(0, 0, 0, 255);
  background-color: mediumseagreen;
  display: table-cell;
  font-family: "Teko", sans-serif;
}
.scoreContainer {
  display: inline-table;
  background-color: mediumseagreen;
  border-style: solid;
}
</style>
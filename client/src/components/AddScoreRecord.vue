<template>
  <div>
      <h2>Enter Turn Score</h2>
      <div class = "inputButtons">
      <button v-on:click="registerState(0)" type="button">0</button>
      <button v-on:click="registerState(1)" type="button">1</button>
      <button v-on:click="registerState(2)" type="button">2</button>
      <button v-on:click="registerState(3)" type="button">3</button>
      <button v-on:click="registerState(4)" type="button">4</button>
      <button v-on:click="registerState(5)" type="button">5</button>
      <button v-on:click="registerState(6)" type="button">6</button>
      <button v-on:click="registerState(7)" type="button">7</button>
      <button v-on:click="registerState(8)" type="button">8</button>
      <button v-on:click="registerState(9)" type="button">9</button>
       <button v-on:click="registerState(10)" type="button">10</button>
      </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'AddScoreRecord',
  methods: {
    ...mapActions(['updatePlayer','calculate']),
    registerState (value) {
      this.updatePlayer(value)
      this.calculate(value)
    }
  }
}
</script>

<style scoped>
h2{
  color: #DC143C;
  background: #FFE4B5;
  padding: 20px 57.5px;
  display: table-cell;
}

.inputButtons{
  float: left;
}
</style>

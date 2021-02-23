<template>
  <div>
      <h2>Enter Turn Score</h2>
      <div class = "inputButtons">
      <button v-on:click="registerScore(0)" type="button">0</button>
      <button v-on:click="registerScore(1)" type="button">1</button>
      <button v-on:click="registerScore(2)" type="button">2</button>
      <button v-on:click="registerScore(3)" type="button">3</button>
      <button v-on:click="registerScore(4)" type="button">4</button>
      <button v-on:click="registerScore(5)" type="button">5</button>
      <button v-on:click="registerScore(6)" type="button">6</button>
      <button v-on:click="registerScore(7)" type="button">7</button>
      <button v-on:click="registerScore(8)" type="button">8</button>
      <button v-on:click="registerScore(9)" type="button">9</button>
       <button v-on:click="registerScore(10)" type="button">10</button>
      </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'AddScoreRecord',
  methods: {
    ...mapActions(['addScore']),
    registerScore (value) {
      this.addScore(value)
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

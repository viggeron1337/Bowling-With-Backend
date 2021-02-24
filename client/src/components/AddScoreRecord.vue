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
        <TotalScoreComponent :totalScore="total">
        </TotalScoreComponent>
 </div>
</template>

<script>
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
import TotalScoreComponent from '../components/TotalScore.vue'

export default{
  name: 'AddScoreRecord',
  components:{
    TotalScoreComponent
  },
  /*data - container for the data belonging to this component:
  needs to be returned from a function so that every new
  instance of this component gets thier own versions.
  This differs from props not only because of the above, but also
  because these are items we want to keep track of.*/
  data(){
    return{
    }
  },
  /*methods - contains the methods of this component,
  allows for parameters as opposed to computed*/
  methods: {
    ...mapActions(['updatePlayer','calculate']),
    registerState (value) {
      this.updatePlayer(value)
      this.calculate(value)
    }
  },
  /*computed - properties does not get updated everytime we re-render -
  only when they have been affected*/
  computed: {
       ...mapGetters({
         total: 'getTotal',
       })
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

.total{
   font-family: 'Courier New', Courier, monospace;
  position:absolute;
  top: 270px;
  left: 10px;
  color: rgba(100, 10, 20, 255);
}
</style>

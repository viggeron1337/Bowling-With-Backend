<template>
<div>
<h2>Enter Turn Score</h2>
  <div>
    <ul>
      <li v-for="index in 11" :key="index">
        <button v-on:click="registerState(index - 1)" type="button">{{index - 1}}</button>
      </li>
    </ul>
  </div>
  <TotalScoreComponent 
  :totalScore="total">
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
  position: inherit;
  padding: 20px 57.5px;
  display: table-cell;
  background:rgb(42, 48, 53);
  color:rgb(65, 148, 107)
}

ul{
  position: relative;;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  left: -45px;
  top: -17px;
}

li{
  padding-left: 4.5px;
}
</style>

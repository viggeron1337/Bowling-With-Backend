<template>
  <span>
      <button id = "resetButton" v-on:click="resetSchema()" type="button">Reset</button>
  </span>
</template>

<script>
export default {
name: "ResetSchema", 
methods: {
    resetSchema(){
        this.$emit('reset')
    }
}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap');

#resetButton{
    position:relative;
    bottom: 7px;
    background-color: rgb(32, 117, 32);
    border-width: medium;
    border-radius: 25px;
    outline-color: black;
    font-family: 'Teko', sans-serif;
    transform: scale(1.3,1.3)
}
</style>
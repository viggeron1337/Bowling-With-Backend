<template functional>
  <span id = "total">
    <h1>Total Score: {{props.totalScore}}</h1>
  </span>
</template>

<script>
export default {
    name: 'TotalScore',
    props:{
        totalScore: 0
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap');
#total{
  font-family: 'Teko', sans-serif;
  position: relative;
  color: rgba(50, 70, 50, 255);
  background:rgba(144, 202, 144,155);
  transform: scale(1.5,1.5);
}
</style>
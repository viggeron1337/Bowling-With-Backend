<template functional>
  <div class = "total">
    <div>Total Score: {{props.totalScore}}</div>
  </div>
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
.total{
  font-family: 'Courier New', Courier, monospace;
  position: relative;
  top: 0px;
  left: 0px;
  color: rgba(50, 70, 50, 255);
  background:rgba(144, 202, 144,155);
}
</style>
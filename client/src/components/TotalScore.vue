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
  position:absolute;
  top: 270px;
  left: 10px;
  color: rgba(100, 10, 20, 255);
}
</style>
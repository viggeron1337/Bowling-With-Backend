<template>
<body>
  <div>
    <h2 class= "title">Bowling Calculator</h2>
        <AddScoreRecord></AddScoreRecord>
  </div>
</body>
</template>

<script>
import AddScoreRecord from '../components/AddScoreRecord.vue'
export default {
  name: 'Home',
  components: {
    AddScoreRecord
  }
}
</script>

<style scoped>
  .title{
     font-family: 'Courier New', Courier, monospace;
     background: rgba(50,70,88,255);
     color: rgba(70,150,50,255);
  }
</style>

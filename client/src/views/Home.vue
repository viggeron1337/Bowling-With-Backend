<template>
<body>
  <div class="welcome">
    <h2>Bowling Calculator</h2>
  </div>
    <div>
      <AddScoreRecord />
    </div>
</body>
</template>

<script>
// @ is an alias to /src
import AddScoreRecord from '../components/AddScoreRecord.vue'

export default {
  name: 'Home',
  components: {
    AddScoreRecord
  }
}
</script>

<style>
  body{
    background: #708090;
  }

  .welcome{
    font-family: 'Courier New', Courier, monospace;
    color:  #DC143C;
    background:#696969;
  }

</style>

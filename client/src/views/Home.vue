<template>
    <div class = "home">
          <h2 class="title">Bowling Calculator</h2>
          <AddScoreRecord></AddScoreRecord>
    </div>
</template>

<script>
import AddScoreRecord from "../components/AddScoreRecord.vue";
export default {
  name: "Home",
  components: {
    AddScoreRecord
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap');
.title {
  font-family: 'Teko', sans-serif;
  background: rgba(50, 70, 88, 255);
  color: rgba(70, 150, 50, 255);
  font-size: 50px;
}
</style>

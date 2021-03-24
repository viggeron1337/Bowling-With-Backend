<template>
  <html>
    <body meta name="viewport" content="width=device-width, initial-scale=1">
      <div id="app">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <router-view />
      </div>
    </body>
  </html>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: rgb(112, 167, 139);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #0e8f2a;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
}
</style>


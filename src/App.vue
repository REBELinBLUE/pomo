<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Timer</router-link> |
      <router-link to="/settings">Settings</router-link> |
      <router-link to="/history">History</router-link>
    </div>

    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  margin: auto;
  text-align: center;
  padding: 15px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

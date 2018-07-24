<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Timer</router-link> |
      <router-link to="/settings">Settings</router-link> |
      <router-link to="/history">History</router-link>
    </div>

    <div id="content">
      <router-view />
    </div>

  </div>
</template>

<style lang="scss">
body {
  background-color: #ffffff;
}

button {
  -webkit-app-region: no-drag;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  -webkit-app-region: drag;
  height: 40px;
  margin: auto;
  text-align: center;
  padding: 10px;
  background-color: rgb(30, 30, 30);
  width: 100%;
  position: fixed;
  top: 0px;
  z-index: 1000;
  color: #fff;

  a {
    font-weight: bold;
    color: #fff;
    -webkit-app-region: no-drag;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#content {
  clear: both;
  margin-top: 50px;
  margin-bottom: 25px;
}
</style>

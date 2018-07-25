<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Timer</router-link>
      <router-link to="/settings">Settings</router-link>
      <router-link to="/history">History</router-link>
    </div>

    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
  /*
.header-arrow {
  position: absolute;
  top: 2px;
  left: 50%;
  margin-left: -5px;
  height: 10px;
  width: 10px;
  transform: rotate(45deg);
  background-color: rgb(30, 30, 30);
}
*/

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
  z-index: 2000;
  color: #fff;
  -webkit-user-select: none;

  a {
    -webkit-app-region: no-drag !important;
    font-weight: bold;
    width: 33%;
    display: inline-block;
    color: #fff;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#content {
  margin: {
    top: 55px;
    right: 20px;
    bottom: 20px;
    left: 20px;
  }
}
</style>

<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" tag="button">Timer</router-link>
      <router-link to="/settings" tag="button">Settings</router-link>
      <router-link to="/history" tag="button">History</router-link>
    </div>

    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
body {
  background-color: #fff;
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
  background-color: rgb(30, 30, 30);
  width: 100%;
  position: fixed;
  top: 0px;
  z-index: 2000;
  color: #fff;
  -webkit-user-select: none;
  cursor: pointer;

  button {
    -webkit-appearance: none;
    box-shadow: none;
    border-radius: 0px;
    border: none;
    padding: 4px;
    -webkit-app-region: no-drag !important;
    width: 145px;
    height: 40px;
    background-color: rgb(30, 30, 30);
    display: inline-block;
    color: #fff;
    margin: 0;
    font-size: 92%;
    font-weight: bolder;
    cursor: pointer;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#content {
  margin: {
    top: 50px;
    right: 10px;
    bottom: 10px;
    left: 10px;
  }
}

:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

input, button, textarea, :focus {
  outline: none;
}
</style>

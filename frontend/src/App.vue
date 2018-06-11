<template>
  <div id="app">
    <v-app>
      <v-content>
        <Landing />
        <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Landing from '@/components/Landing'
export default {
  name: 'App',
  components: {
    Landing
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

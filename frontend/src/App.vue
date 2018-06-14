<template>
  <div id="app">
    <v-app>
      <main>
        <Toolbar />
        <router-view>
        </router-view>
        <Footer />
      </main>
    </v-app>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components: {
    Footer,
    Toolbar
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
  background-image: url('https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
  background-repeat: no-repeat;
  background-size: cover;
  /* background: radial-gradient(circle at top left, #263238, #607D8B, #ECEFF1, #90A4AE, #607D8B) */
}
h1 {
  color: #CFD8DC;
}
.cyan-gradient {
  background: radial-gradient(circle at top left, #006064, #0097A7, cyan, #0097A7, #90A4AE);
}
.pink-gradient {
  background: radial-gradient(circle at top left, #880E4F, #9C3F70, #D45699, #9C3F70, #880E4F)
}
</style>

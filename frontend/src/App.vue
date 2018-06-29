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
  },
  mounted () {
    let admin = this.$cookie.get('admin')
    if (admin) {
      this.$store.dispatch('setAdmin', JSON.parse(admin))
    }
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
hr {
  border: 0;
  width: 70%;
  margin: auto;
  border-top: 1px dashed #CFD8DC;
  padding-bottom: 5px;
}
h1 {
  color: #CFD8DC;
}
textarea {
  width: 100%;
  background-color: white;
}
.cyan-gradient {
  background: radial-gradient(circle at top left, #006064, #0097A7, cyan, #0097A7, #90A4AE);
}
.name {
  text-align: right;
  font-size: 20px;
  font-family: cursive;
  /* text-shadow: 2px 3px grey; */
}
.pink-gradient {
  background: radial-gradient(circle at top left, #880E4F, #9C3F70, #D45699, #9C3F70, #880E4F)
}
.tech-names {
  color: #CFD8DC;
}
.cancel, .save, .add {
  position: absolute;
}
.cancel {
  /* top: 89%; */
  bottom: 10px;
  left: 90%;
}
.save {
  /* top: 89%; */
  bottom: 10px;
  left: 95%;
}
.add {
  /* top: 89%; */
  bottom: 10px;
  left: 85%;
}
.profile-pic {
  position: fixed;
  top: 10vh;
  /* left: 1vw; */
  right: 0;
  z-index: 2;
  box-shadow: 0 0 15px 5px black;
  background: url('./assets/landing.svg');
}
.profile-pic:hover {
  transform: scale(1.025);
  transition-duration: 0.2s;
}
</style>

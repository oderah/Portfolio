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
  /* background-image: url('https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'); */
  background-repeat: no-repeat;
  background-size: cover;
  /* background: radial-gradient(circle at top left, #263238, #607D8B, #ECEFF1, #90A4AE, #607D8B) */
}
h1 {
  /* color: #CFD8DC; */
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
  right: 0;
  z-index: 2;
  box-shadow: 0 0 15px 5px black;
  background: url('./assets/landing.svg');
}
.profile-pic:hover {
  transform: scale(1.025);
  transition-duration: 0.2s;
}
p, h2 {
  text-align: left;
}
p {
  font-size: 1.2em;
}
/* .loading {
  position: absolute;
  top: 40vh;
  left: 45vw;
} */
.app-loading {
  font-weight: bold;
  animation-name: loading;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes loading {
  0% {transform: translateY(0px);}
  25% {transform: translateY(5px);}
  50% {transform: translateY(10px);}
  75% {transform: translateY(-10px);}
  100% {transform: translateY(-5px);}
}
.my-loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.thumbnail {
  width: 100px;
  height: 100px;
  overflow: visible;
  transition-duration: 0.2s;
  padding: 0 5px;
}
.thumbnail:hover {
  transform: scale(1.05);
  transition-duration: 0.2s;
}
.thumbnail img {
  width: 100%;
  height: 100%;
}
.project-card {
  border-radius: 5%;
  background: radial-gradient(circle at top left, #322, #880E4F);
}
/* h2 {
  font-size: 2em;
} */
/* xs */
@media only screen and (max-width: 600px) {
  .profile-pic {
    transform: scale(0.6);
    right: -6.5vw;
  }
}
/* sm */
@media only screen and (max-width: 960px) and (min-width: 601px) {
  .profile-pic {
    transform: scale(0.8);
    right: -2vw;
  }
}
/* md */
@media only screen and (max-width: 1264px) and (min-width: 961px) {
  .profile-pic {
    transform: scale(0.9);
    right: -1vw;
  }
}
</style>

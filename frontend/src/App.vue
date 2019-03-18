<template>
  <div id="app">
    <v-app>
      <main>
        <Toolbar />
        <ProfileAvatar />
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
import ProfileAvatar from '@/components/ProfileAvatar'

export default {
  name: 'App',
  components: {
    Footer,
    Toolbar,
    ProfileAvatar
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
  background-image: url('https://www.insidescience.org/sites/default/files/5_heic1808a_crop.jpg');
  /* background-image: url('https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'); */
  background-repeat: no-repeat;
  background-size: cover;
  /* background: radial-gradient(circle at top left, #263238, #607D8B, #ECEFF1, #90A4AE, #607D8B) */
  /* background: radial-gradient(ellipse at top left, grey,  #880E4F, #D45699); */
  /* background: radial-gradient(circle at top left,#000, #006064, #0097A7, cyan, #0097A7, #90A4AE, #000); */
  /* background: linear-gradient(to bottom, #222, #393C40, #72797F, #393C40, #222); */
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
/* .cancel, .save, .add {
  position: absolute;
}
.cancel {
  bottom: 10px;
  left: 90%;
}
.save {
  bottom: 10px;
  left: 95%;
} */
.profile-admin-buttons {
  position: relative;
  bottom: 0;
  left: calc(100% - 40px);
}
.profile-admin-buttons-edit {
  position: relative;
  bottom: 0;
  left: calc(100% - 80px);
}
.add {
  position: absolute;
  bottom: 35px;
  left: 15px;
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
  background: radial-gradient(circle at top left, #322, #880E4F, #D4167B, #322);
}
.flex-lg8 {
  margin: 0 auto;
}
textarea {
  background-color: #585858;
  /* background-color: gre; */
}
.abouts-enter-active, .abouts-leave-active {
  transition-duration: 0.5s ease-out;
}
.abouts-enter, .abouts-leave-to {
  transform: translateX(200%);
}
.abouts-edit {
  animation: slide 0.5s ease-in-out 0s 1;
}
.abouts-edit-reverse {
  animation: slide-out 0.5s;
}
.contacts-edit {
  animation: slide-in 1s;
}
.left-slide {
  animation: left-slide-in 1s;
}
.right-slide {
  animation: right-slide-in 1s;
}
.right-slide-reverse {
  animation: right-slide-out 0.5s;
}
.left-slide-reverse {
  animation: left-slide-out 0.5s;
}
@keyframes slide-in {
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100vh);
  }
}
@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  30% {
    transform: translateX(50%);
  }
  60% {
    transform: translateX(0);
  }
  80% {
    transform: translateX(2%);
  }
  100% {
    transform: translateX(0);
  }
}
/* @-webkit-keyframes slide {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(0%);
  }
} */
@keyframes right-slide-in {
  from {
    transform: translateX(100vw);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes right-slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100vw);
  }
}
@keyframes left-slide-in {
  from {
    transform: translateX(-100vw);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes left-slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100vw);
  }
}
</style>

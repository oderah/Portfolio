<template>
  <v-container fluid>
    <v-layout class="jumbotron" row>
      <!-- Left -->
      <v-flex class="left" xs3>
        <img :src="require('../assets/landing.svg')">
      </v-flex>
      <!-- Right -->
      <v-flex class="padded" xs9>
        <v-container class="right">
          <!-- Recent Projects -->
          <RecentProjects />
          <v-btn dark>
            View More
          </v-btn>
          <v-layout>
            <v-avatar
              class="one drip"
              color="black"
              size="20px">
            </v-avatar>
            <v-avatar
              class="two drip"
              size="20px">
            </v-avatar>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RecentProjects from './RecentProjects'
export default {
  components: {
    RecentProjects
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  img {
    height: 80vh;
    transform: translate(-220px, 50px) scale(1.5);
  }
  .drip {
    position: relative;
  }
  .jumbotron {
    box-shadow: -5px 2px 20px 0;
    margin-top: 15px;
    background-attachment: fixed;
  }
  .left {
    overflow: hidden;
    background: radial-gradient(circle at top left, #000, #880E4F)
  }
  .one {
    /* top: 91%;
    left: 65%; */
    bottom: 5px;
    right: 5px;
  }
  .padded {
    padding: 5px;
    /* background: linear-gradient(to right, #880E4F, #000, #880E4F); */
  }
  .right {
    background: radial-gradient(circle at top left, #006064, #0097A7, cyan, #0097A7, #90A4AE);
    /* background: radial-gradient(circle at top left, #263238, #607D8B, #90A4AE, #607D8B); */
    height: 100%;
  }
  .two {
    /* top: 91%;
    left: 85%; */
    bottom: -5px;
    right: -5px;
    background-color: #680E40;
  }
</style>

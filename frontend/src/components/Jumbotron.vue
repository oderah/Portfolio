<template>
  <v-container fluid>
    <!-- Profile Pic -->
    <v-avatar
      size="150px"
      class="white profile-pic">
    </v-avatar>
    <v-layout class="jumbotron" row>
      <!-- Left -->
      <v-flex class="left" sm6 md4>
        <img :src="require('../assets/landing.svg')">
      </v-flex>
      <!-- Right -->
      <v-flex class="padded" sm6 md8>
        <v-container class="right">
          <!-- Recent Projects -->
          <RecentProjects class="recents" />
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
        <!-- view more -->
        <v-btn dark round class="jumbotron-view-more" @click="goPortfolio">
          View More
        </v-btn>
      </v-flex>
    </v-layout>
    <br />
  </v-container>
</template>

<script>
import RecentProjects from './RecentProjects'
export default {
  components: {
    RecentProjects
  },
  methods: {
    goPortfolio () {
      this.$router.push({path: '/portfolio'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  img {
    height: 110%;
    width: auto;
    transform: translate(-30%, 5%) scale(1.3);
  }
  .drip {
    position: relative;
  }
  .jumbotron {
    box-shadow: -5px 2px 20px 0;
    margin-top: 15px;
    background-attachment: fixed;
    height: 85vh;
    overflow: hidden;
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
    overflow: hidden;
  }
  .two {
    bottom: -5px;
    right: -5px;
    background-color: #680E40;
  }
  .recents {
    height: 95%;
    overflow-y: scroll;
    overflow-x: hidden;
    -ms-overflow-style: none; /* hide scrollbar for IE */
    scrollbar-width: none; /* hide scrollbar for firefox */
  }
  /* hide scrollbar for chrome and safari */
  ::-webkit-scrollbar{
    width: 0px;
    background: transparent;
  }
  .jumbotron-view-more {
    position: relative;
    bottom: 7vh;
  }
  /* sm */
  @media only screen and (max-width: 600px){
    .left {
      display: none;
    }
  }
</style>

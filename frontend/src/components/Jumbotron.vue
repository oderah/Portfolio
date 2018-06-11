<template>
  <v-container>
    <v-layout class="jumbotron" row>
      <!-- Left -->
      <v-flex class="left" xs3>
        <img :src="require('../assets/landing.svg')">
      </v-flex>
      <!-- Right -->
      <v-flex class="padded" xs9>
        <v-container class="right">
          <h1>JUMBO</h1>
          <v-layout grid>
            <v-avatar
              class="one drip"
              color="black"
              size="20px">
            </v-avatar>
            <v-avatar
              class="two drip pink darken-4"
              color=""
              size="20px">
            </v-avatar>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <div class="gradient"></div>
  </v-container>
</template>

<script>
export default {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .jumbotron {
    box-shadow: -5px 2px 20px 0;
  }
  img {
    height: 80vh;
    transform: translateX(-220px) scale(1.2);
  }
  .left {
    overflow: hidden;
    background: radial-gradient(circle at top left, #000, #880E4F)
  }
  .right {
    background: radial-gradient(circle at top left, #880E4F, #D4167B, #D45699);
    height: 100%;
  }
  .gradient {
    position: absolute;
    top: 2vh;
    left: 10vw;
    background-color: black;
    width: 80vw;
    height: 81vh;
    opacity: 0.3;
  }
  .drip {
    position: absolute;
  }
  .padded {
    padding: 5px;
    background: linear-gradient(to right, #880E4F, #000, #880E4F);
    box-shadow: -5px 2px 20px 0 #880e4f;
  }
  .one {
    top: 80vh;
    left: 65vw;
  }
  .two {
    top: 80vh;
    left: 85vw;
  }
</style>

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
          <h1>JUMBO</h1>
          <v-layout grid>
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
export default {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  img {
    height: 80vh;
    transform: translateX(-220px) scale(1.5);
  }
  .drip {
    position: absolute;
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
    top: 80vh;
    left: 65vw;
  }
  .padded {
    padding: 5px;
    background: linear-gradient(to right, #880E4F, #000, #880E4F);
  }
  .right {
    /* background: radial-gradient(circle at top left, #880E4F, #D4167B, #D45699); */
    background: radial-gradient(circle at top left, #006064, #0097A7
, cyan, #FFF);
    height: 100%;
  }
  .two {
    top: 80vh;
    left: 85vw;
    background-color: #680E40;
  }
</style>

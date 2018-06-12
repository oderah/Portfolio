<template>
  <v-card class="panel">
    <v-card-title class="pink darken-4">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text>
      <slot name="text"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .panel {
    padding: 10px;
    box-shadow: 0 2px 20px 5px;
  }
</style>

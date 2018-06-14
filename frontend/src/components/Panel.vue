<template>
  <v-card class="panel">
    <v-card-title :class="_class">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text>
      <slot name="text"></slot>
    </v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    _class: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .panel {
    /* padding: 10px; */
    box-shadow: 0 2px 20px 5px;
  }
</style>

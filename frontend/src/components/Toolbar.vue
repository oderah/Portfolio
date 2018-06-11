<template>
  <v-toolbar fixed app dark>
      <v-toolbar-title>
        <v-btn flat fab @click="goHome">
          <v-avatar
            class="title cyan"
            size="50px">
            {{avatar}}
          </v-avatar>
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat>About</v-btn>
        <v-btn flat>Portfolio</v-btn>
        <v-btn flat>Contact</v-btn>
      </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  data () {
    return {
      avatar: 'Ody'
    }
  },
  methods: {
    goHome () {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

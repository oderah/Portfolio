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
        <v-btn flat @click="goAbout">About</v-btn>
        <v-btn flat>Portfolio</v-btn>
        <v-btn flat>Contact</v-btn>
        <v-menu v-if="this.$store.state.admin">
          <v-btn flat slot="activator">
            <v-avatar
              class="title cyan"
              size="40px">
              <v-icon size="30px">verified_user</v-icon>
            </v-avatar>
          </v-btn>
        </v-menu>
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
    },
    goAbout () {
      this.$router.push({path: '/about'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
  <v-footer absolute app dark class="pa-3">
    <v-btn
      flat
      @click="gotoAdmin">
      Admin
    </v-btn>
    <v-spacer></v-spacer>
    <div>&copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>

<script>
export default {
  methods: {
    gotoAdmin () {
      this.$router.push('/admin/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

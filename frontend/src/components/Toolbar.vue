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
        <v-btn flat @click="goContact">Contact</v-btn>
        <v-menu dark fixed open-on-hover offset-y v-if="this.$store.state.admin">
          <v-btn flat slot="activator">
            <v-avatar
              class="title cyan"
              size="40px">
              <v-icon size="30px">verified_user</v-icon>
            </v-avatar>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(menu, index) in menuItems" :key="index" @click="menuItem(index)">
              <v-list-tile-title>{{menu.menu}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  data () {
    return {
      avatar: 'Ody',
      menuItems: [{menu: 'logout'}]
    }
  },
  methods: {
    goHome () {
      this.$router.push({path: '/'})
    },
    goAbout () {
      this.$router.push({path: '/about'})
    },
    goContact () {
      this.$router.push({path: '/contact'})
    },
    menuItem (index) {
      switch (index) {
        case 0:
          this.logout()
          break
        default:
      }
    },
    logout () {
      console.log('Toolbar logout')
      this.$cookie.delete('admin')
      this.$store.dispatch('setAdmin', null)
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

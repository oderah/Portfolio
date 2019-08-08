<template>
  <v-toolbar fixed app dark>
    <v-toolbar-title>
      <v-btn flat fab @click="goHome" class="title name home">
        {{avatar}}
      </v-btn>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items class="hidden-xs-only">
      <v-btn xs1 md2 lg3 flat @click="goAbout">About</v-btn>
      <v-btn flat @click="goPortfolio">Portfolio</v-btn>
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
    <v-toolbar-items class="hidden-sm-and-up">
      <v-menu dark fixed offset-y>
        <v-btn flat slot="activator">
          <v-avatar>
            <v-icon size="30px">menu</v-icon>
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile @click="goAbout">
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="goPortfolio">
            <v-list-tile-title>Portfolio</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="goContact">
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile>
          <!-- admin options -->
          <v-list-tile v-for="(menu, index) in menuItems" :key="index" @click="menuItem(index)" v-if="$store.state.admin">
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
    goPortfolio () {
      this.$router.push({path: '/portfolio'})
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

      // show goodbye toast
      this.$toasted.show(`<i class="material-icons">tag_faces</i> Bye ${this.$store.state.admin.username}`, this.$store.state.successToast)

      this.$store.dispatch('setAdmin', null)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    font-weight: bold;
  }
</style>

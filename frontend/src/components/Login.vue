<template>
  <div>
    <v-container class="contacts-edit" id="container">
      <v-flex lg4 md6 sm6 class="flex-lg8">
        <Panel _class="pink darken-4" class="grey darken-4">
          <div slot="title">
            <h1>Admin</h1>
          </div>
          <v-form slot="text">
            <v-text-field
              v-model="email"
              label="E-mail"
              required
              solo
              autocomplete="off"
              autofocus dark>
            </v-text-field>
            <br />
            <v-text-field
              v-model="password"
              type="password"
              label="password"
              required
              solo
              autocomplete="off"
              dark
              @keyup.enter.native="login">
            </v-text-field>
            <br />
            <v-btn
              dark
              round
              class="pink darken-4"
              @click="login">
              Login
            </v-btn>
          </v-form>
        </Panel>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import Panel from '@/components/Panel'
export default {
  data () {
    return {
      email: '',
      password: '',
      from: ''
    }
  },
  components: {
    Panel
  },
  beforeRouteLeave (to, from, next) {
    let container = document.getElementById('container')

    if (container) {
      container.classList.remove('contacts-edit')
      container.classList.add('abouts-edit-reverse')
    }

    setTimeout(() => {
      next()
    }, 500)
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })

        if (response.data) {
          let admin = {
            email: response.data.admin.email,
            username: response.data.admin.username
          }
          this.$store.dispatch('setAdmin', admin)

          this.$cookie.set('admin', JSON.stringify(admin), {expires: 7})

          // show log in success toast
          this.$toasted.show(`<i class="material-icons">tag_faces</i> Signed in as ${admin.username}`, this.$store.state.successToast)

          this.$router.push({path: this.from})
        } else {
          // show log in failure toast
          this.$toasted.show('Invalid Credentials!!', this.$store.state.errorToast)
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => (vm.from = from.path)) // store from path
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
  <div>
    <v-container>
      <v-flex>
        <Panel _class="pink darken-4">
          <div slot="title">
            <h1>Admin</h1>
          </div>
          <v-form slot="text">
            <v-text-field
              v-model="email"
              label="E-mail"
              required
              autofocus>
            </v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="password"
              required
              @keyup.enter.native="login">
            </v-text-field>
            <v-btn
              dark
              class="pink darken-4"
              @click="login"
            >
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
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        console.log('login response', response)
        // this.admin['username'] = response.data.username
        // this.admin['email'] = response.data.email
        // this.admin = response.data

        if (response.data) {
          let admin = {
            email: response.data.admin.email,
            username: response.data.admin.username
          }
          this.$store.dispatch('setAdmin', admin)

          this.$cookie.set('admin', JSON.stringify(admin), {expires: 7})

          // show log in success toast
          this.$toasted.show(`Signed in as ${admin.username} :)`, {
            duration: 3000,
            position: 'bottom-right',
            closeOnSwipe: true,
            theme: 'bubble',
            className: 'cyan'
          })

          this.$router.push({path: this.from})
        } else {
          // show log in failure toast
          this.$toasted.show('Invalid Credentials!!', {
            duration: 3000,
            position: 'bottom-right',
            closeOnSwipe: true,
            theme: 'bubble',
            className: 'pink darken-4'
          })
        }
      } catch (err) {
        console.log(err)
      }

      console.log(this.$store.state.admin)
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

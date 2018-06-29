<template>
  <div>
    <v-container>
      <v-flex xs6 offset-xs3>
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
              required>
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
      password: ''
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
        // this.admin['username'] = response.data.username
        // this.admin['email'] = response.data.email
        // this.admin = response.data

        let admin = {
          email: response.data.admin.email,
          username: response.data.admin.username
        }
        this.$store.dispatch('setAdmin', admin)

        this.$cookie.set('admin', JSON.stringify(admin), {expires: 7})

        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }

      console.log(this.$store.state.admin)
    }
  },
  mounted () {
    window.scrollTo(0, 0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

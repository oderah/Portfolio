<template>
  <div>
    <v-container>
      <h1>login</h1>
      <v-form>
        <v-text-field
          v-model="admin.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
        v-model="password"
        type="password"
        label="password"
        required
      ></v-text-field>
      </v-form>
      <v-btn
        @click="login"
      >
        Login
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      admin: {username: '', email: ''},
      password: ''
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          username: this.admin.username,
          password: this.password
        })
        // this.admin['username'] = response.data.username
        // this.admin['email'] = response.data.email
        this.admin = response.data
      } catch (err) {
        console.log(err)
      }

      console.log(this.admin)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

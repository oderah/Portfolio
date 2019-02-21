<template>
  <v-container>
    <!-- Profile Pic -->
    <v-avatar
      size="150px"
      class="white profile-pic">
      Pic
    </v-avatar>
    <br >
    <!-- Name -->
    <Name :profile="profile" @update="reloadProfile"/>
    <br >
    <!-- Education -->
    <Education :profile="profile" @update="reloadProfile"/>
    <br >
    <!-- Skills -->
    <Skills :profile="profile" @update="reloadProfile"/>
    <br >
    <!-- Technologies -->
    <Technologies :profile="profile" @update="reloadProfile"/>
    <br >
    <!-- About -->
    <v-flex xs12>
      <Panel>
        <v-container slot="title">
          <h2 class="name">A little about Me</h2>
        </v-container>
        <v-layout column wrap slot="text" v-if="!edit">
          <v-flex xs10 v-for="about in profile.abouts" :key="about.id">
            <v-container>
              <p>{{about.paragraph}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </v-container>
          </v-flex>
        </v-layout>
        <v-container slot="text" v-if="edit">
          <textarea rows="10" v-model="abouts">
          </textarea>
        </v-container>
        <v-layout row slot="actions" v-if="this.$store.state.admin">
          <!-- Edit button -->
          <v-btn class="save" fab small dark @click="editText" v-if="!edit">
            <v-icon size="20px">edit</v-icon>
          </v-btn>
          <!-- Cancel button -->
          <v-btn class="cancel" fab small dark color="pink" @click="done" v-if="edit">
            <v-icon size="20px">cancel</v-icon>
          </v-btn>
          <!-- Save button -->
          <v-btn class="save" fab small dark color="cyan" @click="saveText" v-if="edit">
            <v-icon size="20px">save</v-icon>
          </v-btn>
        </v-layout>
      </Panel>
    </v-flex>
    <br >
    <br >
    <br >
  </v-container>
</template>

<script>
import ProfileService from '@/services/ProfileService'
import Panel from '@/components/Panel'
import Name from './Name'
import Education from './Education'
import Skills from './Skills'
import Technologies from './Technologies'
export default {
  data () {
    return {
      profile: {},
      abouts: '',
      edit: false
    }
  },
  async mounted () {
    this.reloadProfile()
    window.scrollTo(0, 0)
  },
  components: {
    Panel, Name, Education, Skills, Technologies
  },
  methods: {
    async reloadProfile () {
      this.profile = (await this.getProfile()).data.profile
      console.log('reloadProfile, profile: ', this.profile)
    },
    async getProfile () {
      console.log('getProfile')
      const profile = await ProfileService.getProfile()
      return profile
    },
    async update (abouts) {
      const response = await ProfileService.setProfile({abouts: abouts})
      if (response.data.msg === true) {
        this.reloadProfile()
      }
      return response
    },
    editText () {
      this.profile.abouts.forEach(about => {
        this.abouts += about.paragraph + '\n\n'
      })
      this.edit = true
    },
    async saveText () {
      const newAbouts = this.abouts.trim().split('\n\n')
      let payload = []
      newAbouts.forEach(about => {
        payload.push({'paragraph': about})
      })
      const response = await this.update(payload)
      console.log(response)
      this.done()
    },
    done () {
      this.abouts = ''
      this.edit = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tech {
    /* background: linear-gradient(to right, #880E4F, #9C3F70, #D45699, #9C3F70); */
    background: radial-gradient(circle at top left, #880E4F, #9C3F70, #D45699)
  }
  .text {
    box-shadow: 0 -5px 20px 0;
  }
</style>

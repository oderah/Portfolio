<template>
  <v-flex xs12 lg10 class="flex-lg8">
    <Panel class="pink-gradient">
      <v-container slot="title">
        <h2 class="name tech-names">Skills</h2>
      </v-container>
      <v-layout row wrap slot="text" v-if="!edit">
        <v-flex xs6 sm2 v-for="skill in profile.skills" :key="skill.id">
          <v-container class="skill-container">
            <span class="tech-names skill">{{skill.skill}}</span>
          </v-container>
        </v-flex>
      </v-layout>
      <v-container slot="text" v-if="edit">
        <v-text-field v-model="skills" solo>
        </v-text-field>
      </v-container>
      <v-container slot="actions" v-if="this.$store.state.admin">
        <v-layout row class="profile-admin-buttons">
          <!-- Edit button -->
          <v-btn fab small @click="editSkills" v-if="!edit">
            <v-icon size="20px">edit</v-icon>
          </v-btn>
        </v-layout>
        <v-layout row class="profile-admin-buttons-edit">
          <!-- Cancel button -->
          <v-btn fab small dark color="pink" @click="done" v-if="edit">
            <v-icon size="20px">cancel</v-icon>
          </v-btn>
          <!-- Save button -->
          <v-btn fab small dark color="cyan" @click="saveSkills" v-if="edit">
            <v-icon size="20px">save</v-icon>
          </v-btn>
        </v-layout>
      </v-container>
    </Panel>
  </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
export default {
  data () {
    return {
      skills: '',
      edit: false
    }
  },
  components: {
    Panel
  },
  props: {
    profile: Object
  },
  methods: {
    editSkills () {
      console.log('editSkills')
      this.profile.skills.forEach(skill => {
        this.skills += skill.skill + ', '
      })
      this.skills = this.skills.substring(0, this.skills.length - 2)
      console.log(this.skills)
      this.edit = true
    },
    async update (skills) {
      const response = await ProfileService.setProfile({skills: skills})
      if (response.data.msg === true) {
        setTimeout(async () => {
          await this.$emit('update')
        }, 100)
        this.done()
      }
      return response
    },
    async saveSkills () {
      const newSkills = this.skills.trim().split(', ')
      let payload = []
      newSkills.forEach(skill => {
        payload.push({'skill': skill})
      })

      const response = await this.update(payload)
      console.log('response savSkills : ', response)
    },
    done () {
      this.skills = ''
      this.edit = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .skill {
    font-weight: lighter;
    font-size: 16px;
    margin: 2px;
    padding: 5px;
    text-shadow: 2px 3px black;
  }
  .skill-container {
    margin-right: 2px;
    padding: 2px;
  }
</style>

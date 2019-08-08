<template>
  <v-flex>
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
        <transition name="abouts">
          <v-text-field v-model="skills" solo class="abouts-edit">
          </v-text-field>
        </transition>
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
      this.edit = true
    },
    update (skills) {
      // show uploading skills toast
      this.$toasted.show(`Uploading skills...`, this.$store.state.toast)

      ProfileService.setProfile({skills: skills}).then(response => {
        if (response.data.msg === true) {
          setTimeout(async () => {
            await this.$emit('update')
            // show updated titles toast
            this.$toasted.show(`Updated skills`, this.$store.state.successToast)
            this.done()
          }, 1000)
        }
      }).catch(err => {
        // show error toast
        this.$toasted.show(`Oops something went wrong`, this.$store.state.errorToast)
        console.log(err)
      })
    },
    async saveSkills () {
      const newSkills = this.skills.trim().split(', ')
      let payload = []
      newSkills.forEach(skill => {
        payload.push({'skill': skill})
      })

      await this.update(payload)
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

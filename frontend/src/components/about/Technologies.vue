<template>
  <v-flex>
    <Panel class="header">
      <v-container slot="title">
        <h2 class="name tech-names">Technologies</h2>
      </v-container>
      <v-layout row wrap slot="text" v-if="!edit">
        <v-flex xs6 sm2 v-for="tech in profile.techs" :key="tech.id">
          <v-container class="tech-names">
            <h3>{{tech.tech}}</h3>
          </v-container>
        </v-flex>
      </v-layout>
      <v-container slot="text" v-if="edit">
        <transition name="abouts">
          <v-text-field
          solo
          v-model="techs"
          hint="Enter technologies"
          class="abouts-edit">
          </v-text-field>
        </transition>
      </v-container>
      <v-container slot="actions" v-if="this.$store.state.admin" >
        <v-layout row class="profile-admin-buttons">
          <!-- Edit button -->
          <v-btn fab small @click="editTechs" v-if="!edit">
            <v-icon size="20px">edit</v-icon>
          </v-btn>
        </v-layout>
        <v-layout row class="profile-admin-buttons-edit">
          <!-- Cancel button -->
          <v-btn fab small dark color="pink" @click="done" v-if="edit">
            <v-icon size="20px">cancel</v-icon>
          </v-btn>
          <!-- Save button -->
          <v-btn fab small dark color="cyan" @click="saveTechs" v-if="edit">
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
      techs: '',
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
    editTechs () {
      this.profile.techs.forEach(tech => {
        this.techs += tech.tech + ', '
      })
      this.techs = this.techs.substring(0, this.techs.length - 2)
      this.edit = true
    },
    update (techs) {
      // show uploading techs toast
      this.$toasted.show(`Uploading techs...`, this.$store.state.toast)

      ProfileService.setProfile({techs: techs}).then(response => {
        if (response.data.msg === true) {
          setTimeout(async () => {
            await this.$emit('update')
            // show updated techs toast
            this.$toasted.show(`Updated techs`, this.$store.state.successToast)
            this.done()
          }, 1000)
        }
      }).catch(err => {
        // show error toast
        this.$toasted.show(`Oops something went wrong`, this.$store.state.errorToast)
        console.log(err)
      })
    },
    async saveTechs () {
      const newTechs = this.techs.trim().split(', ')
      let payload = []
      newTechs.forEach(tech => {
        payload.push({'tech': tech})
      })

      await this.update(payload)
    },
    done () {
      this.techs = ''
      this.edit = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    background-color: #212121
  }
</style>

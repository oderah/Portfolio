<template>
  <v-flex xs12>
    <Panel class="header">
      <v-container slot="title">
        <h2 class="name tech-names">Technologies</h2>
      </v-container>
      <v-layout row wrap slot="text" v-if="!edit">
        <v-flex xs1 v-for="tech in profile.techs" :key="tech.id">
          <v-container class="tech-names">
            <h3>{{tech.tech}}</h3>
          </v-container>
        </v-flex>
      </v-layout>
      <v-container slot="text" v-if="edit">
        <textarea rows="2" v-model="techs">
        </textarea>
      </v-container>
      <v-layout row slot="actions" v-if="this.$store.state.admin">
        <!-- Edit button -->
        <v-flex xs1 offset-xs11>
          <v-btn fab small @click="editTechs" v-if="!edit">
            <v-icon size="20px">edit</v-icon>
          </v-btn>
        </v-flex>
        <!-- Cancel button -->
        <v-flex xs1>
          <v-btn fab small dark color="pink" @click="done" v-if="edit">
            <v-icon size="20px">cancel</v-icon>
          </v-btn>
        </v-flex>
        <!-- Save button -->
        <v-flex xs1>
          <v-btn fab small dark color="cyan" @click="saveTechs" v-if="edit">
            <v-icon size="20px">save</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
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
      console.log(this.techs)
      this.edit = true
    },
    async update (techs) {
      const response = await ProfileService.setProfile({techs: techs})
      if (response.data.msg === true) {
        setTimeout(async () => {
          await this.$emit('update')
        }, 100)
        this.done()
      }
      return response
    },
    async saveTechs () {
      const newTechs = this.techs.trim().split(', ')
      let payload = []
      newTechs.forEach(tech => {
        payload.push({'tech': tech})
      })

      const response = await this.update(payload)
      console.log('response savTechs : ', response)
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

<template>
  <v-flex>
    <!-- <Panel _class="pink-gradient tech"> -->
    <Panel class="header">
      <v-container slot="title" class="name">
        <h1 class="tech-names">{{profile.firstName}} {{profile.lastName}}</h1>
      </v-container>
      <v-container slot="text" v-if="!edit" >
        <v-layout row wrap class="tech-names">
          <v-flex xs12 sm2 class="title" v-for="title in profile.titles" :key="title.id">
            <!-- <hr > -->
            <span>{{title.title}}</span>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container slot="text" v-if="edit">
        <transition name="abouts">
          <v-text-field v-model="titles" solo hint="Enter titles" class="abouts-edit">
          </v-text-field>
        </transition>
      </v-container>
      <v-container slot="actions" v-if="this.$store.state.admin">
        <v-layout row class="profile-admin-buttons">
          <!-- Edit button -->
          <v-btn fab small @click="editTitles" v-if="!edit">
            <v-icon size="20px">edit</v-icon>
          </v-btn>
        </v-layout>
        <v-layout row class="profile-admin-buttons-edit">
          <!-- Cancel button -->
          <v-btn fab small dark color="pink" @click="done" v-if="edit">
            <v-icon size="20px">cancel</v-icon>
          </v-btn>
          <!-- Save button -->
          <v-btn fab small dark color="cyan" @click="saveTitles" v-if="edit">
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
      titles: '',
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
    editTitles () {
      this.profile.titles.forEach(title => {
        this.titles += title.title + ', '
      })
      this.titles = this.titles.substring(0, this.titles.length - 2)
      console.log(this.titles)
      this.edit = true
    },
    async update (titles) {
      const response = await ProfileService.setProfile({titles: titles})
      if (response.data.msg === true) {
        setTimeout(async () => {
          await this.$emit('update')
        }, 100)
        this.done()
      }
      return response
    },
    async saveTitles () {
      const newTitles = this.titles.trim().split(', ')
      let payload = []
      newTitles.forEach(title => {
        payload.push({'title': title})
      })

      const response = await this.update(payload)
      console.log('response savTitles : ', response)
    },
    done () {
      this.titles = ''
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
  .title {
    font-weight: lighter;
    margin: 2px;
    padding: 5px;
  }
</style>

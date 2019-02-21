<template>
  <v-flex xs12>
    <!-- <Panel _class="pink-gradient tech"> -->
    <Panel class="header">
      <v-container slot="title" class="name">
        <h1 class="tech-names">{{profile.firstName}} {{profile.lastName}}</h1>
      </v-container>
      <v-container slot="text" v-if="!edit" >
        <v-layout row wrap class="tech-names">
          <v-flex class="title" v-for="title in profile.titles" :key="title.id">
            <!-- <hr > -->
            <span>{{title.title}} •</span>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container slot="text" v-if="edit">
        <textarea rows="2" v-model="titles">
        </textarea>
      </v-container>
      <v-layout row slot="actions" v-if="this.$store.state.admin">
        <!-- Edit button -->
        <v-btn class="save" fab small @click="editTitles" v-if="!edit">
          <v-icon size="20px">edit</v-icon>
        </v-btn>
        <!-- Cancel button -->
        <v-btn class="cancel" fab small dark color="pink" @click="done" v-if="edit">
          <v-icon size="20px">cancel</v-icon>
        </v-btn>
        <!-- Save button -->
        <v-btn class="save" fab small dark color="cyan" @click="saveTitles" v-if="edit">
          <v-icon size="20px">save</v-icon>
        </v-btn>
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

<template>
  <v-flex xs12>
    <Panel class="education">
      <v-container slot="title">
        <h2 class="name">Education</h2>
      </v-container>
      <v-container slot="text" v-if="!edit">
        <v-layout row wrap>
          <v-flex xs3 v-for="ed in profile.programs" :key="ed.id">
            <v-container class="ed-container">
              <v-card class="_card">
                <v-card-media class="cyan darken-2">
                  <v-card-title>
                    <v-container class="ed">{{ed.institution}}</v-container>
                  </v-card-title>
                </v-card-media>
                <v-card-text class="text">
                  <h3>{{ed.title}}</h3>
                  <p>{{ed.credential}}</p>
                </v-card-text>
                <v-card-actions>
                  <p>from: {{customizeDate(ed.start).month}}, {{customizeDate(ed.start).year}}</p>
                  <v-spacer />
                  <p>to: {{customizeDate(ed.end).month}}, {{customizeDate(ed.end).year}}</p>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container slot="text" v-if="edit">
        <v-container fluid>
          <v-layout column>
            <v-flex xs12 v-for="program in programs" :key="program.id">
              <v-form class="white">
                <v-layout row>
                  <v-flex>
                    <v-text-field
                      label="Insitution Name"
                      v-model="program.institution"
                      required
                      flat>
                    </v-text-field>
                  </v-flex>
                  <v-spacer />
                  <v-flex>
                    <v-text-field
                      label="Title"
                      v-model="program.title"
                      required
                      flat>
                    </v-text-field>
                  </v-flex>
                  <v-spacer />
                  <v-flex>
                    <v-text-field
                      label="Credentials"
                      v-model="program.credential"
                      required
                      flat>
                    </v-text-field>
                  </v-flex>
                  <v-spacer />
                  <v-flex>
                    <v-text-field
                      label="Program Start"
                      v-model="program.start"
                      required
                      flat>
                    </v-text-field>
                  </v-flex>
                  <v-spacer />
                  <v-flex>
                    <v-text-field
                      label="Program End"
                      v-model="program.end"
                      required
                      flat>
                    </v-text-field>
                  </v-flex>
                  <v-flex style="paddingTop: 10px;">
                    <v-btn fab flat small dark color="pink" @click="removeProgram(program)">
                      <v-icon size="20px">cancel</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
              <br />
            </v-flex>
          </v-layout>
        </v-container>
      </v-container>
      <v-layout row slot="actions" v-if="this.$store.state.admin">
        <!-- Add button -->
        <v-btn class="add" fab small dark color="primary" @click="addProgramForm" v-if="edit">
          <v-icon size="20px">add</v-icon>
        </v-btn>
        <!-- Edit button -->
        <v-btn class="save" fab small @click="editPrograms" v-if="!edit">
          <v-icon size="20px">edit</v-icon>
        </v-btn>
        <!-- Cancel button -->
        <v-btn class="cancel" fab small dark color="pink" @click="done" v-if="edit">
          <v-icon size="20px">cancel</v-icon>
        </v-btn>
        <!-- Save button -->
        <v-btn class="save" fab small dark color="cyan" @click="savePrograms" v-if="edit">
          <v-icon size="20px">save</v-icon>
        </v-btn>
      </v-layout>
    </Panel>
  </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
var _ = require('lodash')
export default {
  data () {
    return {
      programs: [],
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
    addProgramForm () {
      this.programs.push({institution: '', title: '', credential: '', start: '', end: ''})
    },
    editPrograms () {
      this.profile.programs.forEach(program => {
        this.programs.push(program)
      })
      console.log('Programss: ', this.programs)
      this.edit = true
    },
    async update (programs) {
      const response = await ProfileService.setProfile({programs: this.programs})
      if (response.data.msg === true) {
        setTimeout(async () => {
          await this.$emit('update')
        }, 100)
        this.done()
      }
      return response
    },
    async savePrograms () {
      const response = await this.update()
      console.log('response savPrograms : ', response)
      this.done()
    },
    done () {
      this.programs = []
      this.edit = false
    },
    removeProgram (program) {
      let tmp = _.remove(this.programs, {id: program.id})
      if (tmp.length === 0) {
        _.remove(this.programs, {institution: program.institution, title: program.title})
      }
      this.edit = false
      this.edit = true
    },
    customizeDate (date) {
      let year = date.substring(0, 4)
      let month = date.substring(5, 7)
      switch (parseInt(month)) {
        case 1:
          month = 'January'
          break
        case 2:
          month = 'February'
          break
        case 3:
          month = 'March'
          break
        case 4:
          month = 'April'
          break
        case 5:
          month = 'May'
          break
        case 6:
          month = 'June'
          break
        case 7:
          month = 'July'
          break
        case 8:
          month = 'August'
          break
        case 9:
          month = 'September'
          break
        case 10:
          month = 'October'
          break
        case 11:
          month = 'December'
          break
        case 12:
          month = 'January'
          break
        default:
      }
      return {year: year, month: month}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  form {
    padding: 5px;
    border-radius: 15px;
  }
  ._card {
    box-shadow: 0 2px 20px 0;
  }
  ._card:hover {
    transform: scale(1.025);
    transition-duration: 0.2s;
  }
  .ed {
    color: #CFD8DC;
    text-align: center;
    font-size: 15px;
    /* background: radial-gradient(circle at top right, #880E4F, #9C3F70, #D45699, #9C3F70, #90A4AE); */
  }
  .ed-container {
    margin-right: 2px;
    padding: 10px;
  }
  .education {
    background: radial-gradient(circle at top left, #006064, #0097A7, cyan, #0097A7, #90A4AE);
  }
</style>

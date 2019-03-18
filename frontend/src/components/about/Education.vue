<template>
  <v-flex>
    <Panel class="education" id="education">
      <v-container slot="title">
        <h2 class="name">Education</h2>
      </v-container>
      <v-container slot="text" v-if="!edit">
        <v-layout row wrap>
          <v-flex lg3 md4 sm6 xs12 v-for="ed in profile.programs" :key="ed.id">
            <v-container class="ed-container" :id="'ed-' + ed.id">
              <v-card class="_card">
                <!-- institution -->
                <v-card-media class="cyan darken-2">
                  <v-card-title>
                    <v-container class="ed">{{ed.institution}}</v-container>
                  </v-card-title>
                </v-card-media>
                <!-- title and Credentials -->
                <v-card-text class="text">
                  <h3>{{ed.title}} - {{ed.credential}}</h3>
                  <hr />
                  <!-- <p>{{ed.credential}}</p> -->
                  <p>from: {{customizeDate(ed.start).month}}, {{customizeDate(ed.start).year}}</p>
                  <v-spacer />
                  <p>to: {{customizeDate(ed.end).month}}, {{customizeDate(ed.end).year}}</p>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container slot="text" v-if="edit">
        <!-- <transition name="school-forms">

        </transition> -->
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12 v-for="(program, index) in programs" :key="program.id">
              <v-form class="grey darken-4 contacts-edit" :id="`pr-${program.institution}-${program.id || program.eId}`">
                <v-layout column>
                  <v-text-field
                    label="Insitution Name"
                    v-model="program.institution"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <br />
                  <v-text-field
                    label="Title"
                    v-model="program.title"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <br />
                  <v-text-field
                    label="Credentials"
                    v-model="program.credential"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <br />
                  <v-text-field
                    label="Program Start (yyyy/mm/dd)"
                    v-model="program.start"
                    hint="(yyyy/mm/dd)"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <br />
                  <v-text-field
                    label="Program End (yyyy/mm/dd)"
                    v-model="program.end"
                    hint="(yyyy/mm/dd)"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <!-- delete -->
                  <v-flex style="paddingTop: 10px;">
                    <v-btn fab small dark color="pink" @click="removeProgram(program, index)">
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
      <v-container slot="actions" v-if="this.$store.state.admin">
        <v-layout row class="profile-admin-buttons">
          <!-- Edit button -->
          <v-btn fab small @click="editPrograms" v-if="!edit">
            <v-icon size="20px">edit</v-icon>
          </v-btn>
        </v-layout>
        <v-layout row class="profile-admin-buttons-edit">
          <!-- Cancel button -->
          <v-btn fab small dark color="pink" @click="done" v-if="edit">
            <v-icon size="20px">cancel</v-icon>
          </v-btn>
          <!-- Save button -->
          <v-btn fab small dark color="cyan" @click="savePrograms" v-if="edit">
            <v-icon size="20px">save</v-icon>
          </v-btn>
        </v-layout>
        <!-- Add button -->
        <v-btn class="add" fab small dark color="primary" @click="addProgramForm"  v-if="edit">
          <v-icon size="20px">add</v-icon>
        </v-btn>
      </v-container>
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
      edit: false,
      countBlanks: 0
    }
  },
  components: {
    Panel
  },
  props: {
    profile: Object
  },
  created () {
    this.slideIn()
  },
  methods: {
    addProgramForm () {
      this.programs.push({institution: '', title: '', credential: '', start: '', end: '', eId: this.countBlanks})
      this.countBlanks++
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
      this.slideFormsAway() // slide forms away

      setTimeout(() => {
        this.programs = []
        this.edit = false
        document.getElementById('education').scrollIntoView()
      }, 200)
    },
    // this function slides forms away
    slideFormsAway () {
      const timeout = (index) => {
        if (index >= 0) {
          let factor = 150
          setTimeout(() => {
            let p = this.programs[index]
            let elm = document.getElementById(`pr-${p.institution}-${p.id}`)
            if (elm) {
              elm.classList.remove('contacts-edit')
              elm.classList.add('abouts-edit-reverse')
            }
            timeout(--index)
          }, (factor * ((index + 1) % this.programs.length)))
        }
      }

      timeout(this.programs.length - 1)
    },
    // this function applies delete animation to blank forms
    deleteBlanks () {
      console.log('deleteBlanks')
      const timeout = (index) => {
        let factor = 50
        if (index >= 0) {
          let ed = this.programs[index]
          if (ed.institution === '') {
            console.log('ed', ed)
            setTimeout(() => {
              let elm = document.getElementById(`pr-${ed.institution}-${ed.eId}`)
              if (elm) {
                elm.classList.remove('contacts-edit')
                elm.classList.add('abouts-edit-reverse')
              }
              timeout(--index)
            }, (factor * index))
          } else {
            timeout(--index)
          }
        }
      }

      timeout(this.programs.length - 1)
    },
    removeProgram (program, index) {
      // animation
      if (program.title === '') {
        this.deleteBlanks()
      } else {
        let lar = document.getElementById(`pr-${program.Insitution}-${program.id}`)
        if (lar) {
          lar.classList.remove('contacts-edit')
          lar.classList.add('abouts-edit-reverse')
        }
      }

      setTimeout(() => {
        let tmp = _.remove(this.programs, {id: program.id})
        if (tmp.length === 0) {
          _.remove(this.programs, {institution: program.institution, title: program.title})
        }

        this.edit = false
        this.edit = true
        this.countBlanks = 0

        document.getElementById('education').scrollIntoView()
      }, 600)
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
    },
    slideProgramsAway () {
      const timeout = (index) => {
        let factor = 150
        if (index >= 0) {
          setTimeout(() => {
            let ed = this.profile.programs[index]
            let elm = document.getElementById(`ed-${ed.id}`)
            if (elm) {
              elm.classList.remove('contacts-edit')
              elm.classList.add('abouts-edit-reverse')
            }
            timeout(--index)
          }, (factor * ((index + 1) % this.profile.programs.length)))
        }
      }

      timeout(this.profile.programs.length - 1)
    },
    slideAway () {
      if (this.edit) {
        this.slideFormsAway()
      } else {
        this.slideProgramsAway()
      }
    },
    slideIn () {
      const timeout = (index) => {
        let factor = 150
        if (index < this.profile.programs.length) {
          setTimeout(() => {
            let ed = this.profile.programs[index]
            let elm = document.getElementById(`ed-${ed.id}`)
            if (elm) {
              elm.classList.add('contacts-edit')
            }
            timeout(++index)
          }, (factor * index))
        }
      }

      timeout(0)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  form {
    padding: 5px;
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
  .school-forms-leave-active {
    transition-duration: 0.5s;
  }
  .school-forms-leave-to {
    transform: translateX(200%);
  }
</style>

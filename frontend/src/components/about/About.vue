<template>
  <v-container v-if="loaded">
    <v-container>
      <br >
      <!-- Name -->
      <Name class="left-slide" :profile="profile" @update="reloadProfile" ref="name"/>
      <br >
      <!-- Skills -->
      <Skills class="right-slide" :profile="profile" @update="reloadProfile" ref="skills"/>
      <br >
      <!-- Education -->
      <Education class="left-slide" :profile="profile" @update="reloadProfile" ref="education"/>
      <br >
      <!-- Technologies -->
      <Technologies class="right-slide" :profile="profile" @update="reloadProfile" ref="echnologies"/>
      <br >
      <!-- About -->
      <v-flex>
        <Panel class="left-slide" ref="abouts">
          <v-container slot="title">
            <h2 class="name">A little about Me</h2>
          </v-container>
          <v-layout column wrap slot="text" v-if="!edit">
            <v-flex xs10 v-for="about in profile.abouts" :key="about.id">
              <v-container>
                <p>{{about.paragraph}}</p>
              </v-container>
            </v-flex>
          </v-layout>
          <v-container slot="text" v-if="edit">
            <textarea rows="10" v-model="abouts" class="grey lighten-4 abouts-edit" id="descriptions-input">
            </textarea>
          </v-container>
          <v-container slot="actions" v-if="this.$store.state.admin">
            <v-layout row class="profile-admin-buttons">
              <!-- Edit button -->
              <v-btn fab small dark @click="editText" v-if="!edit">
                <v-icon size="20px">edit</v-icon>
              </v-btn>
            </v-layout>
            <v-layout row class="profile-admin-buttons-edit">
              <!-- Cancel button -->
              <v-btn fab small dark color="pink" @click="done" v-if="edit">
                <v-icon size="20px">cancel</v-icon>
              </v-btn>
              <!-- Save button -->
              <v-btn fab small dark color="cyan" @click="saveText" v-if="edit">
                <v-icon size="20px">save</v-icon>
              </v-btn>
            </v-layout>
          </v-container>
        </Panel>
      </v-flex>
      <br >
      <br >
      <br >
    </v-container>
    <v-container class="my-loader" v-if="!loaded">
      <span class="app-loading">Loading...</span>
    </v-container>
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
      edit: false,
      loaded: false
    }
  },
  async mounted () {
    this.reloadProfile().then(res => {
      window.scrollTo(0, 0)
    })
  },
  components: {
    Panel, Name, Education, Skills, Technologies
  },
  beforeRouteLeave (to, from, next) {
    this.$refs.education.slideAway()

    setTimeout(() => {
      this.transit()
      setTimeout(() => {
        next()
      }, 500)
    }, 300)
  },
  methods: {
    reloadProfile () {
      // this.loaded = false
      return new Promise((resolve, reject) => {
        this.getProfile().then(res => {
          this.profile = res.data.profile
          this.loaded = true

          resolve(res.data.profile)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
      // this.profile = (await this.getProfile()).data.profile
    },
    getProfile () {
      // const profile = await ProfileService.getProfile()
      // return profile
      return new Promise((resolve, reject) => {
        ProfileService.getProfile().then(profile => {
          resolve(profile)
        }).catch(err => {
          reject(err)
        })
      })
    },
    update (abouts) {
      // show uploading titles toast
      this.$toasted.show(`Uploading abouts...`, this.$store.state.toast)

      ProfileService.setProfile({abouts: abouts}).then(response => {
        if (response.data.msg === true) {
          setTimeout(async () => {
            await this.reloadProfile()
            // show updated abouts toast
            this.$toasted.show(`Updated abouts`, this.$store.state.successToast)
            this.done()
          }, 1000)
        }
      }).catch(err => {
        // show error toast
        this.$toasted.show(`Oops something went wrong`, this.$store.state.errorToast)
        console.log(err)
      })
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
    // this function slides the textarea for descriptions away
    slideDescptionsEditAway () {
      let textarea = document.getElementById('descriptions-input')
      if (textarea) {
        textarea.classList.remove('abouts-edit')
        textarea.classList.add('right-slide-reverse')
      }
    },
    done () {
      this.slideDescptionsEditAway() // slide textarea away

      setTimeout(() => {
        this.abouts = ''
        this.edit = false
      }, 500)
    },
    // this function applies the side away animation for all components here
    transit () {
      // iterate over this.$refs
      Object.entries(this.$refs).forEach($ref => {
        if ($ref[1]._vnode.elm.classList.contains('left-slide')) {
          $ref[1]._vnode.elm.classList.remove('left-slide')
          $ref[1]._vnode.elm.classList.add('left-slide-reverse')
        } else {
          $ref[1]._vnode.elm.classList.remove('right-slide')
          $ref[1]._vnode.elm.classList.add('right-slide-reverse')
        }
      })
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

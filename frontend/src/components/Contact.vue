<template>
  <v-container>
    <v-flex xs12 lg10 class="flex-lg8" v-if="loaded">
      <!-- Contact Card -->
      <Panel class="header left-slide" id="contact-panel">
        <!-- Title -->
        <v-container slot="title" class="name">
          <h1 class="tech-names">Contact Info</h1>
        </v-container>
        <!-- Text -->
        <!-- if not edit -->
        <v-container slot="text" v-if="!edit">
          <v-layout column>
            <!-- list -->
            <v-list dark>
              <!-- Name tile -->
              <v-list-tile>
                <v-list-tile-title><span class="name">Name:</span> <span class="right">{{profile.firstName}} {{profile.lastName}}</span></v-list-tile-title>
              </v-list-tile>
              <v-divider />
              <!-- Email tile -->
              <v-list-tile>
                <v-list-tile-title><span class="name">Email:</span> <span class="right"><a :href="mailTo">{{profile.email}}</a></span>  </v-list-tile-title>
              </v-list-tile>
              <v-divider />
              <!-- Telphone tile -->
              <v-list-tile>
                <v-list-tile-title><span class="name">Telephone:</span> <span class="right">{{profile.tel}}</span>  </v-list-tile-title>
              </v-list-tile>
              <!-- Social Networks tile -->
              <div v-if="profile.socials.length > 0">
                <h2 class="socials-heading">...Social Networks...</h2>
                <template v-for="(socialNetwork, index) in profile.socials">
                  <v-divider :key="socialNetwork.name"/>
                  <v-list-tile :key="index">
                    <v-list-tile-title><span class="name">{{socialNetwork.name}}:</span> <span class="right"><a :href="social(socialNetwork)" target="_blank">@{{socialNetwork.social}}</a></span>  </v-list-tile-title>
                  </v-list-tile>
                </template>
              </div>
            </v-list>
          </v-layout>
        </v-container>
        <!-- if edit -->
        <v-container slot="text" v-if="edit">
          <transition name="abouts">
            <!-- Main form -->
            <v-form class="grey darken-4">
              <v-layout column>
                <v-layout column class="abouts-edit" id="mainForm">
                  <!-- First Name -->
                  <v-text-field
                    label="First Name"
                    v-model="contactInfo.firstName"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <br />
                  <!-- Last Name -->
                  <v-text-field
                    label="Last Name"
                    v-model="contactInfo.lastName"
                    required
                    dark
                    solo>
                  </v-text-field>
                  <br />
                  <v-spacer />
                  <!-- Email -->
                  <v-text-field
                    solo
                    label="Email"
                    v-model="contactInfo.email"
                    required
                    dark>
                  </v-text-field>
                  <br />
                  <!-- Telephone -->
                  <v-text-field
                    label="Telphone"
                    v-model="contactInfo.tel"
                    required
                    dark
                    solo>
                  </v-text-field>
                </v-layout>
                <br />
                <!-- Social Networks -->
                <h2 style="color: white">Social Networks</h2>
                <v-layout row wrap>
                  <v-flex xs12 sm6 md4 lg3 v-for="(socialNetwork, index) in socials" :key="index" class="socials-form">
                    <v-container class="elevated contacts-edit" :id="`socials-${socialNetwork.name}-${socialNetwork.id || socialNetwork.bId}`" :ref="'-' + socialNetwork.name">
                      <!-- Name -->
                      <v-text-field
                        label="Name"
                        v-model="socialNetwork.name"
                        required
                        dark
                        solo>
                      </v-text-field>
                      <br />
                      <!-- SocialID -->
                      <v-text-field
                        label="SocialID"
                        v-model="socialNetwork.social"
                        required
                        dark
                        solo>
                      </v-text-field>
                      <br />
                      <!-- Delete -->
                      <v-btn fab small dark color="pink" @click="removerSocial(socialNetwork)">
                        <v-icon size="20px">cancel</v-icon>
                      </v-btn>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-layout>
              <!-- Add Social Network Button -->
              <v-btn fab small dark color="primary" @click="addSocialsForm">
                <v-icon size="20px">add</v-icon>
              </v-btn>
            </v-form>
          </transition>
        </v-container>
        <!-- Actions -->
        <v-container slot="actions" v-if="this.$store.state.admin">
          <v-layout row class="profile-admin-buttons">
            <!-- Edit button -->
            <v-btn fab small @click="editContactInfo" v-if="!edit">
              <v-icon size="20px">edit</v-icon>
            </v-btn>
          </v-layout>
          <v-layout row class="profile-admin-buttons-edit">
            <!-- Cancel button -->
            <v-btn fab small dark color="pink" @click="done" v-if="edit">
              <v-icon size="20px">cancel</v-icon>
            </v-btn>
            <!-- Save button -->
            <v-btn fab small dark color="cyan" @click="saveContactInfo" v-if="edit">
              <v-icon size="20px">save</v-icon>
            </v-btn>
          </v-layout>
        </v-container>
      </Panel>
    </v-flex>
    <v-container class="loader" slot="media" v-if="!loaded">
      <img src="@/assets/loader.svg" alt="Loading icon." />
    </v-container>
    <br />
    <br />
  </v-container>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
var _ = require('lodash')
export default {
  data () {
    return {
      loaded: false,
      profile: {},
      contactInfo: {
        firstName: '',
        lastName: '',
        tel: '',
        email: ''
      },
      socials: [],
      edit: false,
      countBlanks: 0
    }
  },
  async mounted () {
    this.reloadProfile()
    window.scrollTo(0, 0)
  },
  components: {
    Panel
  },
  beforeRouteLeave (to, from, next) {
    this.routeLeave() // clean up before leave

    setTimeout(() => {
      next()
    }, (this.edit) ? 700 : 500)
  },
  methods: {
    slideMainFormAway () {
      let mainForm = document.getElementById('mainForm')
      if (mainForm) {
        mainForm.classList.remove('abouts-edit')
        mainForm.classList.add('right-slide-reverse')
      }
    },
    routeLeave () {
      let delay = 0
      if (this.edit) {
        this.done() // clear edits components
        delay = 500
      }

      setTimeout(() => {
        let panel = document.getElementById('contact-panel')
        if (panel) {
          panel.classList.remove('left-slide')
          panel.classList.add('left-slide-reverse')
        }
      }, delay)
    },
    async reloadProfile () {
      this.profile = (await this.getProfile()).data.profile
      this.loaded = true
    },
    async getProfile () {
      const profile = await ProfileService.getProfile()
      return profile
    },
    editContactInfo () {
      this.contactInfo.firstName = this.profile.firstName
      this.contactInfo.lastName = this.profile.lastName
      this.contactInfo.email = this.profile.email
      this.contactInfo.tel = this.profile.tel

      this.profile.socials.forEach(socialNetwork => {
        this.socials.push(socialNetwork)
      })
      this.edit = true
    },
    async update () {
      const response = await ProfileService.setProfile({profile: this.contactInfo, socials: this.socials})
      if (response.data.msg === true) {
        setTimeout(async () => {
          this.reloadProfile()
        }, 100)
        this.done()
      }
      return response
    },
    async saveContactInfo () {
      this.removeBlanks()
      await this.update()
    },
    done () {
      this.slideMainFormAway() // slide main form away
      setTimeout(() => {
        this.slideFormsAway() // slide forms away

        setTimeout(() => {
          this.contactInfo.firstName = this.contactInfo.lastName = this.contactInfo.tel = this.contactInfo.email = ''
          this.socials = []
          this.edit = false
          window.scrollTo(0, 0)
        }, 300)
      }, 200)
    },
    addSocialsForm () {
      this.socials.push({name: '', social: '', bId: this.countBlanks})
      this.countBlanks++
    },
    // this function applies delete animation to blank forms
    deleteBlanks () {
      const timeout = (index) => {
        let factor = 50
        if (index < this.socials.length) {
          let soc = this.socials[index]
          if (soc.name === '') {
            setTimeout(() => {
              let elm = document.getElementById(`socials-${soc.name}-${soc.bId}`)
              if (elm) {
                elm.classList.remove('contacts-edit')
                elm.classList.add('abouts-edit-reverse')
              }
              timeout(++index)
            }, (factor * index))
          } else {
            timeout(++index)
          }
        }
      }

      timeout(0)
    },
    // this function applies the slide away animtion to socials forms
    slideFormsAway () {
      for (var i = 0; i < this.socials.length; ++i) {
        let soc = this.socials[i]
        let lar = document.getElementById(`socials-${soc.name}-${soc.id || soc.bId}`)
        if (lar) {
          lar.classList.remove('contacts-edit')
          lar.classList.add('abouts-edit-reverse')
        }
      }
    },
    removerSocial (socialNetwork) {
      // animation
      if (socialNetwork.name === '') {
        this.deleteBlanks()
      } else {
        let lar = document.getElementById(`socials-${socialNetwork.name}-${socialNetwork.id}`)
        if (lar) {
          lar.classList.remove('contacts-edit')
          lar.classList.add('abouts-edit-reverse')
        }
      }
      // wait for animation before removing
      setTimeout(() => {
        let tmp = _.remove(this.socials, {id: socialNetwork.id})

        if (tmp.length === 0) {
          _.remove(this.socials, {name: socialNetwork.name, social: socialNetwork.social})
        }

        this.edit = false
        this.edit = true
        this.countBlanks = 0
      }, 600)
    },
    social (socialNetwork) {
      if (socialNetwork.name === 'twitter') {
        return `https://www.twitter.com/${socialNetwork.social}`
      } else if (socialNetwork.name === 'instagram') {
        return `https://www.instagram.com/${socialNetwork.social}`
      }
    },
    // this function removes blank forms when saving
    removeBlanks () {
      for (var i = 0; i < this.socials.length; ++i) {
        let soc = this.socials[i]
        if (soc.name === '' && soc.social === '') {
          this.socials.splice(i, 1)
        }
      }
    }
  },
  computed: {
    mailTo: function () {
      return `mailto:${this.profile.email}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  form {
    padding: 15px;
    border-radius: 5px;
  }
  .header {
    background-color: #212121
  }
  .socials-heading {
    font-family: cursive;
    text-align: center;
  }
  .elevated {
    box-shadow: 0px 1px 5px 0px;
  }
  .socials-form {
    padding: 15px;
  }
</style>

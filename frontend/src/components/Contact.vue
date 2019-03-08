<template>
  <v-container>
    <v-flex xs12 lg10 class="flex-lg8">
      <!-- Contact Card -->
      <Panel class="header">
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
              <div v-if="profile.socials">
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
          <!-- Main form -->
          <v-form class="grey lighten-2">
            <v-layout column>
              <v-layout column>
                <!-- First Name -->
                <v-text-field
                  label="First Name"
                  v-model="contactInfo.firstName"
                  required
                  solo>
                </v-text-field>
                <br />
                <!-- Last Name -->
                <v-text-field
                  label="Last Name"
                  v-model="contactInfo.lastName"
                  required
                  solo>
                </v-text-field>
                <br />
                <v-spacer />
                <!-- Email -->
                <v-text-field
                  solo
                  label="Email"
                  v-model="contactInfo.email"
                  required>
                </v-text-field>
                <br />
                <!-- Telephone -->
                <v-text-field
                  label="Telphone"
                  v-model="contactInfo.tel"
                  required
                  solo>
                </v-text-field>
              </v-layout>
              <br />
              <!-- Social Networks -->
              <h2>Social Networks</h2>
              <v-layout row wrap>
                <v-flex xs12 sm6 md4 lg3 v-for="(socialNetwork, index) in socials" :key="index" class="socials-form">
                  <v-container class="elevated">
                    <!-- Name -->
                    <v-text-field
                      label="Name"
                      v-model="socialNetwork.name"
                      required
                      solo>
                    </v-text-field>
                    <br />
                    <!-- SocialID -->
                    <v-text-field
                      label="SocialID"
                      v-model="socialNetwork.social"
                      required
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
      profile: {},
      contactInfo: {
        firstName: '',
        lastName: '',
        tel: '',
        email: ''
      },
      socials: [],
      edit: false
    }
  },
  async mounted () {
    this.reloadProfile()
    window.scrollTo(0, 0)
  },
  components: {
    Panel
  },
  methods: {
    async reloadProfile () {
      this.profile = (await this.getProfile()).data.profile
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
      const response = await this.update()
      console.log('response saveContactInfo : ', response)
    },
    done () {
      this.contactInfo.firstName = this.contactInfo.lastName = this.contactInfo.tel = this.contactInfo.email = ''
      this.socials = []
      this.edit = false
    },
    addSocialsForm () {
      this.socials.push({name: '', social: ''})
    },
    removerSocial (socialNetwork) {
      let tmp = _.remove(this.socials, {id: socialNetwork.id})
      if (tmp.length === 0) {
        _.remove(this.socials, {name: socialNetwork.name, social: socialNetwork.social})
      }
      this.edit = false
      this.edit = true
    },
    social (socialNetwork) {
      console.log('social => ', socialNetwork)
      if (socialNetwork.name === 'twitter') {
        return `https://www.twitter.com/${socialNetwork.social}`
      } else if (socialNetwork.name === 'instagram') {
        return `https://www.instagram.com/${socialNetwork.social}`
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
    margin: 15px;
  }
</style>

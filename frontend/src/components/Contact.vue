<template>
  <v-container>
    <!-- Profile Pic -->
    <v-avatar
      size="150px"
      class="white profile-pic">
    </v-avatar>
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
            <template v-for="(socialNetwork, index) in profile.socials">
              <v-divider :key="socialNetwork.name"/>
              <v-list-tile :key="index">
                <v-list-tile-title><span class="name">{{socialNetwork.name}}:</span> <span class="right"><a :href="socialNetwork.social">{{socialNetwork.social}}</a></span>  </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-list>
        </v-layout>
      </v-container>
      <!-- if edit -->
      <v-container slot="text" v-if="edit">
        <!-- Main form -->
        <v-form class="white">
          <v-layout column>
            <v-layout row>
              <!-- First Name -->
              <v-flex>
                <v-text-field
                  label="First Name"
                  v-model="contactInfo.firstName"
                  required
                  flat>
                </v-text-field>
              </v-flex>
              <v-spacer />
              <!-- Last Name -->
              <v-flex>
                <v-text-field
                  label="Last Name"
                  v-model="contactInfo.lastName"
                  required
                  flat>
                </v-text-field>
              </v-flex>
              <v-spacer />
              <!-- Email -->
              <v-flex>
                <v-text-field
                  label="Email"
                  v-model="contactInfo.email"
                  required
                  flat>
                </v-text-field>
              </v-flex>
              <v-spacer />
              <!-- Telephone -->
              <v-flex>
                <v-text-field
                  label="Telphone"
                  v-model="contactInfo.tel"
                  required
                  flat>
                </v-text-field>
              </v-flex>
            </v-layout>
            <br />
            <!-- Social Networks -->
            <h2>Social Networks</h2>
            <br />
            <v-layout row v-for="(socialNetwork, index) in socials" :key="index">
              <!-- Name -->
              <v-flex xs5>
                <v-text-field
                  label="Name"
                  v-model="socialNetwork.name"
                  required
                  flat>
                </v-text-field>
              </v-flex>
              <v-spacer />
              <br />
              <!-- SocialID -->
              <v-flex xs5>
                <v-text-field
                  label="SocialID"
                  v-model="socialNetwork.social"
                  required
                  flat>
                </v-text-field>
              </v-flex>
              <v-spacer />
              <br />
              <!-- Delete -->
              <v-flex xs1 style="paddingTop: 10px;">
                <v-btn fab flat small dark color="pink" @click="removerSocial(socialNetwork)">
                  <v-icon size="20px">cancel</v-icon>
                </v-btn>
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
      <v-layout row slot="actions" v-if="this.$store.state.admin">
        <!-- Edit button -->
        <v-btn class="save" fab small @click="editContactInfo" v-if="!edit">
          <v-icon size="20px">edit</v-icon>
        </v-btn>
        <!-- Cancel button -->
        <v-btn class="cancel" fab small dark color="pink" @click="done" v-if="edit">
          <v-icon size="20px">cancel</v-icon>
        </v-btn>
        <!-- Save button -->
        <v-btn class="save" fab small dark color="cyan" @click="saveContactInfo" v-if="edit">
          <v-icon size="20px">save</v-icon>
        </v-btn>
      </v-layout>
    </Panel>
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
    socials (socialNetwork) {
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
</style>

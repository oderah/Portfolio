<template>
  <!-- Profile Pic -->
  <v-avatar
    size="150px"
    class="black profile-pic"
    @mouseover="mouseover" @mouseleave="mouseleave">
    <img ref="profilePic" :src="profile_pic" alt="Profile picture" v-if="loaded" />
    <div v-if="this.$store.state.admin" v-show="hovering">
      <!-- select file -->
      <input style="display: none;" type="file" name='picture' @change="filesChanged" ref="upload" />
      <!-- add -->
      <v-btn fab small color="primary" dark @click="$refs.upload.click()">
        <v-icon>add</v-icon>
      </v-btn>
      <!-- delete -->
      <v-btn fab small color="pink" dark @click="deleteProfilePic">
        <v-icon>delete</v-icon>
      </v-btn>
      <!-- Save button -->
      <v-btn fab small dark color="cyan" @click="saveChanges">
        <v-icon>save</v-icon>
      </v-btn>
    </div>
    <!-- Profile loading -->
    <v-container class="loader" slot="media" v-if="!loaded">
      <img src="@/assets/loader.svg" alt="Loading icon." />
    </v-container>
  </v-avatar>
</template>

<script>
import ProfileService from '@/services/ProfileService'
const image2base64 = require('image-to-base64')

export default {
  data () {
    return {
      loaded: false,
      hovering: false,
      file: null,
      actualFile: null,
      profilePic: null,
      defaultPic: require('@/assets/landing.svg')
    }
  },
  mounted () {
    this.getProfilePicture()
  },
  methods: {
    // this function gets the profile picture
    getProfilePicture () {
      ProfileService.getProfilePic().then(res => {
        this.profilePic = res.data
        this.loaded = true
      }).catch(err => {
        console.log(err)
      })
    },
    hover () {
      this.hovering = true
    },
    stopHover () {
      this.hovering = false
    },
    dimImage () {
      this.$refs.profilePic.style = 'opacity: 0.5;'
    },
    unDimImage () {
      this.$refs.profilePic.style = 'opacity: 1;'
    },
    // this function stores new selected file
    async filesChanged (e) {
      let file = e.target.files[0]
      let url = URL.createObjectURL(file) // create image url

      const res = await image2base64(url)
      this.file = `data:image/png;base64, ${res}`
      this.actualFile = e.target.files[0]
    },
    // this function saves any changes made
    saveChanges () {
      let up2backend = (url) => {
        ProfileService.setProfilePic(url).then(res => {
          // show success toast
          this.$toasted.show(`<i class="material-icons">tag_faces</i> Updated profile picture`, this.$store.state.successToast)
          // this.$router.go() // reload page
        }).catch(err => {
          console.log(err)
          this.$toasted.show(`FAILED!!!`, this.$store.state.errorToast)
        })
      }
      // show updating profile picture toast
      this.$toasted.show(`Updating profile picture...`, this.$store.state.toast)
      if (this.file !== null) {
        ProfileService.uploadProfilePic(this.actualFile).then(url => {
          up2backend(url)
        })
      } else {
        up2backend(null)
      }
    },
    deleteProfilePic () {
      this.profilePic = '' // remove current picture
      this.file = null // set null as new profile picture
    },
    // mouseover function
    mouseover () {
      this.hover()
      if (this.$store.state.admin) {
        this.dimImage()
      }
    },
    // mouseleave function
    mouseleave () {
      this.stopHover()
      if (this.$store.state.admin) {
        this.unDimImage()
      }
    }
  },
  computed: {
    profile_pic: function () {
      if (this.file !== null && this.file.length > 0) {
        return this.file
      } else if (this.profilePic !== null && this.profilePic.length > 0) {
        return this.profilePic
      } else {
        return this.defaultPic
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.profile-pic {
  position: fixed;
  top: 10vh;
  right: 0;
  z-index: 2;
  box-shadow: 0 0 15px 5px black;
}
.profile-pic:hover {
  transform: scale(1.025);
  transition-duration: 0.2s;
}
.profile-pic > img {
  position: absolute;
  /* width: 100%;
  height: auto;
  max-height: 100%; */
  width: 100%;
  height: 100%;
}
/* xs */
@media only screen and (max-width: 600px) {
  .profile-pic {
    transform: scale(0.6);
    right: -6.5vw;
  }
}
/* sm */
@media only screen and (max-width: 960px) and (min-width: 601px) {
  .profile-pic {
    transform: scale(0.8);
    right: -2vw;
  }
}
/* md */
@media only screen and (max-width: 1264px) and (min-width: 961px) {
  .profile-pic {
    transform: scale(0.9);
    right: -1vw;
  }
}
</style>

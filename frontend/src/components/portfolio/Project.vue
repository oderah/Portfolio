<template>
  <div>
    <!-- Profile Pic -->
    <v-avatar
      size="150px"
      class="white profile-pic">
      Pic
    </v-avatar>
    <v-container v-if="loaded">
      <div class="name">
        <h1 class="project-title">{{project.title}}
          <!-- Tag -->
          <span>
            <v-avatar
              class="title pink lighten-1 "
              size="30px">
              <v-icon dark size="20px">
                {{app_tags[project.tag]}}
              </v-icon>
            </v-avatar>
          </span>
        </h1>
      </div>
      <p><em>Released on: {{project.release_date}}</em><br />
        <a href="#">code repo</a><br />
        <a :href="link" v-if="project.tag !== 'graphic-design'">live link</a>
      </p>
      <div v-if="technologies.length >= 0">
        <h2>Technologies Used</h2>
        <ul>
          <li v-for="(tech, index) in technologies" :key="index">
            {{tech.tech}}
          </li>
        </ul>
      </div>
      <v-layout class="descriptions" column>
        <h2>Description</h2>
        <p class="paragraph" v-for="(description, index) in descriptions" :key="index">{{description.description}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </v-layout>
      <!-- Images -->
      <Panel class="black" v-if="picsLoaded && !noPics">
        <h2 slot="title" class="tech-names">Images</h2>
        <v-layout column slot="text">
          <v-carousel
            class="carousel black"
            :interval="4000">
            <v-carousel-item
              v-for="(image,i) in getPictures"
              :key="i"
              @error="missingImage"
            >
              <img
                :id="'p' + i"
                :src="image"
                :alt="missingImage"
              />
            </v-carousel-item>
          </v-carousel>
        </v-layout>
      </Panel>
      <v-container class="my-loader" v-if="!picsLoaded">
        <span class="app-loading">Loading...</span>
      </v-container>
      <br />
      <br />
    </v-container>
    <v-container class="my-loader" v-if="!loaded">
      <span>Loading...</span>
    </v-container>
  </div>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
// var EXIF = require('exif-js')
export default {
  data () {
    return {
      project: {},
      loaded: false,
      picsLoaded: false,
      noPics: false,
      pictures: []
    }
  },
  async created () {
    // get project
    ProfileService.getProject(this.$route.params.id).then(async res => {
      this.project = res.data.project
      this.loaded = true
      // load pictures
      this.loadPictures((pictures) => {
        this.pictures = pictures
        this.picsLoaded = true
        console.log(pictures)
      })
    })
  },
  components: {
    Panel
  },
  methods: {
    // this function requests image from backend
    async processPath (id, callback) {
      ProfileService.loadImage(id).then(res => {
        callback(res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    // this function converts imagePath to image
    async loadPictures (callback) {
      if (this.project.ImagePaths.length === 0) {
        this.noPics = true
        this.picsLoaded = true
      } else {
        let pictures = []

        this.project.ImagePaths.forEach(async (path) => {
          var img = []
          this.processPath(path.id, (val) => {
            img = val.data

            // convert image to blob
            var arrayBufferView = new Uint8Array(img)
            var blob = new Blob([arrayBufferView], {type: 'image/jpeg'})

            // get URL of image
            var urlCreator = window.URL || window.webkitURL
            var imageUrl = urlCreator.createObjectURL(blob)

            // add to pictures array
            pictures.push(imageUrl)

            callback(pictures)
          })
        })
      }
    }
  },
  computed: {
    descriptions: function () {
      return this.project['Descriptions']
    },
    technologies: function () {
      return this.project['Teches']
    },
    app_tags: function () {
      return this.$store.state.tags
    },
    link: function () {
      // add http://www. if not in _link
      if (this.project._link.includes('http')) {
        return this.project._link
      } else {
        return 'https://www.' + this.project._link
      }
    },
    missingImage: function () {
      return 'Missing Image'
    },
    getPictures: function () {
      return this.pictures
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .carousel {
    height: 500px;
    width: 90%;
    margin: 0 auto;
  }
  .carousel img {
    max-width: 100%;
    max-height: 100%;
  }
  .project-title, li {
    text-align: left;
  }
  .descriptions {
    padding: 15px 0;
  }
  .styless-anchor {
    text-decoration: none;
  }
  ul {
    margin-left: 35px;
  }
  .rotate {
    transform: rotate(90deg);
  }
</style>

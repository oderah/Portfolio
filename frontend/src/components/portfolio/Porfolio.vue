<template>
  <div class="my-container">
    <!-- Profile Pic -->
    <v-avatar
      size="150px"
      class="white profile-pic">
    </v-avatar>
    <v-layout column>
      <!-- Add Project Form -->
      <NewProject v-if="add" />
      <!-- Projects -->
      <v-flex xs12 sm12 md12 lg12 v-if="!add && projectsLoaded">
        <v-layout row wrap>
          <v-flex lg3 md4 sm6 xs12 v-for="(project, index) in projectsToDisplay" :key="project.id" style="padding: 15px;">
            <Panel @click.native="() => {if (!edit) {goToProject(project.id)}}" class="project-card">
              <!-- Title -->
              <span class="name project-title tech-names" slot="title">{{project.title}}</span>
              <!-- carousel -->
              <v-carousel slot="media" hide-delimiters hide-controls
                class="carousel black"
                :interval="delay(index)"
                v-if="picturesLoaded"
                >
                <v-carousel-item
                  v-for="(image,i) in project.pictures"
                  :key="i"
                  @error="missingImage"
                >
                  <img
                    :id="'p' + project.id + '_' + image.id"
                    :src="image"
                    :alt="missingImage"
                  />
                </v-carousel-item>
              </v-carousel>
              <v-container class="carousel my-loader" slot="media" v-if="!picturesLoaded">
                <span class="app-loading tech-names">Loading...</span>
              </v-container>
              <v-layout column slot="text" style="height: 100px;" class="tech-names">
                <p style="textAlign: left; overflow: hidden;">{{project.Descriptions[0].description || ''}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </v-layout>
              <v-layout row slot="actions">
                <!-- Info button -->
                <v-btn>
                  info
                </v-btn>
                <v-spacer />
                <!-- Tag -->
                <v-avatar
                  class="title cyan"
                  size="30px">
                  <v-icon dark size="20px">
                    {{app_tags[project.tag]}}
                  </v-icon>
                </v-avatar>
                <!-- delete -->
                <v-btn
                  fab
                  small
                  dark
                  flat
                  color="red"
                  @click="deleteProject(project.id)"
                   v-if="edit">
                  <v-icon>cancel</v-icon>
                </v-btn>
              </v-layout>
            </Panel>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Project loading -->
      <v-container class="my-loader" v-if="!add && !projectsLoaded">
        <span class="app-loading">Loading...</span>
      </v-container>
      <!-- Control Panel -->
      <v-flex class="control">
        <v-container>
          <Panel class="education">
            <!-- sorting -->
            <v-layout column slot="text">
              <v-layout column>
                <div>Sort Order:</div>
                <v-flex offset-xs1>
                  <v-radio-group v-model="sortOrder" :mandatory="true">
                    <v-radio label="New to Old" value="mostRecent" color="black"></v-radio>
                    <v-radio label="Old to New" value="leastRecent" color="black"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <!-- filter -->
              <v-menu dark fixed offset-y :close-on-content-click="false">
                <v-btn dark slot="activator" class="pink darken-4">
                  filter
                </v-btn>
                <v-list class="pink darken-4" style="width: 200px;">
                  <v-list-tile v-for="(tag, index) in tags" :key="index">
                    <v-list-tile-title>
                      <v-checkbox
                        v-model="filter"
                        :label="tag"
                        :value="tag"
                        color="white">
                      </v-checkbox>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-spacer />
              <!-- admin options -->
              <v-flex offset-xs0 v-if="this.$store.state.admin && !edit">
                <v-btn
                  fab
                  small
                  @click="() => {edit = true}">
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-flex>
              <!-- edit options -->
              <v-layout row wrap v-if="edit">
                <!-- cancel button -->
                <v-btn
                  fab
                  small
                  dark
                  color="pink"
                  @click="() => {edit = false; add = false}">
                  <v-icon>cancel</v-icon>
                </v-btn>
                <!-- add -->
                <v-btn
                  fab
                  small
                  dark
                  @click="() => {add = true}">
                  <v-icon>add</v-icon>
                </v-btn>
                <!-- save -->
                <v-btn
                  fab
                  small
                  dark
                  color="cyan darken-4">
                  <v-icon>save</v-icon>
                </v-btn>
              </v-layout>
            </v-layout>
          </Panel>
        </v-container>
      </v-flex>
    </v-layout>
    <br />
    <br />
  </div>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
import NewProject from './NewProject'

var _ = require('lodash')

export default {
  data () {
    return {
      projects: [],
      sortOrder: 'mostRecent',
      edit: false,
      add: false,
      tags: [],
      filter: [],
      projectsLoaded: false,
      picturesLoaded: false
    }
  },
  components: {
    NewProject, Panel
  },
  async created () {
    // load projects
    await this.reloadProjects()
    this.tags = ['website', 'web-app', 'mobile-app', 'graphic-design']

    this.filter = this.tags // filter projects
    window.scrollTo(0, 0) // scroll to top
  },
  methods: {
    // this function reloads the projects
    async reloadProjects () {
      this.projects = await this.getProjects()
      this.projects = this.projects.data.projects
      this.projectsLoaded = true // set projectsLoaded

      let count = 0
      // load pictures
      this.loadPictures(() => {
        count++
        if (count === this.count()) { // all pictures loaded
          this.picturesLoaded = true // set picturesLoaded
        }
      })
    },
    // this function gets the projects from server
    async getProjects () {
      const projects = await ProfileService.getProjects('all')
      return projects
    },
    // this function navigates to the project with the specified id
    goToProject (id) {
      this.$router.push({path: `/portfolio/${id}`})
    },
    // this function filters the projects based on this.filter
    _filter () {
      let filtered = []
      // this.$root.$emit('filter')

      this.filter.forEach(option => {
        let projs = this.projects.slice() // get a copy of this.projects

        // find last project with tag = option
        let index = _.findLastIndex(projs, {tag: option})

        while (index >= 0) {
          // add proj to filtered if it doesn't already exist in filtered
          if ((_.findIndex(filtered, {title: projs[index].title})) === -1) {
            filtered.push(projs[index])
          }

          // remove filtered project from projs
          projs = (index > 0) ? projs.slice(0, index) : projs.slice(1)

          // find another project with tag = option
          index = _.findLastIndex(projs, {tag: option})
        }
      })
      return filtered
    },
    // this function calculated the delay based on factor
    delay (factor) {
      return (factor + 4) + '000'
    },
    // this function requests image from backend
    async processPath (id, callback) {
      ProfileService.loadImage(id).then(res => {
        callback(res.data)
      })
    },
    // this function loads all the pictures from the server
    loadPictures (callback) {
      this.projects.forEach((project) => {
        project['pictures'] = [] // add new key 'pictures' of type array to project

        // process each imagePath in project
        project.ImagePaths.forEach(path => {
          this.processPath(path.id, (img) => {
            img = img.data // image as a buffer

            // the next steps convert buffer to image
            var arrayBufferView = new Uint8Array(img) // convert buffer to Uint8Array
            var blob = new Blob([arrayBufferView], {type: 'image/jpeg'}) // create blob form Uint8Array
            var urlCreator = window.URL || window.webkitURL
            var imageUrl = urlCreator.createObjectURL(blob) // create URL from blob

            project.pictures.push(imageUrl) // add to pictures array in project
            callback()
          })
        })
      })
    },
    // this function calculated the total number of imagePaths
    count () {
      let count = 0

      this.projects.forEach(project => {
        count += project.ImagePaths.length
      })

      return count
    },
    // this function deletes the project specified by id
    deleteProject (id) {
      if (confirm('Are you sure you want to delete this project?')) {
        this.projectsLoaded = false // set projectsLoaded
        this.picturesLoaded = false // set picturesLoaded
        ProfileService.deleteProject(id).then(res => {
          console.log('res', res)
          this.reloadProjects()
        })
      }
    }
  },
  computed: {
    sortedProjectsAsc: function () {
      let temp = _.orderBy(this.filteredProjects, 'release_date', 'asc')
      return temp
    },
    sortedProjectsDesc: function () {
      let temp = _.orderBy(this.filteredProjects, 'release_date', 'desc')
      return temp
    },
    filteredProjects: function () {
      let ans = this._filter()
      return ans
    },
    app_tags: function () {
      return this.$store.state.tags
    },
    projectsToDisplay: function () {
      if (this.sortOrder === 'mostRecent') return this.sortedProjectsDesc
      else return this.sortedProjectsAsc
    },
    missingImage: function () {
      return 'Missing Image'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .carousel {
    height: 200px;
    margin: 0;
  }
  img {
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    image-orientation: from-image;
  }
  .control {
    position: fixed;
    top: 30vh;
    right: -160px;
    width: 240px;
    transition-duration: 0.3s;
  }
  .control:hover {
    transform: translateX(-140px);
    transition-duration: 0.3s;
  }
  .my-container {
    padding: 30px;
  }
  .project-title {
    font-size: 2em;
  }
</style>

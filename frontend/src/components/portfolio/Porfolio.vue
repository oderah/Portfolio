<template>
  <div class="my-container">
    <v-layout column>
      <!-- Add Project Form -->
      <NewProject v-if="add" />
      <!-- Projects -->
      <v-layout row wrap v-if="!add && projectsLoaded">
        <v-flex lg3 md4 sm6 xs12 v-for="project in projectsToDisplay" :key="project.id" style="padding: 15px;">
          <ProjectCard :project="project" :edit="() => (edit)" />
        </v-flex>
      </v-layout>
      <!-- Project loading -->
      <v-container class="my-loader" v-if="!add && !projectsLoaded">
        <span class="app-loading">Loading...</span>
      </v-container>
      <!-- Control Panel -->
      <v-flex class="control">
        <v-container>
          <Panel class="education round">
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
                <v-btn dark round slot="activator" class="pink darken-4">
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
import ProjectCard from './ProjectCard'

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
      projectsLoaded: false
    }
  },
  components: {
    NewProject, Panel, ProjectCard
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

      // let count = 0
      // // load pictures
      // this.loadPictures(() => {
      //   count++
      //   if (count === this.count()) { // all pictures loaded
      //     this.picturesLoaded = true // set picturesLoaded
      //   }
      // })
    },
    // this function gets the projects from server
    async getProjects () {
      const projects = await ProfileService.getProjects('all')
      return projects
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
    // this function calculated the total number of imagePaths
    count () {
      let count = 0

      this.projects.forEach(project => {
        count += project.ImagePaths.length
      })

      return count
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
    projectsToDisplay: function () {
      if (this.sortOrder === 'mostRecent') return this.sortedProjectsDesc
      else return this.sortedProjectsAsc
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .control {
    position: fixed;
    top: 30vh;
    right: -170px;
    width: 250px;
    transition-duration: 0.3s;
  }
  .control:hover {
    transform: translateX(-140px);
    transition-duration: 0.3s;
  }
  .my-container {
    padding: 30px;
  }
  .round {
    border-radius: 5%;
  }
</style>

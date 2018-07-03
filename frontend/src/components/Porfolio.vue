<template>
  <v-container>
    <v-layout row>
      <!-- Projects -->
      <v-flex xs11>
        <v-layout row wrap>
          <v-flex xs4 v-for="(project, index) in projectsToDisplay" :key="project.id" style="padding: 15px;">
            <Panel>
              <!-- Title -->
              <span class="name" slot="title">{{project.title}}</span>
              <!-- carousel -->
              <v-carousel slot="media" hide-delimiters hide-controls
                class="carousel black"
                :interval="delay(index)">
                <v-carousel-item
                  v-for="(image,i) in getImagePaths(project.id)[0]"
                  :key="i"
                  :src="image.imagePath"
                ></v-carousel-item>
              </v-carousel>
              <!-- description -->
              <v-layout column slot="text" style="height: 100px;">
                <p style="textAlign: left; overflow: hidden;">{{getDescriptions(project.id)[0][0]['description']}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </v-layout>
              <v-layout row slot="actions">
                <!-- Info button -->
                <v-btn>
                  info
                </v-btn>
                <v-spacer />
                <!-- Tag -->
                <v-avatar
                  class="title pink lighten-1 "
                  size="30px">
                  <v-icon dark size="20px">
                    {{app_tags[project.tag]}}
                  </v-icon>
                </v-avatar>
              </v-layout>
            </Panel>
          </v-flex>
        </v-layout>
      </v-flex>
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
                <!-- delete -->
                <v-btn
                  fab
                  small
                  dark
                  color="black">
                  <v-icon>delete</v-icon>
                </v-btn>
                <!-- cancel button -->
                <v-btn
                  fab
                  small
                  dark
                  color="pink"
                  @click="() => {edit = false}">
                  <v-icon>cancel</v-icon>
                </v-btn>
                <!-- add -->
                <v-btn
                  fab
                  small
                  dark>
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
  </v-container>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
var _ = require('lodash')
export default {
  data () {
    return {
      projects: [],
      sortOrder: 'mostRecent',
      edit: false,
      tags: [],
      descriptions: [],
      imagePaths: [],
      filter: []
    }
  },
  components: {
    Panel
  },
  async mounted () {
    await this.reloadProjects()
    this.tags = ['website', 'web-app', 'mobile-app', 'graphic-design']
    this.filter = this.tags
    window.scrollTo(0, 0)
  },
  methods: {
    async reloadProjects () {
      this.projects = await this.getProjects()
    },
    async getProjects () {
      const projects = (await ProfileService.getProfile()).data.profile.projects
      this.descriptions = (await ProfileService.getProfile()).data.profile.descriptions
      this.imagePaths = (await ProfileService.getProfile()).data.profile.imagePaths
      return projects
    },
    _filter () {
      let filtered = []

      this.filter.forEach(option => {
        let projs = this.projects.slice()
        let index = _.findLastIndex(projs, {tag: option})
        while (index >= 0) {
          if ((_.findIndex(filtered, {title: projs[index].title})) === -1) {
            filtered.push(projs[index])
          }
          projs = (index > 0) ? projs.slice(0, index) : projs.slice(1)
          index = _.findLastIndex(projs, {tag: option})
        }
      })
      return filtered
    },
    delay (factor) {
      return (factor + 4) + '000'
    },
    getDescriptions (projectId) {
      let descriptions = []

      this.descriptions.forEach(description => {
        if (description[0].ProjectId === projectId) {
          description = _.orderBy(description, ['id'], ['asc'])
          descriptions.push(description)
        }
      })
      return descriptions
    },
    getImagePaths (projectId) {
      let imagePaths = []

      this.imagePaths.forEach(path => {
        if (path[0].ProjectId === projectId) {
          imagePaths.push(path)
        }
      })
      return imagePaths
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .carousel {
    height: 200px;
  }
  .control {
    position: fixed;
    top: 10vh;
    right: 0;
    width: 240px;
  }
</style>

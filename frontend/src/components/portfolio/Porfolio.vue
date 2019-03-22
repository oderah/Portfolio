<template>
  <div class="my-container">
    <v-layout column>
      <!-- Add Project Form -->
      <NewProject v-if="add" class="left-slide" id="newProject" />
      <!-- Projects -->
      <v-layout row wrap v-if="!add && projectsLoaded">
        <v-flex lg3 md4 sm6 xs12 v-for="(project, index) in projectsToDisplay" :key="project.id" style="padding: 15px;">
          <ProjectCard :project="project" :edit="() => (edit)" :index="index" class="contacts-edit" :id="`p-${project.id}`" :reloadProjects="reloadProjects" :slideProject="slideProject" />
        </v-flex>
      </v-layout>
      <!-- Project loading -->
      <v-container class="loader" slot="media" v-if="!projectsLoaded">
        <img src="@/assets/loader.svg" alt="Loading icon." />
      </v-container>
      <!-- Control Panel -->
      <v-flex class="control control-panel-slide-in" id="control-panel">
        <v-container>
          <Panel class="education round">
            <!-- sorting -->
            <v-layout column slot="text">
              <v-menu dark top open-on-hover fixed offset-y :close-on-content-click="false">
                <v-btn dark round slot="activator" class="pink darken-4">
                  Order By
                </v-btn>
                <v-list class="pink darken-4" style="width: 200px;">
                  <v-list-tile v-for="(choice, index) in orderByChoices" :key="index">
                    <v-list-tile-title>
                      <v-layout row >
                        <v-checkbox
                          v-model="orderBy"
                          :label="choice.text"
                          :value="choice.value"
                          return-object
                          color="white">
                        </v-checkbox>
                        <transition name="sort-buttons">
                          <div v-show="orderBy === choice.value">
                            <v-icon :color="arrowColor(choice, 'up')" @click="sortOrder = 'leastRecent'">arrow_upward</v-icon>
                            <v-icon :color="arrowColor(choice, 'down')" @click="sortOrder = 'mostRecent'">arrow_downward</v-icon>
                          </div>
                        </transition>
                      </v-layout>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
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
                  @click="cancel">
                  <v-icon>cancel</v-icon>
                </v-btn>
                <!-- add -->
                <v-btn
                  fab
                  small
                  dark
                  @click="addProject">
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
      orderBy: 'release_date',
      orderByChoices: [
        {text: 'Title', value: 'title', sortOrder: 'leastRecent'},
        {text: 'Date', value: 'release_date', sortOrder: 'leastRecent'},
        {text: 'Tag', value: 'tag', sortOrder: 'leastRecent'}
      ],
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
  beforeRouteLeave (to, from, next) {
    this.transit()
    setTimeout(() => {
      next()
    }, 500)
  },
  methods: {
    // this function reloads the projects
    async reloadProjects () {
      this.projects = await this.getProjects()
      this.projects = this.projects.data.projects
      this.projectsLoaded = true // set projectsLoaded
    },
    // this function gets the projects from server
    async getProjects () {
      const projects = await ProfileService.getProjects('all')
      return projects
    },
    // this function filters the projects based on this.filter
    _filter () {
      let filtered = []

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
    },
    arrowColor (choice, type) {
      if (type === 'down') {
        return (this.sortOrder === 'mostRecent') ? 'cyan' : 'white'
      } else {
        return (this.sortOrder === 'mostRecent') ? 'white' : 'cyan'
      }
    },
    up (choice) {
      choice.sortOrder = 'leastRecent'
    },
    down (choice) {
      choice.sortOrder = 'mostRecent'
    },
    // this function applies the side away animation for all components here
    transit () {
      // slide control panel away
      let controlPanel = document.getElementById('control-panel')
      if (controlPanel) {
        controlPanel.classList.remove('control-panel-slide-in')
        controlPanel.classList.add('control-panel-slide-out')
      }

      if (this.add) {
        this.slideEditPanel() // slide edit panel if in add project mode
      } else {
        this.slideProjects() // slide projects if not in add project mode
      }
    },
    slideProject (id) {
      this.projects.forEach(project => {
        let pcard = document.getElementById(`p-${id}`)
        if (pcard) {
          pcard.classList.remove('contacts-edit')
          pcard.classList.add('abouts-edit-reverse')
        }
      })
    },
    slideProjects () {
      this.projects.forEach(project => {
        let pcard = document.getElementById(`p-${project.id}`)
        if (pcard) {
          pcard.classList.remove('contacts-edit')
          pcard.classList.add('abouts-edit-reverse')
        }
      })
    },
    slideEditPanel () {
      let form = document.getElementById('newProject')
      if (form) {
        form.classList.remove('left-slide')
        form.classList.add('left-slide-reverse')
      }
    },
    // this function exits edit mode
    cancel () {
      this.slideEditPanel() // slide edit panel away

      setTimeout(() => {
        this.edit = false
        this.add = false
      }, 500)
    },
    // this function starts the add project process
    addProject () {
      this.slideProjects() // slide projects away

      setTimeout(() => {
        this.add = true
      }, 300)
    }
  },
  computed: {
    sortedProjectsAsc: function () {
      let temp = _.orderBy(this.filteredProjects, this.orderBy, 'asc')
      return temp
    },
    sortedProjectsDesc: function () {
      let temp = _.orderBy(this.filteredProjects, this.orderBy, 'desc')
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
  .control-panel-slide-in {
    animation: control-slide 1s;
  }
  .control-panel-slide-out {
    animation: control-slide-out 0.7s;
  }
  .my-container {
    padding: 30px;
  }
  .round {
    border-radius: 5%;
  }
  .sort-buttons-enter-active, .sort-buttons-leave-active {
    transition-duration: 0.5s;
  }
  .sort-buttons-enter {
    transform: translateX(100%);
  }
  .sort-buttons-leave-to {
    transform: translateX(100%);
  }
  @keyframes control-slide {
    0% {
      transform: translateX(100vw);
    }
    50% {
      transform: translateX(-5vw);
    }
    100% {
      transform: translateX(0px);
    }
  }
  @keyframes control-slide-out {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-5vw);
    }
    100% {
      transform: translateX(100vw);
    }
  }
</style>

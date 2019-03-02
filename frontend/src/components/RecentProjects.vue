<template>
  <div>
    <v-container grid-list-md v-if="projectsLoaded">
      <v-container class="name" style="textAlign: center;">
        <h1>Recent Projects</h1>
      </v-container>
      <v-layout row wrap fill-height>
        <v-flex xs12 sm12 md6 lg4 v-for="project in projects" :key="project.title">
          <v-card class="card project-card" @click.native="goToProject(project.id)">
            <v-card-media height="100px">
              <v-container fill-height fluid>
                <!-- Card Title -->
                <v-card-title class="project-title name tech-names" primary-title>
                  <h2>{{project.title}}</h2>
                </v-card-title>
              </v-container>
            </v-card-media>
            <!-- Card Text -->
            <v-card-text style="text-align: left; overflow: hidden; height: 100px;" class="tech-names">
              {{project.Descriptions[0].description}}
            </v-card-text>
            <!-- Card Actions -->
            <v-card-actions>
              <v-btn
              @click="goToProject(project.id)">
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
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- Project loading -->
    <v-container class="my-loader" v-if="!projectsLoaded">
      <span class="app-loading">Loading...</span>
    </v-container>
  </div>
</template>

<script>
import ProfileService from '@/services/ProfileService'

export default {
  data () {
    return {
      projectsLoaded: false,
      projects: []
    }
  },
  async mounted () {
    var projects = await this.getProjects()
    this.projects = projects.data.projects
    console.log(this.projects)
    this.projectsLoaded = true
  },
  methods: {
    // this function gets the projects from server
    async getProjects () {
      const projects = await ProfileService.getProjects('recents')
      return projects
    },
    goToProject (id) {
      this.$router.push({path: `/portfolio/${id}`})
    }
  },
  computed: {
    app_tags: function () {
      return this.$store.state.tags
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  hr {
    border: 0;
    border-bottom: 2px dotted white;
    width: 50%;
    margin: auto;
  }
  h1{
    color: white;
  }
  .card {
    /* margin: 5px; */
    height: 300px;
    box-shadow: 0 2px 10px 1px;
  }
  .card:hover {
    transform: scale(1.02);
    transition-duration: 0.1s;
  }
  .project-title {
    /* color: #CFD8DC; */
    position: absolute;
    top: 30%;
    left: 0;
    /* font-weight: bold; */
  }
</style>

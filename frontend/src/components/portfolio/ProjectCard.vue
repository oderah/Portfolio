<template>
  <Panel @click.native="() => {if (!edit()) {goToProject()}}" class="project-card">
    <!-- Title -->
    <span class="name project-title tech-names" slot="title">{{project.title}}</span>
    <!-- carousel -->
    <v-carousel slot="media" hide-delimiters hide-controls
      class="carousel black"
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
          :alt="() => (`Project ${project.title}, image number ${i + 1}`)"
        />
      </v-carousel-item>
    </v-carousel>
    <v-container class="carousel my-loader" slot="media" v-if="!picturesLoaded">
      <span class="app-loading tech-names">Loading...</span>
    </v-container>
    <v-layout column slot="text" style="height: 100px;" class="tech-names">
      <p style="textAlign: left; overflow: hidden;">{{project.Descriptions[0].description || ''}}</p>
    </v-layout>
    <v-layout row slot="actions">
      <!-- Info button -->
      <v-btn
      dark
      round>
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
         v-if="edit()">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-layout>
  </Panel>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'

export default {
  data () {
    return {
      picturesLoaded: false
    }
  },
  mounted () {
    let count = 0
    // load pictures
    this.loadPictures(() => {
      count++
      if (count === this.project.ImagePaths.length) { // all pictures loaded
        this.picturesLoaded = true // set picturesLoaded
      }
    })
  },
  components: {
    Panel
  },
  props: {
    project: Object,
    edit: Function
  },
  methods: {
    // this function navigates to the project with the specified id
    goToProject () {
      this.$router.push({path: `/portfolio/${this.project.id}`})
    },
    // this function deletes the project specified by id
    deleteProject (id) {
      if (confirm('Are you sure you want to delete this project?')) {
        this.projectsLoaded = false // set projectsLoaded
        this.picturesLoaded = false // set picturesLoaded
        ProfileService.deleteProject(id).then(res => {
          this.reloadProjects()
        })
      }
    },
    // this function requests image from backend
    async processPath (id, callback) {
      ProfileService.loadImage(id).then(res => {
        callback(res.data)
      })
    },
    // this function loads all the pictures from the server
    loadPictures (callback) {
      this.project['pictures'] = [] // add new key 'pictures' of type array to project

      // process each imagePath in project
      this.project.ImagePaths.forEach(path => {
        this.processPath(path.id, (img) => {
          img = img.data // image as a buffer

          // the next steps convert buffer to image
          var arrayBufferView = new Uint8Array(img) // convert buffer to Uint8Array
          var blob = new Blob([arrayBufferView], {type: 'image/jpeg'}) // create blob form Uint8Array
          var urlCreator = window.URL || window.webkitURL
          var imageUrl = urlCreator.createObjectURL(blob) // create URL from blob

          this.project.pictures.push(imageUrl) // add to pictures array in project
          callback()
        })
      })
    }
  },
  computed: {
    app_tags: function () {
      return this.$store.state.tags
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
.project-title {
  font-size: 2em;
}
</style>

<template>
  <Panel @click.native="() => {if (!edit()) {goToProject()}}" class="project-card">
    <!-- Title -->
    <span class="name project-title tech-names" slot="title">{{project.title}}</span>
    <!-- carousel -->
    <v-carousel slot="media" hide-delimiters hide-controls
      class="carousel black"
      v-if="picturesLoaded"
      :interval="delay(index)"
      >
      <v-carousel-item
        v-for="(image,i) in project.ImagePaths"
        :key="i"
        @error="missingImage"
      >
        <img
          :id="'p' + project.id + '_' + image.id"
          :src="image.imagePath"
          :alt="() => (`Project ${project.title}, image number ${i + 1}`)"
        />
      </v-carousel-item>
    </v-carousel>
    <v-container class="loader" slot="media" v-if="!picturesLoaded">
      <img src="@/assets/loader.svg" alt="Loading icon." />
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
        size="30px"
        id="tag">
        <v-icon dark size="20px">
          {{app_tags[project.tag]}}
        </v-icon>
      </v-avatar>
      <!-- delete -->
      <transition name="sort-buttons">
        <v-btn
          fab
          small
          dark
          flat
          color="red"
          @click="deleteProject(project.id)"
           v-if="check()">
          <v-icon>cancel</v-icon>
        </v-btn>
      </transition>
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
    this.factor = this.index
    // let count = 0
    // load pictures
    if (this.project.ImagePaths.length > 0) this.picturesLoaded = true
    // this.loadPictures(() => {
    //   count++
    //   if (count === this.project.ImagePaths.length) { // all pictures loaded
    //     this.picturesLoaded = true // set picturesLoaded
    //   }
    // })
  },
  components: {
    Panel
  },
  props: {
    project: Object,
    edit: Function,
    index: Number,
    reloadProjects: Function,
    slideProject: Function
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

        // show deleting toast
        this.$toasted.show(`Deleting project: ${this.project.title}`, this.$store.state.toast)
        ProfileService.deleteProject(id).then(res => {
          // show deleted toast
          this.$toasted.show(`Project deleted`, this.$store.state.successToast)
          this.slideProject(this.project.id)

          setTimeout(() => {
            this.reloadProjects()
          }, 300)
        }).catch(err => {
          this.$toasted.show(`Oops something went wrong!!`, this.$store.state.errorToast)
          console.log(err)
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
    },
    check () {
      let tag = document.getElementById('tag')
      // console.log('tag', tag)

      if (this.edit()) {
        if (tag) {
          tag.classList.add('slide-tag')
        }
        return true
      } else {
        if (tag) {
          tag.classList.remove('slide-tag')
        }
        return false
      }
    },
    // this function calculated the delay based on factor
    delay () {
      return (this.index + 4) * 1000
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
.sort-buttons-enter-active, .sort-buttons-leave-active {
  /* transition-duration: 0.5s; */
  animation: slide-right 0.3s reverse;
}
.sort-buttons-enter, .sort-buttons-leave-to {
  /* transform: translateX(80%); */
  animation: slide-right 0.3s;
}
.slide-tag {
  transform: translateX(-2%);
}
@keyframes slide-right {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(70%);
    display: none;
  }
}
</style>

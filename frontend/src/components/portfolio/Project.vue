<template>
  <v-flex lg10 class="flex-lg8 contacts-edit" id="flex_lg8">
    <v-layout column v-if="this.$store.state.admin && !edit" class="admin-options">
      <!-- edit button -->
      <v-btn
        fab
        dark
        small
        color="cyan"
        @click="editProject">
        <v-icon>edit</v-icon>
      </v-btn>
      <!-- delete -->
      <v-btn
        small
        fab
        dark
        color="pink"
        @click="deleteProject">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-layout>
    <Panel>
      <div slot="text">
        <v-container v-if="loaded && !edit">
          <div class="name">
            <h1 class="project-title">{{project.title}}
              <!-- Tag -->
              <span>
                <v-avatar
                  class="title cyan"
                  size="30px">
                  <v-icon dark size="20px">
                    {{app_tags[project.tag]}}
                  </v-icon>
                </v-avatar>
              </span>
            </h1>
          </div>
          <p><em>Released on: {{project.release_date}}</em><br />
            <a :href="project.repo" target="_blank" v-if="project.tag !== 'graphic-design'">code repo</a><br />
            <a :href="link" target="_blank" v-if="project.tag !== 'graphic-design'">live link</a>
          </p>
          <div v-if="technologies.length > 0">
            <h2>Technologies Used</h2>
            <ul>
              <li v-for="(tech, index) in technologies" :key="index">
                {{tech.tech}}
              </li>
            </ul>
          </div>
          <v-layout class="descriptions" column>
            <h2>Description</h2>
            <p class="paragraph" v-for="(description, index) in descriptions" :key="index">{{description.description}}</p>
          </v-layout>
          <!-- Images -->
          <Panel class="black contacts-edit" v-if="picsLoaded && !noPics" id="images">
            <h2 slot="title" class="tech-names">Images</h2>
            <v-layout column slot="text">
              <v-carousel
                class="carousel black"
                :interval="4000">
                <v-carousel-item
                  v-for="(image,i) in pictures"
                  :key="i"
                  @error="missingImage"
                >
                  <img
                    :id="'p' + i"
                    :src="image.url"
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
        <v-container class="my-loader" v-if="!loaded && !edit">
          <span>Loading...</span>
        </v-container>
        <!-- Edit -->
        <v-container v-if="loaded && edit">
          <br />
          <v-form ref="form">
            <Panel _class="cyan" class="grey darken-4 left-slide" id="edit-main-panel">
              <h1 slot="title" class="name">Project Info</h1>
              <v-layout column slot="text">
                <!-- title -->
                <v-text-field
                  v-model="changes.title"
                  label="Title"
                  :rules="[rules.required]"
                  solo dark clearable
                  autofocus>
                </v-text-field>
                <br />
                <v-layout row>
                  <!-- link -->
                  <v-text-field
                    solo dark
                    v-model="changes._link"
                    label="Live link"
                    clearable
                    :rules="[rules.required]">
                  </v-text-field>
                  <v-spacer></v-spacer>
                  <!-- repo -->
                  <v-text-field
                    solo dark
                    v-model="changes.repo"
                    label="Link to code"
                    clearable
                    :rules="[rules.required]">
                  </v-text-field>
                </v-layout>
                <br />
                <!-- release date -->
                <v-text-field
                  v-model="changes.release_date"
                  label="Release date"
                  solo dark
                  clearable
                  :rules="[rules.required]">
                </v-text-field>
                <br />
                <!-- tags -->
                <v-select
                  :items="tags"
                  v-model="changes.tag"
                  solo dark
                  label="Select tag"
                  :rules="[rules.required]"
                ></v-select>
                <br />
                <!-- techs -->
                <v-select
                  :items="allTechs"
                  item-text="tech"
                  item-value="id"
                  return-object
                  v-model="changes.Teches"
                  solo dark
                  clearable
                  multiple
                  label="Select techs"
                  :rules="[rules.techs]"
                ></v-select>
                <br />
                <!-- new tech -->
                <v-checkbox label="Add new technologies"
                  v-model="checkbox"
                  dark
                  value="checked"
                >
                </v-checkbox>
                <v-text-field
                  v-model="newTechs"
                  hint="Separate technologies by comma ','"
                  solo dark clearable
                  :rules="[rules.required]"
                  v-if="createNewTech">
                </v-text-field>
                <br />
                <!-- description -->
                <v-text-field
                  v-model="changes.description"
                  label="Description"
                  textarea
                  solo
                  dark
                  box
                  clearable
                  hint="You must double space paragraphs!!"
                  :rules="[rules.required]">
                </v-text-field>
              </v-layout>
            </Panel>
            <br />
            <Panel _class="pink darken-4" class="grey darken-4 right-slide" id="edit-images-panel">
              <h1 slot="title" class="name tech-names">Images</h1>
              <v-layout column slot="text">
                <v-layout row wrap v-if="picsLoaded">
                  <v-flex xs6 sm3 md2 lg2 class="thumbnail contacts-edit" v-for="image in changes.pictures" :key="image.id">
                    <img :src="image.url" :alt="'thumbnail for image ' + image.id" />
                    <!-- delete -->
                    <v-btn
                      fab
                      small
                      dark
                      flat
                      color="red"
                      class="thumbnail-delete"
                      @click="deleteImage(image.id)">
                      <v-icon>cancel</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-container class="my-loader" v-if="!picsLoaded">
                  <span class="app-loading">Loading...</span>
                </v-container>
                <br />
                <!-- new images -->
                <v-checkbox label="Add new pictures"
                  v-model="newImagesCheck"
                  dark
                  value="checked"
                  class="contacts-edit"
                >
                </v-checkbox>
                <!-- new images -->
                <div v-if="addNewImages" class="contacts-edit">
                  <!-- display for selected files -->
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs6 sm3 md2 lg2 class="thumbnail" v-for="(file, index) in files" :key="index">
                        <img :src="file.url" />
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <!-- select files -->
                  <input style="display: none;" type="file" name='photos' multiple @change="filesChanged" ref="upload" />
                  <v-btn
                    color="blue-grey"
                    class="white--text"
                    round
                    @click="$refs.upload.click()">
                    Upload
                    <v-icon right dark>cloud_upload</v-icon>
                  </v-btn>
                </div>
              </v-layout>
            </Panel>
          </v-form>
        </v-container>
        <!-- <br /> -->
      </div>
    </Panel>
    <v-layout column v-if="this.$store.state.admin && edit" row wrap class="admin-options contacts-edit">
      <!-- cancel -->
      <v-btn
        fab
        dark
        small
        color="red"
        @click="cancel">
        <v-icon>cancel</v-icon>
      </v-btn>
      <!-- save -->
      <v-btn
        fab
        dark
        small
        color="cyan darken-4"
        @click="save">
        <v-icon>save</v-icon>
      </v-btn>
    </v-layout>
    <br />
  </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
var _ = require('lodash')
export default {
  data () {
    return {
      project: {},
      loaded: false, // projects loaded toggle
      picsLoaded: false, // pictures loaded toggle
      noPics: false, // project has no pictures toggle
      pictures: [],
      edit: false,
      allTechs: [], // all technologies currently in system
      checkbox: '', // new technologies checkbox
      newImagesCheck: '', // new images checkbox
      addNewImages: false, // new images toggle
      newTechs: '',
      createNewTech: false, // new technologies toggle
      tags: Object.keys(this.$store.state.tags), // all tags from system store
      changes: {}, // edit changes
      rules: {
        required: value => !!value || 'Required',
        techs: value => (this.changes.Teches.length > 0 || this.newTechs.length > 0) || 'Required'
      },
      files: []
    }
  },
  async created () {
    // get project
    ProfileService.getProject(this.$route.params.id).then(async res => {
      this.project = res.data.project
      console.log('project', this.project)
      this.loaded = true

      // load pictures
      this.loadPictures((pictures) => {
        this.pictures = pictures
        this.picsLoaded = true
      })
    })
  },
  mounted () {
    // get all techs from server
    ProfileService.getAllTechs().then(techs => {
      this.allTechs = techs.data.techs
      console.log('allTechs', this.allTechs)
    })
  },
  beforeRouteLeave (to, from, next) {
    this.slideAway() // slide all components away

    setTimeout(() => {
      next()
    }, (this.edit) ? 800 : 300)
  },
  components: {
    Panel
  },
  methods: {
    // this function stores new selected files
    filesChanged (e) {
      this.files = [] // reset files
      for (var i = 0; i < e.target.files.length; ++i) {
        let file = e.target.files[i]
        let url = URL.createObjectURL(file) // create image url
        this.files.push({file: file, url: url})
      }
    },
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
            pictures.push({id: path.id, url: imageUrl})

            callback(pictures)
          })
        })
      }
    },
    // this function resets unsaved changes
    resetChanges () {
      this.files = [] // empty out this.files
      this.newImagesCheck = '' // uncheck new images checkbox

      // prepare descriptions
      let description = ''
      this.project.Descriptions.forEach(desc => {
        description += desc.description + '\n\n' // merge descriptions into string variable
      })

      description = description.trim() // trim extra white space

      this.changes = {...this.project, description: description, imagesToDelete: [], pictures: this.pictures} // add to this.changes
    },
    // this function toggles to edit mode
    editProject () {
      this.resetChanges() // reset changes

      this.slide(false) // slide only images away
      setTimeout(() => {
        this.edit = true
      }, 500)
    },
    // this marks the image specified by id for removal
    deleteImage (id) {
      this.changes.imagesToDelete.push(id)
      let original = [...this.changes.pictures]
      _.remove(original, pic => pic.id === id)
      this.changes.pictures = original
      // console.log('changes', this.changes)
    },
    // this function prepares data for submission
    prepareData () {
      // split description into array
      const projDescriptions = this.changes.description.trim().split('\n\n')
      let descriptions = []

      projDescriptions.forEach(desc => {
        descriptions.push(desc)
      })

      // create new formdata
      var data = new FormData()
      data.append('title', this.changes.title)
      data.append('_link', this.changes._link)
      data.append('repo', this.changes.repo)
      data.append('tag', this.changes.tag)
      data.append('release_date', this.changes.release_date)
      data.append('descriptions', JSON.stringify(descriptions))
      data.append('techs', JSON.stringify(this.changes.Teches))
      data.append('newTechs', this.newTechs)
      data.append('imagesToDelete', JSON.stringify(this.changes.imagesToDelete))

      // append pictured to formdata
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]
        data.append('photos', file.file)
      }

      return data
    },
    // this function saves the changes made
    save () {
      if (this.$refs.form.validate()) {
        console.log('files', this.files)
        console.log('save', this.changes)

        // prepare data
        let data = this.prepareData()
        console.log('data', data)

        // submit formdata to server
        ProfileService.editProject(this.project.id, data).then((res) => {
          // on success reroute to project view
          // this.$router.push({path: `/portfolio/${res.data.id}`})
          this.slideEditOptions() // slide edit components away
          setTimeout(() => {
            this.$router.go()
          }, 300)
        }).catch(err => {
          console.log(err)
          alert('Oops, something is wrong, could not add project!')
        })
      }
    },
    // this function cancels the edit operation
    cancel () {
      this.slideEditOptions()

      setTimeout(() => {
        this.resetChanges() // reset unsaved changes

        this.edit = false
      }, 500)
    },
    // this function deletes the project specified by id
    deleteProject () {
      if (confirm('Are you sure you want to delete this project?')) {
        ProfileService.deleteProject(this.project.id).then(() => {
          this.$router.push({path: '/portfolio'})
        })
      }
    },
    // this function slides the edit components away
    slideEditOptions () {
      let mainPanel = document.getElementById('edit-main-panel')
      let imagesPanel = document.getElementById('edit-images-panel')

      if (mainPanel) {
        mainPanel.classList.remove('left-slide')
        mainPanel.classList.add('left-slide-reverse')
      }
      if (imagesPanel) {
        imagesPanel.classList.remove('right-slide')
        imagesPanel.classList.add('right-slide-reverse')
      }
    },
    // this function slides non edit components
    slide (slideMain = true) {
      let images = document.getElementById('images')
      if (images) {
        images.classList.remove('contacts-edit')
        images.classList.add('abouts-edit-reverse')
      }

      if (slideMain) {
        let flexlg8 = document.getElementById('flex_lg8')
        if (flexlg8) {
          flexlg8.classList.remove('contacts-edit')
          flexlg8.classList.add('abouts-edit-reverse')
        }
      }
    },
    // this function slides all components away
    slideAway () {
      if (this.edit) {
        this.cancel() // clear edits and slide edit components away
      }

      setTimeout(() => {
        this.slide()
      }, (this.edit) ? 500 : 0)
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
    }
  },
  watch: {
    // watches checkbox, on change, adjust this,createNewTech
    checkbox: function () {
      (this.checkbox === 'checked') ? this.createNewTech = true : this.createNewTech = false
    },
    newImagesCheck: function () {
      (this.newImagesCheck === 'checked') ? this.addNewImages = true : this.addNewImages = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .admin-options {
    position: fixed;
    bottom: 5vh;
    right: 0;
    z-index: 2;
  }
  .carousel {
    height: auto;
    max-height: 60vh;
    width: 90%;
    margin: 0 auto;
  }
  .carousel img {
    height: auto;
    max-height: 60vh;
    width: auto;
    max-width: 100%;
    orientation: from-image;
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
  .thumbnail-delete {
    position: relative;
    top: -120%;
    right: -40%;
  }
</style>

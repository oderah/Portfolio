<template>
  <v-flex lg10 class="flex-lg8">
    <v-layout column v-if="this.$store.state.admin && !edit" class="admin-options">
      <!-- edit button -->
      <v-btn
        fab
        dark
        small
        color="cyan"
        @click="editProject()">
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
        <a :href="project.repo" v-if="project.tag !== 'graphic-design'">code repo</a><br />
        <a :href="link" v-if="project.tag !== 'graphic-design'">live link</a>
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
        <Panel _class="cyan" class="grey darken-4">
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
        <Panel _class="pink darken-4" class="grey darken-4">
          <h1 slot="title" class="name tech-names">Images</h1>
          <v-layout column slot="text">
            <v-layout row wrap v-if="picsLoaded">
              <v-flex xs6 sm3 md2 lg2 class="thumbnail" v-for="image in changes.pictures" :key="image.id">
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
            >
            </v-checkbox>
            <!-- new images -->
            <div v-if="addNewImages">
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
        <v-layout row wrap class="form-btns">
          <!-- cancel -->
          <v-btn
            fab
            dark
            color="red"
            @click="cancel">
            <v-icon>cancel</v-icon>
          </v-btn>
          <!-- save -->
          <v-btn
            fab
            dark
            color="cyan darken-4"
            @click="save">
            <v-icon>save</v-icon>
          </v-btn>
        </v-layout>
      </v-form>
    </v-container>
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

      this.edit = true
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
          this.$router.go()
        }).catch(err => {
          console.log(err)
          alert('Oops, something is wrong, could not add project!')
        })
      }
    },
    // this function cancels the edit operation
    cancel () {
      this.resetChanges() // reset unsaved changes

      this.edit = false
    },
    // this function deletes the project specified by id
    deleteProject () {
      if (confirm('Are you sure you want to delete this project?')) {
        ProfileService.deleteProject(this.project.id).then(() => {
          this.$router.push({path: '/portfolio'})
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
  .form-btns {
    position: fixed;
    bottom: 3vh;
    right: 5vw;
  }
</style>

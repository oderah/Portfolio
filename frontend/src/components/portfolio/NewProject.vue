<template>
  <v-container>
    <v-flex xs12 sm10 class="flex-lg8">
      <Panel _class="pink darken-4" class="grey darken-4">
        <h1 slot="title" class="tech-names">Add a New Project</h1>
        <v-form slot="text" ref="form" enctype="multipart/form-data">
          <!-- title -->
          <v-text-field
            v-model="title"
            label="Title"
            solo dark
            clearable
            :rules="[rules.required]"
            autofocus>
          </v-text-field>
          <br />
          <v-layout row>
            <!-- link -->
            <v-text-field
              solo dark
              v-model="link"
              label="Live link"
              clearable
              :rules="[rules.required]">
            </v-text-field>
            <v-spacer></v-spacer>
            <!-- repo -->
            <v-text-field
              solo dark
              v-model="repo"
              label="Link to code"
              clearable
              :rules="[rules.required]">
            </v-text-field>
          </v-layout>
          <br />
          <!-- release date -->
          <v-text-field
            solo dark
            v-model="releaseDate"
            label="Release Date"
            clearable
            :rules="[rules.required]">
          </v-text-field>
          <br />
          <!-- tags -->
          <v-select
            :items="tags"
            v-model="tag"
            solo dark
            label="Select tag"
            :rules="[rules.required]"
          ></v-select>
          <br />
          <!-- techs -->
          <v-select
            :items="allTechs"
            item-text="tech"
            return-object
            v-model="techs"
            solo dark
            clearable
            multiple
            label="Select techs"
            :rules="[rules.required]"
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
            solo dark
            :rules="[rules.required]"
            v-if="createNewTech">
          </v-text-field>
          <!-- description -->
          <v-text-field
            v-model="description"
            label="Description"
            textarea
            dark
            solo
            box
            clearable
            hint="You must double space paragraphs!!"
            :rules="[rules.required]">
          </v-text-field>
          <!-- display for selected files -->
          <v-container>
            <v-layout row wrap>
              <v-flex xs6 sm3 md2 lg2 class="thumbnail" v-for="(file, index) in files" :key="index">
                <img :src="file.url" />
                <span>{{file.file.name}}</span>
              </v-flex>
            </v-layout>
          </v-container>
          <!-- select files -->
          <input style="display: none;" type="file" name='pictures' multiple @change="filesChanged" ref="upload" />
          <v-btn
            round
            color="blue-grey"
            class="white--text"
            @click="$refs.upload.click()">
            Upload
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
          <!-- add -->
          <v-btn
            dark
            round
            class="pink darken-4"
            @click="addProject">
            Add
          </v-btn>
        </v-form>
      </Panel>
    </v-flex>
  </v-container>
</template>

<script>
import Panel from '@/components/Panel'
import ProfileService from '@/services/ProfileService'
export default {
  data () {
    return {
      title: '',
      releaseDate: '',
      tag: '',
      tags: ['website', 'web-app', 'mobile-app', 'graphic-design'],
      link: '',
      repo: '',
      description: '',
      files: [],
      techs: '',
      allTechs: [],
      checkbox: '',
      newTechs: '',
      createNewTech: false,
      rules: {
        required: value => !!value || 'Required'
      }
    }
  },
  mounted () {
    // get all techs from server
    ProfileService.getAllTechs().then(techs => {
      this.allTechs = techs.data.techs
    })
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
    // this function adds the new project
    async addProject () {
      if (this.$refs.form.validate()) { // validate form
        // split description into array
        const projDescriptions = this.description.trim().split('\n\n')
        let descriptions = []

        projDescriptions.forEach(desc => {
          descriptions.push(desc)
        })

        // create new formdata
        let data = new FormData()
        data.append('title', this.title)
        data.append('_link', this.link)
        data.append('repo', this.repo)
        data.append('tag', this.tag)
        data.append('releaseDate', this.releaseDate)
        data.append('descriptions', JSON.stringify(descriptions))
        data.append('techs', JSON.stringify(this.techs))
        data.append('newTechs', this.newTechs)

        // append pictured to formdata
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i]
          data.append('pictures', file.file)
        }

        // submit formdata to server
        ProfileService.addProject(data).then((res) => {
          // on success reroute to project view
          this.$router.push({path: `/portfolio/${res.data.id}`})
        }).catch(err => {
          console.log(err)
          alert('Oops, something is wrong, could not add project!')
          // this.$router.push({path: '/'})
        })
      }
    }
  },
  watch: {
    // watches checkbox, on change, adjust this,createNewTech
    checkbox: function () {
      (this.checkbox === 'checked') ? this.createNewTech = true : this.createNewTech = false
    }
  },
  components: {
    Panel
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .files {
    margin: 0 5px;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 2px 1px 15px 1px;
  }
</style>

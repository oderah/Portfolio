<template>
  <v-flex xs10>
    <Panel _class="pink darken-4">
      <h1 slot="title" class="tech-names">Add a New Project</h1>
      <v-form slot="text" ref="form" enctype="multipart/form-data">
        <!-- title -->
        <v-text-field
          v-model="title"
          label="Title"
          :rules="[rules.required]"
          autofocus>
        </v-text-field>
        <!-- release date -->
        <v-text-field
          v-model="releaseDate"
          label="Release Date"
          :rules="[rules.required]">
        </v-text-field>
        <!-- tags -->
        <v-select
          :items="tags"
          v-model="tag"
          solo
          label="Select tag"
          :rules="[rules.required]"
        ></v-select>
        <!-- link -->
        <v-text-field
          v-model="link"
          label="Link"
          :rules="[rules.required]">
        </v-text-field>
        <!-- description -->
        <v-text-field
          v-model="description"
          label="Description"
          textarea
          clearable
          hint="You must double space paragraphs!!"
          :rules="[rules.required]">
        </v-text-field>
        <!-- display for selected files -->
        <v-container>
          <v-layout row>
            <v-list xs1 v-for="(file, index) in files" :key="index">
              <span class="cyan files"><v-icon dark>present_to_all</v-icon> {{file.name}}</span>
            </v-list>
          </v-layout>
        </v-container>
        <!-- select files -->
        <input style="display: none;" type="file" name='pictures' multiple @change="filesChanged" ref="upload" />
        <v-btn
          color="blue-grey"
          class="white--text"
          @click="$refs.upload.click()">
          Upload
          <v-icon right dark>cloud_upload</v-icon>
        </v-btn>
        <!-- add -->
        <v-btn
          dark
          class="pink darken-4"
          @click="addProject">
          Add
        </v-btn>
      </v-form>
    </Panel>
  </v-flex>
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
      description: '',
      files: [],
      rules: {
        required: value => !!value || 'Required'
      }
    }
  },
  methods: {
    // this function stores new selected files
    filesChanged (e) {
      this.files = e.target.files
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
        data.append('tag', this.tag)
        data.append('releaseDate', this.releaseDate)
        data.append('descriptions', JSON.stringify(descriptions))

        // append pictured to formdata
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i]
          data.append('pictures', file)
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

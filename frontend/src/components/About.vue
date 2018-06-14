<template>
  <v-container>
    <br >
    <!-- Name -->
    <v-flex xs12>
      <Panel _class="pink-gradient tech">
        <v-container slot="title" class="name">
          <h1>{{profile.firstName}} {{profile.lastName}}</h1>
        </v-container>
        <v-container slot="text">
          <v-layout row wrap>
            <v-flex v-for="title in profile.titles" :key="title.id">
              <h2>{{title.title}}</h2>
            </v-flex>
          </v-layout>
        </v-container>
      </Panel>
    </v-flex>
    <br >
    <!-- Education -->
    <v-flex xs12>
      <Panel class="education">
        <v-container slot="title">
          <h2 class="name">Education</h2>
        </v-container>
        <v-container slot="title">
          <v-layout row wrap>
            <v-flex xs3 offset-xs1 v-for="ed in profile.programs" :key="ed.id">
              <v-card class="_card">
                <v-card-media class="cyan darken-2">
                  <v-card-title>
                    <v-container class="ed">{{ed.institution}}</v-container>
                  </v-card-title>
                </v-card-media>
                <v-card-text class="text">
                  <h3>{{ed.title}}</h3>
                  <p>{{ed.credential}}</p>
                </v-card-text>
                <v-card-actions>
                  <p>from: {{ed.start}}</p>
                  <v-spacer />
                  <p>to: {{ed.end}}</p>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </Panel>
    </v-flex>
    <br >
    <!-- Skill -->
    <v-flex xs12>
      <Panel _class="pink-gradient">
        <v-container slot="title">
          <h2 class="name tech-names">Skills</h2>
        </v-container>
        <v-layout row wrap slot="text">
          <v-flex xs1 offset-xs1 v-for="skill in profile.skills" :key="skill.id">
            <v-container>
              <h3>{{skill.skill}}</h3>
            </v-container>
          </v-flex>
        </v-layout>
      </Panel>
    </v-flex>
    <br >
    <!-- Tech -->
    <v-flex xs12>
      <Panel class="education">
        <v-container slot="title">
          <h2 class="name">Technologies</h2>
        </v-container>
        <v-layout row wrap slot="text">
          <v-flex xs1 offset-xs1 v-for="tech in profile.techs" :key="tech.id">
            <v-container class="tech-names">
              <h3>{{tech.tech}}</h3>
            </v-container>
          </v-flex>
        </v-layout>
      </Panel>
    </v-flex>
    <br >
    <!-- About -->
    <v-flex xs12>
      <Panel _class="pink-gradient">
        <v-container slot="title">
          <h2 class="name tech-names">A little about Me</h2>
        </v-container>
        <v-layout column wrap slot="text">
          <v-flex xs10 offset-xs1 v-for="about in profile.abouts" :key="about.id">
            <v-container class="paragraph">
              <h4>{{about.paragraph}}</h4>
            </v-container>
          </v-flex>
        </v-layout>
      </Panel>
    </v-flex>
    <br >
    <br >
    <br >
  </v-container>
</template>

<script>
import ProfileService from '@/services/ProfileService'
import Panel from '@/components/Panel'
export default {
  data () {
    return {
      profile: {}
    }
  },
  async mounted () {
    this.profile = (await this.getProfile()).data.profile
  },
  components: {
    Panel
  },
  methods: {
    async getProfile () {
      console.log('getProfile')
      const profile = await ProfileService.getProfile()
      return profile
    },
    async setProfile (profile) {
      const response = await ProfileService.setProfile(profile)
      return response
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ._card {
    /* border-radius: 50%; */
    box-shadow: 0 2px 20px 0;
  }
  ._card:hover {
    transform: scale(1.025);
    transition-duration: 0.2s;
  }
  .ed {
    color: #CFD8DC;
    text-align: center;
    font-size: 15px;
    /* background: radial-gradient(circle at top right, #880E4F, #9C3F70, #D45699, #9C3F70, #90A4AE); */
  }
  .education {
    background: radial-gradient(circle at top left, #006064, #0097A7, cyan, #0097A7, #90A4AE);
  }
  .name {
    text-align: right;
    font-size: 20px;
    font-family: cursive;
  }
  .paragraph {
    text-align: left;
  }
  .tech {
    /* background: linear-gradient(to right, #880E4F, #9C3F70, #D45699, #9C3F70); */
    background: radial-gradient(circle at top left, #880E4F, #9C3F70, #D45699)
  }
  .tech-names {
    color: #CFD8DC;
  }
  .text {
    box-shadow: 0 -5px 20px 0;
  }
</style>

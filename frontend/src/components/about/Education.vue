<template>
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
      <v-flex xs1 offset-xs11 slot="actions" v-if="this.$store.state.admin">
        <v-btn fab small>
          <v-icon size="20px">edit</v-icon>
        </v-btn>
      </v-flex>
    </Panel>
  </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
export default {
  components: {
    Panel
  },
  props: {
    profile: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ._card {
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
</style>

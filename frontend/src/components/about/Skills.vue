<template>
  <v-flex xs12>
    <Panel class="pink-gradient">
      <v-container slot="title">
        <h2 class="name tech-names">Skills</h2>
      </v-container>
      <v-layout row wrap slot="text">
        <v-flex xs1 offset-xs1 v-for="skill in profile.skills" :key="skill.id">
          <v-container class="tech-names">
            <h3>{{skill.skill}}</h3>
          </v-container>
        </v-flex>
      </v-layout>
      <v-flex xs1 offset-xs11 slot="actions" v-if="this.$store.state.admin">
        <v-btn fab small dark>
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

</style>

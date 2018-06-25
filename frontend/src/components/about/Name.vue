<template>
  <v-flex xs12>
    <!-- <Panel _class="pink-gradient tech"> -->
    <Panel class="header">
      <v-container slot="title" class="name">
        <h1>{{profile.firstName}} {{profile.lastName}}</h1>
      </v-container>
      <v-container slot="text">
        <v-layout row wrap class="tech-names">
          <v-flex v-for="title in profile.titles" :key="title.id">
            <hr >
            <h2>{{title.title}}</h2>
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
  .header {
    background-color: #212121
  }
</style>

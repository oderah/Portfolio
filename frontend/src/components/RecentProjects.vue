<template>
  <v-container grid-list-md>
    <h1>Recent Projects</h1>
    <!-- <br /> -->
    <hr />
    <!-- <br /> -->
    <v-layout row wrap fill-height>
      <v-flex xs4 v-for="project in projects" :key="project.title">
        <v-card style="margin: 5px;" class="card">
          <!-- Card Media -->
          <v-card-media
            :src="project.src"
            height="100px">
            <v-container fill-height fluid>
              <!-- Card Title -->
              <v-card-title class="project-title" primary-title>
                {{project.title}}
              </v-card-title>
            </v-container>
          </v-card-media>
          <!-- Card Text -->
          <v-card-text>
            {{cardtext}}
          </v-card-text>
          <!-- Card Actions -->
          <v-card-actions>
            <v-btn flat>
              info
            </v-btn>
            <v-spacer />
            <!-- Tag -->
            <v-avatar
              class="title pink lighten-1"
              size="30px">
              <v-icon dark size="20px">
                {{tags[project.tag]}}
              </v-icon>
            </v-avatar>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      cardtitle: 'Card Title',
      cardtext: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      tags: {
        'graphic-design': 'bubble_chart',
        'mobile-app': 'smartphone',
        'website': 'desktop_mac',
        'web-app': 'laptop_mac',
        'software': 'android'
      },
      projects: [
        {
          title: '1',
          tag: 'website',
          src: 'https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          title: '2',
          tag: 'graphic-design',
          src: require('@/assets/Landing.png')
        },
        {
          title: '3',
          tag: 'software',
          src: 'https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          title: '4',
          tag: 'web-app',
          src: 'https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          title: '5',
          tag: 'mobile-app',
          src: 'https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  hr {
    border: 0;
    border-bottom: 2px dotted white;
    width: 50%;
    margin: auto;
  }
  h1{
    color: white;
  }
  .card:hover {
    transform: scale(1.05);
    transition-duration: 0.1s;
  }
  .project-title {
    color: #CFD8DC;
    position: absolute;
    top: 0;
    left: 0;
    font-weight: bold;
  }
</style>

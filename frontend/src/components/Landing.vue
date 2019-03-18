<template>
  <Jumbotron ref="jumbotron" class="left-slide" />
</template>

<script>
import Jumbotron from './Jumbotron'
export default {
  data () {
    return {

    }
  },
  beforeRouteLeave (to, from, next) {
    this.$refs.jumbotron.slideAway()

    setTimeout(() => {
      this.$refs.jumbotron._vnode.elm.classList.remove('left-slide')
      this.$refs.jumbotron._vnode.elm.classList.add('left-slide-reverse')
    }, 300)

    setTimeout(() => {
      next()
    }, 700)
  },
  components: {
    Jumbotron
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

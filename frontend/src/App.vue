<template>
  <div id="app">
    <searcher id="search"></searcher>
    <team id="team"></team>
  </div>
</template>

<script>
import Team from './components/team.vue'
import Searcher from './components/searcher.vue'

export default {
  name: 'app',
  components: {
  	Team,
    Searcher
  }
}
</script>

<style scoped>

#app {
	display: flex;
	flex-direction: row;
}

#search {
	flex: 25%;
}

#team {
  margin: auto;
	flex: 50%;
}

</style>

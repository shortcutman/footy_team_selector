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
}

#search {
  margin: 10px;
}

@media (max-width: 414px) { /* small screens */
  #app {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  #team {
    width: 100%;
  }
}

@media (min-width: 415px) { /* big screens */
  #app {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }

  #search {
    max-width: 250px;
  }
}

</style>

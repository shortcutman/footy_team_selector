<template>
  <div>
    <h1 id="header">AFL Team Selector</h1>
    <hr id="rule">
    <div id="app">
      <searcher id="search"></searcher>
      <team id="team"></team>
    </div>
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

* {
  font-family: sans-serif;
}

#header {
  font-family: Futura;
  font-style: italic;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0pt;
}

#rule {
  border: 0.5pt solid grey;
}

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

  #rule {
    width: 100%
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

  #rule {
    width: 500pt;
  }

  #search {
    max-width: 250px;
  }
}

</style>

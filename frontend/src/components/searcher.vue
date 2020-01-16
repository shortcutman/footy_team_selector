<template>
<div>
	<div>
		<span>Search for player: <input type="text" name="query" v-model="query"></span>
	</div>
	<div>
		<ul v-for="result in findPlayer">
			<li>{{ result.number }}: {{ result.firstname }} {{ result.lastname }}</li>
		</ul>
	</div>
</div>
</template>

<script>
import gql from 'graphql-tag'

export default {
	name: 'searcher',
	data: () => {
		return {
			query: '',
			findPlayer: []
		}
	},
	apollo: {
		findPlayer: {
			query: gql`query find($q:String!){
				findPlayer(query:$q) {
					id
					firstname
					lastname
					team
					number
				}
			}`,
			variables() {
				return { q: this.query }
			},
			prefetch: false
		}
	}
}
</script>

<style>
</style>
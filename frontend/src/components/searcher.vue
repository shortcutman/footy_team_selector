<template>
<div>
	<div>
		<input type="text" name="query" v-model="query">
	</div>
	<div>
		<p>searching for {{ query }} </p>
		<ul v-for="result in findPlayer">
			<li>result</li>
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
	// computed: {
	// 	queriedResults() {
	// 		this.$apollo.query({

	// 		})
	// 	}
	// }
}
</script>

<style>
</style>
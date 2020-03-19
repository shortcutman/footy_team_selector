<template>
<div>
	<div>
		<span>Search for player: <input type="text" name="query" v-model="query"></span>
	</div>
	<div>
		<ul>
			<li v-for="result in findPlayer">{{ result.number }}: {{ result.firstname }} {{ result.lastname }} <input type="submit" name="add" value="Add" @click="addPlayer(result)" :disabled="!canAdd || inCurrentTeam(result)"></li>
			<li v-if="nextCursor != -1" @click="showMoreSearchResults()">Click for more results</li>
			<li v-else-if="query.length != 0">No more results</li>
		</ul>
	</div>
</div>
</template>

<script>
import teamUtilities from '../team-utilities.js'
import gql from 'graphql-tag'

export default {
	name: 'searcher',
	data: () => {
		return {
			query: '',
			findPlayer: [],
			nextCursor: -1,
			canAdd: true
		}
	},
	methods: {
		addPlayer(player) {
			this.$apollo.mutate({
				mutation: gql`
					mutation($p:Player!) {
						addPlayerToTeam(player:$p) @client
					}
				`,
				variables: { p: player }
			}).then(({ data }) => {
				this.canAdd = teamUtilities.teamLength(data.addPlayerToTeam) < teamUtilities.maxTeamLength
			}).catch((error) => {
				console.log(error)
			})
		},
		inCurrentTeam(player) {
			return teamUtilities.playerInTeam(player, this.currentTeam)
		},
		showMoreSearchResults() {
			console.log(this.nextCursor)
			if (this.nextCursor === -1) {
				console.log('no more results')
				return
			}

			this.$apollo.queries.findPlayer.fetchMore({
				variables: {
					q: this.query,
					c: this.nextCursor
				},
				updateQuery(previousResult, { fetchMoreResult }) {
					console.log(previousResult)
					console.log(fetchMoreResult)

					return {
						findPlayer: {
							__typename: 'FindResults',
							nextCursor: fetchMoreResult.findPlayer.nextCursor,
							results: [...previousResult.findPlayer.results, ...fetchMoreResult.findPlayer.results]
						}
					}
				}
			})
		}
	},
	apollo: {
		findPlayer: {
			query: gql`query find($q:String! $c:Int!){
				findPlayer(query:$q cursor:$c) {
					results {
						id
						firstname
						lastname
						team
						number
					}
					nextCursor
				}
			}`,
			variables() {
				return { q: this.query, c:0 }
			},
			update(data) {
				this.nextCursor = data.findPlayer.nextCursor
				return data.findPlayer.results
			},
			prefetch: false
		},
		currentTeam: {
			query: teamUtilities.fullTeamQuery
		}
	}
}
</script>

<style>
</style>
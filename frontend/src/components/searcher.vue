<template>
<div>
	<div>
		<span>Search for player: <input type="text" name="query" v-model="query"></span>
	</div>
	<div>
		<ul>
			<li v-for="result in findPlayer">{{ result.number }}: {{ result.firstname }} {{ result.lastname }} <input type="submit" name="add" value="Add" @click="addPlayer(result)" :disabled="!canAdd || inCurrentTeam(result)"></li>
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
				this.canAdd = teamUtilities.teamLength(data.addPlayerToTeam) < 22
			}).catch((error) => {
				console.log(error)
			})
		},
		inCurrentTeam(player) {
			return teamUtilities.playerInTeam(player, this.currentTeam)
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
		},
		currentTeam: {
			query: teamUtilities.fullTeamQuery
		}
	}
}
</script>

<style>
</style>
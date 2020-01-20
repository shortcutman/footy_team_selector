<template>
<div>
	<ol>
		<li v-for="player in currentTeam">{{player.id}} {{ player.firstname }} {{ player.lastname }} <input type="Submit" value="Delete" @click="deletePlayer(player)"></li>
	</ol>
</div>
</template>

<script>

import gql from 'graphql-tag'

export default {
	name: 'team',
	data: () => {
		return {
			currentTeam: []
		}
	},
	methods: {
		deletePlayer(player) {
			this.$apollo.mutate({
				mutation: gql`
					mutation($p:Player!) {
						removePlayerFromTeam(player:$p) @client
					}
				`,
				variables: { p: player }
			}).then(({ data }) => {
				this.currentTeam = data.removePlayerFromTeam
			})
		}
	},
	apollo: {
		currentTeam: {
			query: gql`{
				currentTeam @client {
					id
					firstname
					lastname
				}
			}`
		}
	}
}
</script>

<style>
	
</style>
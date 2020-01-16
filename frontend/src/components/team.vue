<template>
<div>
	<ol>
		<li v-for="player in currentTeam">player {{ player.id }} {{ player.firstname }}</li>
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
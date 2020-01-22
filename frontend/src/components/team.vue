<template>
<div>
	<div id="team">
		<div class="player" v-for="player in currentTeam">
			<div class="name">{{ player.firstname }} {{ player.lastname }}</div>
			<div class="number">{{ player.number }}</div>
			<div class="controls"><input type="Submit" value="Delete" @click="deletePlayer(player)"></div>
		</div>
	</div>
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
					number
				}
			}`
		}
	}
}
</script>

<style scoped>
#team {
	display: grid;
	grid-template-columns: auto auto auto;
	/*grid-template-rows: auto;*/
}

.player {
	width: 120px;
	height: 50px;

	display: grid;
	grid-template-areas: "h h" "n c";

	margin-left: auto;
	margin-right: auto;
	margin-top: 5px;
	margin-bottom: 5px;
	border-color: black;
	border-radius: 8px;
	border-style: solid;
	border-width: 2px;
}

.player > * {
	margin: auto;
	text-align: center;
	vertical-align: middle;
}

.player > .name {
	grid-area: h;
}

.player > .number {
	grid-area: n;
}

.player > .controls {
	grid-area: c;
}
</style>
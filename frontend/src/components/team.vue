<template>
<div>
	<div id="team_">
		<div v-for="(player, position) in currentTeam">
			<drag :transfer-data="{position, player}">
				<drop @drop="swapPlayers(position, ...arguments)"
					  @dragover="dragOver(...arguments)"
				  	  @dragleave="dragLeave(...arguments)">
					<div v-if="player != null" class="player">
						<div class="name">{{ player.firstname }} {{ player.lastname }}</div>
						<div class="number">{{ player.number }}</div>
						<div class="controls"><input type="Submit" value="Delete" @click="deletePlayer(player)"></div>
					</div>
					<div v-else class="player">
						<div class="name">Nobody here</div>
						<div class="number">0</div>
						<div class="controls"></div>
					</div>
				</drop>
			</drag>
		</div>
	</div>
</div>
</template>

<script>

import teamUtilities from '../team-utilities.js'
import gql from 'graphql-tag'
import {Drag, Drop} from 'vue-drag-drop'

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
		},
		dragOver(transferData, nativeEvent) {
			const player = nativeEvent.currentTarget.getElementsByClassName('player')[0]
			player.classList.add('selection')
		},
		dragLeave(transferData, nativeEvent) {
			const player = nativeEvent.currentTarget.getElementsByClassName('player')[0]
			player.classList.remove('selection')
		},
		swapPlayers(dropPosition, drag, nativeEvent) {
			if (drag.position) {
				this.$apollo.mutate({
					mutation: gql`
						mutation($pA:String! $pB:String!) {
							swapPositionsInTeam(positionA:$pA positionB:$pB) @client
						}
					`,
					variables: {
						pA: dropPosition,
						pB: drag.position
					}
				})
			} else if (drag.player) {
				this.$apollo.mutate({
					mutation: gql`
						mutation($pos:String! $play:String!) {
							addPlayerToPosition(position:$pos player:$play) @client
						}
					`,
					variables: {
						pos: dropPosition,
						play: drag.player
					}
				})
			}

			const player = nativeEvent.currentTarget.getElementsByClassName('player')[0]
			player.classList.remove('selection')
		}
	},
	apollo: {
		currentTeam: {
			query: teamUtilities.fullTeamQuery,
			update(data) {
				return Object.keys(data.currentTeam)
					.filter(key => key !== '__typename')
					.reduce((res, key) => (res[key] = data.currentTeam[key], res), {})
			}
		}
	},
	components: {
		Drag,
		Drop
	}
}
</script>

<style scoped>
#team_ {
	display: grid;
	grid-template-columns: auto auto auto;
	grid-row-gap: 5px;
	grid-column-gap: 3px;
}

.player {
	height: 50px;
	background-color: white;

	display: grid;
	grid-template-areas: "h h" "n c";

	border-color: black;
	border-radius: 8px;
	border-style: solid;
	border-width: 2px;
}

.selection {
	background-color: grey;
}

.player > * {
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
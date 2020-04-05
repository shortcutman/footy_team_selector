<template>
<div>
	<div id="team_">
		<div v-for="(player, position) in currentTeam"
			 v-bind:position="position"
			 v-bind:playerid="player ? player.id : -1"
			 class="draggable dropzone">
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
		</div>
	</div>
</div>
</template>

<script>

import teamUtilities from '../team-utilities.js'
import gql from 'graphql-tag'
import interact from 'interactjs'

export default {
	name: 'team',
	data: () => {
		return {
			currentTeam: []
		}
	},
	mounted() {
		interact('.draggable').draggable({
			listeners: {
				start(event) {
					event.target.style.position = 'relative'
					event.target.style.left = 0
					event.target.style.top = 0
					event.interactable.model = {
						position: event.target.attributes.position.value,
					}
				},
				move(event) {
					const rx = parseInt(event.target.style.left, 10) + event.dx
					const ry = parseInt(event.target.style.top, 10) + event.dy
					event.target.style.left = `${rx}px`
					event.target.style.top = `${ry}px`
				},
				end(event) {
					event.target.style.position = null
					event.target.style.left = null
					event.target.style.top = null
				}
			}
		})

		interact('.dropzone').dropzone({
			accept: '.draggable',
			ondrop: (event) => {
				this.swapPlayers(event.currentTarget.attributes.position.value, event.draggable.model, null)

				event.currentTarget.classList.remove('selection')
			},
			ondragenter(event) {
				event.currentTarget.classList.add('selection')
			},
			ondragleave(event) {
				event.currentTarget.classList.remove('selection')
			}
		})
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
						mutation($pos:String! $play:Player!) {
							addPlayerToPosition(position:$pos player:$play) @client
						}
					`,
					variables: {
						pos: dropPosition,
						play: drag.player
					}
				})
			}
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

.draggable {
	touch-action: none;
	user-select: none;
	-webkit-user-select: none;
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

.selection > * {
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
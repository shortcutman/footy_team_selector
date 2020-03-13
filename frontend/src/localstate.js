import gql from 'graphql-tag'
import teamUtilities from './team-utilities.js'

const queryCurrentTeam = gql`{
	currentTeam @client {
		id
		firstname
		lastname
		number
	}
}`

export const typeDefs = gql`
	type Team {
		FPOCK1: Player
		FULLF: Player
		FPOCK2: Player
		FFLNK1: Player
		HALFF: Player
		FFLNK2: Player
		WING1: Player
		CENTRE: Player
		WING2: Player
		BFLNK1: Player
		HALFB: Player
		BFLNK2: Player
		BPOCK1: Player
		FULLB: Player
		BPOCK2: Player
		RUCK: Player
		ROVER: Player
		RKRVR: Player
		INT1: Player
		INT2: Player
		INT3: Player
		INT4: Player
	}

	type Mutation {
		addPlayerToTeam(player:Player!): Team!
		removePlayerFromTeam(player:Player!): Team!
		swapPlayersInTeam(playerA:Player! playerB:Player!): Team!
	}
`;

const resolvers = {
	Mutation: {
		addPlayerToTeam: (_, {player}, {cache}) => {
			const { currentTeam } = cache.readQuery({query: teamUtilities.fullTeamQuery})

			if (teamUtilities.teamLength(currentTeam) >= 22) {
				return false
			} else if (Object.values(currentTeam).find(el => el && typeof el === 'object' && 'id' in el && el.id === player.id)) {
				return false
			} else {
				const empty = Object.keys(currentTeam).find(el => currentTeam[el] === null)
				currentTeam[empty] = player
				cache.writeData({data: {
					currentTeam: currentTeam
				}})
				return currentTeam
			}
		},
		removePlayerFromTeam: (_, {player}, {cache}) => {
			console.assert("id" in player)
			const { currentTeam } = cache.readQuery({query: teamUtilities.fullTeamQuery})

			let removed = false
			for (const key in currentTeam) {
				if (key !== '__typename' && currentTeam[key] !== null) {
					const itPlayer = currentTeam[key]
					if (itPlayer.id === player.id) {
						currentTeam[key] = null
						removed = true
						break
					}
				}
			}
			console.assert(removed, "Player requested for removal not in team")

			cache.writeData({ data: { currentTeam }})
			return currentTeam
		},
		swapPlayersInTeam: (_, {playerA, playerB}, {cache}) => {
			console.assert("id" in playerA)
			console.assert("id" in playerB)

			let positionA, positionB
			const { currentTeam } = cache.readQuery({query: teamUtilities.fullTeamQuery})
			for (const position in currentTeam) {
				if (position === '__typename' || currentTeam[position] === null) {
					continue
				} else if (currentTeam[position].id === playerA.id) {
					positionA = position
				} else if (currentTeam[position].id === playerB.id) {
					positionB = position
				}

				if (positionA !== undefined && positionB !== undefined) {
					break
				}
			}

			if (positionA === undefined || positionB === undefined) {
				throw "Invalid ID's"
			}

			const tempA = currentTeam[positionA]
			currentTeam[positionA] = currentTeam[positionB]
			currentTeam[positionB] = playerA

			//this used to write with a fresh new array object to force a vue update
			cache.writeData({ data: { currentTeam }})
			return currentTeam
		}
	}
}

export default {
	queryCurrentTeam,
	team: teamUtilities,
	resolvers,
	typeDefs
}

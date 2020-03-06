import gql from 'graphql-tag'

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
		players: [Player]!
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
			const { currentTeam } = cache.readQuery({query: queryCurrentTeam})
			
			if (currentTeam.length >= 18) {
				return false
			} else if (currentTeam.find(el => el.id === player.id)) {
				return false
			} else {
				const newCurrentTeam = currentTeam
				newCurrentTeam.push(player)
				cache.writeData({data: {
					currentTeam: newCurrentTeam
				}})
				return newCurrentTeam
			}
		},
		removePlayerFromTeam: (_, {player}, {cache}) => {
			console.assert("id" in player)
			const { currentTeam } = cache.readQuery({query: queryCurrentTeam})
			const newTeam = currentTeam.filter(el => player.id !== el.id)
			cache.writeData({ data: { currentTeam: newTeam }})
			return newTeam
		},
		swapPlayersInTeam: (_, {playerA, playerB}, {cache}) => {
			console.assert("id" in playerA)
			console.assert("id" in playerB)

			//duplicate array to force vue update
			const currentTeam = Array.from(cache.readQuery({query: queryCurrentTeam}).currentTeam)
			const playerAIndex = currentTeam.findIndex(player => player.id === playerA.id)
			const playerBIndex = currentTeam.findIndex(player => player.id === playerB.id)
			if (playerAIndex === -1 || playerBIndex === -1) {
				throw "Invalid ID's"
			}

			const tempPlayerA = currentTeam[playerAIndex]
			currentTeam[playerAIndex] = currentTeam[playerBIndex]
			currentTeam[playerBIndex] = tempPlayerA

			cache.writeData({ data: { currentTeam }})
			return currentTeam
		}
	}
}

export default {
	queryCurrentTeam,
	resolvers,
	typeDefs
}

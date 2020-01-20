import gql from 'graphql-tag'

const queryCurrentTeam = gql`{
	currentTeam @client {
		id
		firstname
		lastname
	}
}`

export const typeDefs = gql`
	type Team {
		players: [Player]!
	}

	type Mutation {
		addPlayerToTeam(player:Player!): Team!
		removePlayerFromTeam(player:Player!): Team!
	}
`;

const resolvers = {
	Mutation: {
		addPlayerToTeam: (_, {player}, {cache}) => {
			const { currentTeam } = cache.readQuery({query: queryCurrentTeam})
			
			if (currentTeam.length >= 18) {
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
		}
	}
}

export default {
	resolvers,
	typeDefs
}
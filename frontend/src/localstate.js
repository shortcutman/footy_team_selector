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
		}
	}
}

export default {
	resolvers,
	typeDefs
}
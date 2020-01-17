import gql from 'graphql-tag'

export const typeDefs = gql`
	type ConfiguredTeam {
		players: [Player]!
	}

	type Mutation {
		addPlayerToTeam(player:Player!): Boolean
	}
`;

const resolvers = {
	Mutation: {
		addPlayerToTeam: (_, {player}, {cache}) => {
			const { currentTeam } = cache.readQuery({query: gql`{
				currentTeam @client {
					id
					firstname
					lastname
				}
			}`})
			
			if (currentTeam.length >= 18) {
				return false
			} else {
				const newCurrentTeam = currentTeam
				newCurrentTeam.push(player)
				cache.writeData({data: {
					currentTeam: newCurrentTeam
				}})
				return true
			}
		}
	}
}

export default {
	resolvers,
	typeDefs
}
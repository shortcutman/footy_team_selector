import gql from 'graphql-tag'

export const typeDefs = gql`
	type Team {
		players: [Player]!
	}

	type Mutation {
		addPlayerToTeam(player:Player!): Team!
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
				return newCurrentTeam
			}
		}
	}
}

export default {
	resolvers,
	typeDefs
}
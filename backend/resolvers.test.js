
const gql = require('graphql-tag')

const { ApolloServer } = require('apollo-server-express')
const { createTestClient } = require('apollo-server-testing')
const { readFileSync } = require('fs')

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers.js')

test('Get Player', async () => {
	const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	const { query } = createTestClient(server)

	const player = await query({
		query: gql`query {
			getPlayerByNumber(number:1 team:GEELONG) {
				id
				firstname
				lastname
				number
				team
			}
		}`
	})

	expect(player.data.getPlayerByNumber).toHaveProperty("id")
	expect(player.data.getPlayerByNumber).toHaveProperty("firstname")
	expect(player.data.getPlayerByNumber).toHaveProperty("lastname")
	expect(player.data.getPlayerByNumber).toHaveProperty("number")
	expect(player.data.getPlayerByNumber).toHaveProperty("team")
})
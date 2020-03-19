
const gql = require('graphql-tag')

const { ApolloServer } = require('apollo-server-express')
const { createTestClient } = require('apollo-server-testing')

const resolvers = require('./resolvers.js')
const typeDefs = require('./typeDefs.js')

let query;

beforeAll(() => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	query = createTestClient(server).query
})

describe('getPlayerByNumber', () => {
	test('Data structure', async () => {
		const player = await query({
			query: gql`query {
				getPlayerByNumber(number:1 team:ADELAIDE) {
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

	test('Correct player', async () => {
		const player = await query({
			query: gql`query {
				getPlayerByNumber(number:1 team:ADELAIDE) {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})

		expect(player.data.getPlayerByNumber).toMatchObject({
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		})
	})

	test('Missing player', async () => {
		const player = await query({
			query: gql`query {
				getPlayerByNumber(number:50 team:ADELAIDE) {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})
		expect(player).toMatchObject({
			errors: [{
				path: ["getPlayerByNumber"],
				extensions: {
					input: {
						number: 50,
						team: "ADELAIDE"
					},
					code: "NO_PLAYER"
				}
			}]
		})
	})
})

const findGQL = gql`query($q:String!) {
	findPlayer(query:$q) {
		results {
			id
			firstname
			lastname
			number
			team
		}
		nextCursor
	}
}`

const findGQLwithCursor = gql`query($q:String! $c:Int!) {
	findPlayer(query:$q cursor:$c) {
		results {
			id
			firstname
			lastname
			number
			team
		}
		nextCursor
	}
}`

describe('find player', () => {
	test('Find by number', async () => {
		const findQuery = await query({
			query: findGQL,
			variables: {
				q: "1"
			}
		})

		expect(findQuery.data.findPlayer.results.length === 10)
		expect(findQuery.data.findPlayer.results).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
		expect(findQuery.data.findPlayer.nextCursor === 10)
	})

	test('Find by number, increment cursor', async () => {
		const findQuery = await query({
			query: findGQLwithCursor,
			variables: {
				q: "1",
				c: 10
			}
		})

		expect(findQuery.data.findPlayer.results.length === 5)
		expect(findQuery.data.findPlayer.results[0]).toMatchObject({
			id: '294674'
		})
		expect(findQuery.data.findPlayer.nextCursor === -1)
	})

	test('Find by firstname', async () => {
		const findQuery = await query({
			query: findGQL,
			variables: {
				q: "Ben"
			}
		})

		expect(findQuery.data.findPlayer.results).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find by lastname', async () => {
		const findQuery = await query({
			query: findGQL,
			variables: {
				q: "Keays"
			}
		})

		expect(findQuery.data.findPlayer.results).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find by firstname mixed case', async () => {
		const findQuery = await query({
			query: findGQL,
			variables: {
				q: "BeN"
			}
		})

		expect(findQuery.data.findPlayer.results).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find by lastname mixed case', async () => {
		const findQuery = await query({
			query: findGQL,
			variables: {
				q: "KeAyS"
			}
		})

		expect(findQuery.data.findPlayer.results).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find nothing', async () => {
		const findQuery = await query({
			query: findGQL,
			variables: {
				q: "gobblegobble"
			}
		})

		expect(findQuery.data.findPlayer).toEqual({
			results: [],
			nextCursor: -1
		})
	})})
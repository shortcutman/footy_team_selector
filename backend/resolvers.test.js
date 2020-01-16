
const gql = require('graphql-tag')

const { ApolloServer } = require('apollo-server-express')
const { createTestClient } = require('apollo-server-testing')
const { readFileSync } = require('fs')

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require('./resolvers.js')

let query;

beforeAll(() => {
	const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
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

describe('find player', () => {
	test('Find by number', async () => {
		const findQuery = await query({
			query: gql`query {
				findPlayer(query:"1") {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})

		expect(findQuery.data.findPlayer).toMatchObject([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}])
	})

	test('Find by firstname', async () => {
		const findQuery = await query({
			query: gql`query {
				findPlayer(query:"Ben") {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})

		expect(findQuery.data.findPlayer).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find by lastname', async () => {
		const findQuery = await query({
			query: gql`query {
				findPlayer(query:"Keays") {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})

		expect(findQuery.data.findPlayer).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find by firstname mixed case', async () => {
		const findQuery = await query({
			query: gql`query {
				findPlayer(query:"BeN") {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})

		expect(findQuery.data.findPlayer).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})

	test('Find by lsatname mixed case', async () => {
		const findQuery = await query({
			query: gql`query {
				findPlayer(query:"KeAyS") {
					id
					firstname
					lastname
					number
					team
				}
			}`
		})

		expect(findQuery.data.findPlayer).toEqual(expect.arrayContaining([{
			id: '993946',
			firstname: 'Ben',
			lastname: 'Keays',
			team: 'ADELAIDE',
			number: 1,
		}]))
	})
})
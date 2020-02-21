
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory'

import localstate from './localstate.js'

let cache = null

const playerA = {
	id: 1,
	firstname: 'Kevin',
	lastname: 'Sheedy',
	team: 'ESSENDON',
	number: 1,
	__typename: 'Player'
}

const playerB = {
	id: 2,
	firstname: 'Bruce',
	lastname: 'Springsteen',
	team: 'COLLINGWOOD',
	number: 5,
	__typename: 'Player'
}

beforeAll(() => {
	cache = new InMemoryCache()
	cache.writeData({
		data: {
			currentTeam: []
		}
	})
})

describe('basic mutation tests', () => {
	test('addPlayerToTeam', () => {
		const result = localstate.resolvers.Mutation.addPlayerToTeam(null, {
			player: playerA
		}, {
			cache
		})

		expect(result.length === 1)
	})

	test('removePlayerFromTeam', () => {
		const result = localstate.resolvers.Mutation.removePlayerFromTeam(null, {
			player: playerA
		}, {
			cache
		})
		expect(result.length === 0)
	})

	test('swapPlayersInTeam', () => {
		const resultAddA = localstate.resolvers.Mutation.addPlayerToTeam(null, {
			player: playerA
		}, {
			cache
		})
		expect(resultAddA.length === 1)
		expect(resultAddA[0]).toMatchObject(playerA)

		const resultAddB = localstate.resolvers.Mutation.addPlayerToTeam(null, {
			player: playerB
		}, {
			cache
		})
		expect(resultAddB.length === 2)
		expect(resultAddB[0]).toMatchObject(playerA)
		expect(resultAddB[1]).toMatchObject(playerB)

		const resultSwap = localstate.resolvers.Mutation.swapPlayersInTeam(null, {
			playerA,
			playerB
		}, {
			cache
		})
		expect(resultSwap.length === 2)
		expect(resultSwap[0]).toMatchObject(playerB)
		expect(resultSwap[1]).toMatchObject(playerA)
	})
})

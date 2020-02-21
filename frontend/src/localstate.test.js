
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

describe('mutation tests', () => {
	describe('addPlayerToTeam', () => {
		test('successful call', () => {
			const result = localstate.resolvers.Mutation.addPlayerToTeam(null, {
				player: playerA
			}, {
				cache
			})

			expect(result.length === 1)
		})

		describe('errors', () => {
			let errorCache;

			beforeAll(() => {
				const currentTeam = new Array(17).fill(playerA)
				errorCache = new InMemoryCache()
				errorCache.writeData({
					data: {
						currentTeam
					}
				})
			})

			test('mixed ids', () => {
				const resultFail = localstate.resolvers.Mutation.addPlayerToTeam(null, {
					player: playerA
				}, {
					cache: errorCache
				})
				expect(resultFail === false)

				const resultSucceed = localstate.resolvers.Mutation.addPlayerToTeam(null, {
					player: playerB
				}, {
					cache: errorCache
				})
				expect(resultSucceed !== false)				
			})

			test('team too big', () => {
				const result = localstate.resolvers.Mutation.addPlayerToTeam(null, {
					player: playerA
				}, {
					cache: errorCache
				})

				expect(result === false)
			})
		})

	})

	describe('removePlayerFromTeam', () => {
		test('successful call', () => {
			const result = localstate.resolvers.Mutation.removePlayerFromTeam(null, {
				player: playerA
			}, {
				cache
			})
			expect(result.length === 0)
		})
	})

	describe('swapPlayersInTeam', () => {
		test('successful call', () => {
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

		test('error', () => {
			expect(() => {
					localstate.resolvers.Mutation.swapPlayersInTeam(null, {
					playerA: {
						id: 99999999
					},
					playerB
				}, {
					cache
				})
			}).toThrow()
			expect(() => {
					localstate.resolvers.Mutation.swapPlayersInTeam(null, {
					playerA,
					playerB: {
						id: 99999999
					}
				}, {
					cache
				})
			}).toThrow()
			expect(() => {
					localstate.resolvers.Mutation.swapPlayersInTeam(null, {
					playerA: {
						id: 99999999
					},
					playerB: {
						id: 99999999
					}
				}, {
					cache
				})
			}).toThrow()
		})
	})
})

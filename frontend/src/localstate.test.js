
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

function resetCache() {
	cache = new InMemoryCache()
	cache.writeData({
		data: {
			currentTeam: localstate.team.emptyTeam()
		}
	})
}

function addAToTeam() {
	const result = localstate.resolvers.Mutation.addPlayerToTeam(null, {
		player: playerA
	}, {
		cache
	})

	expect(localstate.team.teamLength(result) === 1)
}

function addBToTeam() {
	const result = localstate.resolvers.Mutation.addPlayerToTeam(null, {
		player: playerB
	}, {
		cache
	})
}

describe('mutation tests', () => {
	describe('addPlayerToTeam', () => {
		beforeAll(resetCache)

		test('successful call', () => {
			addAToTeam()
		})

		describe('errors', () => {
			let errorCache;

			beforeAll(() => {
				const currentTeam = localstate.team.emptyTeam()
				let count = 0
				for (const position in currentTeam) {
					if (count >= 21) break

					if (position != '__typename') {
						currentTeam[position] = playerA
						count++
					}
				}

				errorCache = new InMemoryCache()
				errorCache.writeData({
					data: {
						currentTeam
					}
				})
			})

			test('duplicate ids', () => {
				const { currentTeam } = errorCache.readQuery({query: localstate.team.fullTeamQuery})
				expect(localstate.team.teamLength(currentTeam) === 21)

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
				expect(localstate.team.teamLength(resultSucceed) === localstate.team.maxTeamLength)
			})

			test('team too big', () => {
				const { currentTeam } = errorCache.readQuery({query: localstate.team.fullTeamQuery})
				expect(localstate.team.teamLength(currentTeam) === localstate.team.maxTeamLength)

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
		beforeAll(() => {
			resetCache()
			addAToTeam()
		})

		test('successful call', () => {
			const result = localstate.resolvers.Mutation.removePlayerFromTeam(null, {
				player: playerA
			}, {
				cache
			})
			expect(localstate.team.teamLength(result) === 0)
		})

		test('remove nonexistent', () => {
			addAToTeam() //to compare against something it isn't

			const result = localstate.resolvers.Mutation.removePlayerFromTeam(null, {
				player: playerB
			}, {
				cache
			})
			expect(localstate.team.teamLength(result) === 0)
		})
	})

	describe('swapPlayersInTeam', () => {
		beforeAll(resetCache)

		test('successful call', () => {
			const resultAddA = localstate.resolvers.Mutation.addPlayerToTeam(null, {
				player: playerA
			}, {
				cache
			})
			expect(localstate.team.teamLength(resultAddA) === 1)
			expect(resultAddA["FPOCK1"]).toMatchObject(playerA)

			const resultAddB = localstate.resolvers.Mutation.addPlayerToTeam(null, {
				player: playerB
			}, {
				cache
			})
			expect(localstate.team.teamLength(resultAddB) === 2)
			expect(resultAddB["FPOCK1"]).toMatchObject(playerA)
			expect(resultAddB["FULLF"]).toMatchObject(playerB)

			const resultSwap = localstate.resolvers.Mutation.swapPlayersInTeam(null, {
				playerA,
				playerB
			}, {
				cache
			})
			expect(localstate.team.teamLength(resultSwap) === 2)
			expect(resultSwap["FPOCK1"]).toMatchObject(playerB)
			expect(resultSwap["FULLF"]).toMatchObject(playerA)
		})

		describe('errors', () => {
			test('nonexistent A', () => {
				expect(() => {
						localstate.resolvers.Mutation.swapPlayersInTeam(null, {
						playerA: {
							id: 99999999
						},
						playerB
					}, {
						cache
					})
				}).toThrow("Invalid ID's")
			})

			test('nonexistent B', () => {
				expect(() => {
						localstate.resolvers.Mutation.swapPlayersInTeam(null, {
						playerA,
						playerB: {
							id: 99999999
						}
					}, {
						cache
					})
				}).toThrow("Invalid ID's")
			})

			test('nothing existent', () => {
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
				}).toThrow("Invalid ID's")
			})

			test('playerA null', () => {
				expect(() => {
						localstate.resolvers.Mutation.swapPlayersInTeam(null, {
						playerA: null,
						playerB: {
							id: 99999999
						}
					}, {
						cache
					})
				}).toThrow("Must have valid input players")
			})

			test('playerA without ID', () => {
				expect(() => {
						localstate.resolvers.Mutation.swapPlayersInTeam(null, {
						playerA: {
							firstname: "Bruce"
						},
						playerB: {
							id: 99999999
						}
					}, {
						cache
					})
				}).toThrow("Must have valid input players")
			})

			test('playerB null', () => {
				expect(() => {
						localstate.resolvers.Mutation.swapPlayersInTeam(null, {
						playerA: {
							id: 99999999
						},
						playerB: null
					}, {
						cache
					})
				}).toThrow("Must have valid input players")
			})

			test('playerB without ID', () => {
				expect(() => {
						localstate.resolvers.Mutation.swapPlayersInTeam(null, {
						playerA: {
							id: 99999999
						},
						playerB: {
							firstname: "Bruce"
						}
					}, {
						cache
					})
				}).toThrow("Must have valid input players")
			})
		})
	})

	describe('swapPositionsInTeam', () => {
		beforeEach(resetCache)

		test('swap both inputs empty', () => {
			const { currentTeam } = cache.readQuery({query: localstate.team.fullTeamQuery})
			expect(currentTeam["FULLF"] === null)
			expect(currentTeam["FULLB"] === null)

			localstate.resolvers.Mutation.swapPositionsInTeam(null, {
				positionA: "FULLF",
				positionB: "FULLB"
			}, {
				cache
			})

			expect(currentTeam["FULLF"] === null)
			expect(currentTeam["FULLB"] === null)
		})

		test('swap input A player with input B empty', () => {
			addAToTeam()

			const { currentTeam } = cache.readQuery({query: localstate.team.fullTeamQuery})
			expect(currentTeam["FPOCK1"]).toMatchObject(playerA)
			expect(currentTeam["FULLB"] === null)

			localstate.resolvers.Mutation.swapPositionsInTeam(null, {
				positionA: "FPOCK1",
				positionB: "FULLB"
			}, {
				cache
			})

			expect(currentTeam["FPOCK1"] === null)
			expect(currentTeam["FULLB"]).toMatchObject(playerA)
		})

		test('swap input B player with input A empty', () => {
			addBToTeam()

			const { currentTeam } = cache.readQuery({query: localstate.team.fullTeamQuery})
			expect(currentTeam["FPOCK1"]).toMatchObject(playerB)
			expect(currentTeam["FULLF"] === null)

			localstate.resolvers.Mutation.swapPositionsInTeam(null, {
				positionA: "FULLF",
				positionB: "FPOCK1"
			}, {
				cache
			})

			expect(currentTeam["FPOCK1"] === null)
			expect(currentTeam["FULLF"]).toMatchObject(playerB)
		})

		test('swap input A player with input B player', () => {
			addAToTeam()
			addBToTeam()

			const { currentTeam } = cache.readQuery({query: localstate.team.fullTeamQuery})
			expect(currentTeam["FPOCK1"]).toMatchObject(playerA)
			expect(currentTeam["FULLF"]).toMatchObject(playerB)

			localstate.resolvers.Mutation.swapPositionsInTeam(null, {
				positionA: "FPOCK1",
				positionB: "FULLF"
			}, {
				cache
			})

			expect(currentTeam["FULLF"]).toMatchObject(playerA)
			expect(currentTeam["FPOCK1"]).toMatchObject(playerB)
		})
	})
})

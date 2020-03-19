
const fs = require('fs')

const { ApolloError } = require('apollo-server-express')

function getPlayerData(filename) {
	return JSON.parse(fs.readFileSync(filename))
}

const playerData = getPlayerData('./data/players.json')

const resolvers = {
	Query: {
		async getPlayerByNumber(parent, args) {
			const element = playerData.find(el => el.number == args.number && el.team == args.team)
			if (element) {
				return element					
			} else {
				throw new ApolloError("Unable to find player", "NO_PLAYER", { input: args })
			}
		},
		async findPlayer(parent, args) {
			const queries = args.query.split(" ").map(s => s.toLowerCase())
			const results = playerData.filter((el) => {
				for (const q of queries) {
					let qNo = +q
					if (isNaN(qNo)) {
						if (el.firstname.toLowerCase().includes(q) ||
						    el.lastname.toLowerCase().includes(q))
						    return true
					} else {
						return el.number == q
					}
				}
			})

			let cursor = args.cursor ? args.cursor : 0
			const cursorStride = 10
			const slicedResults = results.slice(cursor, cursor + cursorStride)

			return {
				results: slicedResults,
				nextCursor: slicedResults.length < 10 ? -1 : cursor + cursorStride
			}
		}
	}
}

module.exports = resolvers
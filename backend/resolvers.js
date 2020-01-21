
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

			return playerData.filter((el) => {
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
		}
	}
}

module.exports = resolvers
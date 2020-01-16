
const csvtojson = require('csvtojson')

const { ApolloError } = require('apollo-server-express')

async function getPlayerData(filename) {
	return await csvtojson().fromFile(filename)
}

const data = getPlayerData('./data/players.subset.csv')

const resolvers = {
	Query: {
		async getPlayerByNumber(parent, args) {
			return data.then((playerData) => {
				const element = playerData.find(el => el.number == args.number && el.team == args.team)
				if (element) {
					return element					
				} else {
					throw new ApolloError("Unable to find player", "NO_PLAYER", { input: args })
				}
			})
		},
		async findPlayer(parent, args) {
			const queries = args.query.split(" ").map(s => s.toLowerCase())

			return data.then((playerData) => {
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
			})
		}
	}
}

module.exports = resolvers
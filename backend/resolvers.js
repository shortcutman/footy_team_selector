


const resolvers = {
	Query: {
		getPlayerByNumber(parent, args) {
			return {
				id: 1111111111,
				firstname: "test",
				lastname: "test",
				number: 1,
				team: "GEELONG"
			}
		},
		findPlayer(parent, args) {
		}
	}
}

module.exports = resolvers
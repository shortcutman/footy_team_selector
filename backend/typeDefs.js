const gql = require('graphql-tag')

const schema = gql`
enum Team {
	ADELAIDE
	BRISBANE
	CARLTON
	COLLINGWOOD
	ESSENDON
	FREMANTLE
	GEELONG
	GOLDCOAST
	GREATERWESTERNSYDNEY
	HAWTHORN
	MELBOURNE
	NORTHMELBOURNE
	PORTADELAIDE
	RICHMOND
	STKILDA
	SYDNEY
	WESTCOAST
	WESTERNBULLDOGS
}

type Player {
	id: ID!
	firstname: String!
	lastname: String!
	number: Int!
	team: Team!
}

type FindResults {
	results: [Player]!
	nextCursor: Int!
}

type Query {
	getPlayerByNumber(number:Int! team:Team!): Player!

	findPlayer(query:String! cursor:Int): FindResults!
}

schema {
	query: Query
}`

module.exports = schema
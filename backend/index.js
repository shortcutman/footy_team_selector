const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const http = require('http')

const { ApolloServer } = require('apollo-server-express')

const resolvers = require('./resolvers.js')
const typeDefs = require('./typedefs.js')

function setupGraphQLServer(app, httpServer) {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	server.applyMiddleware({ app })
	app.get('/playground', expressPlayground({
		endpoint: '/graphql'
	}))

	return server
}

async function start() {
	const app = express()
	const httpServer = http.createServer(app)
	const graphqlServer = setupGraphQLServer(app, httpServer)

	httpServer.listen(80, () => {
		console.log(`GraphQL API running at :80/graphql`)
		console.log(`GraphQL playground running at :80/playground`)
	})
}

start()
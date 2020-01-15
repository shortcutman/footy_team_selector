const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const http = require('http')

const { ApolloServer } = require('apollo-server-express')
const { readFileSync } = require('fs')

const resolvers = require('./resolvers.js')

function setupGraphQLServer(app, httpServer) {
	const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
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
		console.log(`GraphQL API running at /graphql`)
		console.log(`GraphQL playground running at /playground`)
	})
}

start()
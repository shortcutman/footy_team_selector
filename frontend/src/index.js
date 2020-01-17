import Vue from 'vue'
import VueApollo from 'vue-apollo';
import gql from 'graphql-tag'

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http'

import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueApollo)

export const moreTypeDefs = gql`
	type ConfiguredTeam {
		players: [Player]!
	}

	type Mutation {
		addPlayerToTeam(player:Player!): Boolean
	}
`;

const res = {
	Mutation: {
		addPlayerToTeam: (_, {player}, {cache}) => {
			const { currentTeam } = cache.readQuery({query: gql`{
				currentTeam @client {
					id
					firstname
					lastname
				}
			}`})
			
			if (currentTeam.length >= 18) {
				return false
			} else {
				const newCurrentTeam = currentTeam
				newCurrentTeam.push(player)
				cache.writeData({data: {
					currentTeam: newCurrentTeam
				}})
				return true
			}
		}
	}
}

const cache = new InMemoryCache()
new Vue({
	apolloProvider: new VueApollo({
		defaultClient: new ApolloClient({
			link: new HttpLink({
				uri: "http://localhost:80/graphql"
			}),
			cache,
			typeDefs: moreTypeDefs,
			resolvers: res
		})
	}),
	render: function (h) { return h(App) },
}).$mount('#app')

cache.writeData({
	data: {
		currentTeam: []
	}
})
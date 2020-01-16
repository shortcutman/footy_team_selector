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
`;

const cache = new InMemoryCache()
new Vue({
	apolloProvider: new VueApollo({
		defaultClient: new ApolloClient({
			link: new HttpLink({
				uri: "http://localhost:80/graphql"
			}),
			cache,
			typeDefs: moreTypeDefs,
			resolvers: {}
		})
	}),
	render: function (h) { return h(App) },
}).$mount('#app')

cache.writeData({
	data: {
		currentTeam: [{
			__typename: "Player",
			id: "134124",
			firstname: "bruce",
			lastname: "wayne",
			team: "GEELONG",
			number: "14"
		}]
	}
})
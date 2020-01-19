import Vue from 'vue'
import VueApollo from 'vue-apollo';
import gql from 'graphql-tag'

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http'

import localstate from './localstate.js'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueApollo)

const cache = new InMemoryCache()
new Vue({
	apolloProvider: new VueApollo({
		defaultClient: new ApolloClient({
			link: new HttpLink({
				uri: "http://localhost:80/graphql"
			}),
			cache,
			typeDefs: localstate.typeDefs,
			resolvers: localstate.resolvers
		})
	}),
	render: function (h) { return h(App) },
}).$mount('#app')

cache.writeData({
	data: {
		currentTeam: []
	}
})
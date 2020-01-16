import Vue from 'vue'
import VueApollo from 'vue-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http'

import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueApollo)

new Vue({
	apolloProvider: new VueApollo({
		defaultClient: new ApolloClient({
			link: new HttpLink({
				uri: "http://localhost:80/graphql"
			}),
			cache: new InMemoryCache()
		})
	}),
	render: function (h) { return h(App) },
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import VueUploadMultipleImage from './components/VueUploadMultipleImage'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import VueApollo from 'vue-apollo'
Vue.config.productionTip = false
Vue.use(VueApollo)
const apolloClient = new ApolloClient({
    link: createUploadLink({ uri: 'http://localhost:4000' }),
    cache: new InMemoryCache()
})
const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

if (document.querySelector('#my-strictly-unique-vue-upload-multiple-image')) {
    Vue.component('VueUploadMultipleImage', VueUploadMultipleImage);
    new Vue({
        apolloProvider,
        el: '#my-strictly-unique-vue-upload-multiple-image',
        render: h => h(App)
    })
}

export default VueUploadMultipleImage
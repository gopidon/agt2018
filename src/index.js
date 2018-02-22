import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { BrowserRouter } from 'react-router-dom'

import 'antd/dist/antd.css'

// 2
const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjdvts85z2ff701755ezv6ewd' })

// 3
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})


ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
    , document.getElementById('root')
)
registerServiceWorker();

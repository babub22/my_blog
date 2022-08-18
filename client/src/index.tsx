import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client"

const httpLink =createUploadLink({uri:'http://localhost:8000/graphql'})

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
    // uri: 'http://localhost:8000/graphql',
    link:httpLink,
    cache: new InMemoryCache()
})

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>
);

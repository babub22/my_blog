import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client"
import {setContext} from "apollo-link-context";

import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink =createUploadLink({uri:'http://localhost:8000/graphql'})

const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:8000/subscriptions',
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const authLink=setContext(()=>{
    const token=localStorage.getItem('jwtToken');
    return {
        headers:{
            Authorization:token? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({ // @ts-ignore
    link: authLink.concat(splitLink),
    cache: new InMemoryCache()
})

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>
);

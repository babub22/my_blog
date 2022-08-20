import {ApolloServer} from 'apollo-server-express'
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core'

import {makeExecutableSchema} from '@graphql-tools/schema';
import {WebSocketServer} from 'ws';
import {useServer} from 'graphql-ws/lib/use/ws';

import express from 'express'
import http from 'http'
import cors from 'cors'

const { graphqlUploadExpress } = require("graphql-upload-minimal");

require('dotenv').config()

const mongoose=require('mongoose');

import typeDefs from "./schema/typeDefs";
import resolvers from "./resolvers/resolvers";

const schema = makeExecutableSchema({typeDefs, resolvers});

async function listen(port: number) {
    const app = express()
    const httpServer = http.createServer(app)

    app.use(graphqlUploadExpress({ maxFileSize: 200000, maxFiles: 10 }));
    app.use(cors());

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({schema}, wsServer);

    const server = new ApolloServer({// @ts-ignore
        schema, uploads: false,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            }]
    })
    await server.start()

    server.applyMiddleware({app})

    app.use(express.static('data'))

    await httpServer.listen(port)
}

// start server only after successful database connection
mongoose.connect(process.env.MONGODB,{useNewUrlParser:true}).then(async ()=>{await listen(8000)})
    .then(()=>{ console.log('🚀 Server is ready at http://localhost:8000/graphql ')}).catch((e:Error)=>{
    console.error('💀 Error starting the node server', e)
})
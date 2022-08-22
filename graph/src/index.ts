const {PubSub} = require("graphql-subscriptions");

const {ApolloServer} =require('apollo-server-express')
const {ApolloServerPluginDrainHttpServer} = require('apollo-server-core')

const {makeExecutableSchema} =require('@graphql-tools/schema');
const {WebSocketServer} = require('ws');
const {useServer} = require('graphql-ws/lib/use/ws');

const express = require('express')
const http = require('http')
const cors = require('cors')

const { graphqlUploadExpress } = require("graphql-upload-minimal");

require('dotenv').config()

const pubsub=new PubSub()

const mongoose=require('mongoose');

const typeDefs =require("./schema/typeDefs");
const resolvers =require("./resolvers/resolvers");

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
        schema, uploads: false, context:({req})=>({req,pubsub}),
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
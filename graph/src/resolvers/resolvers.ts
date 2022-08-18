import {Article} from "../types/types";
import {PubSub} from 'graphql-subscriptions';
import {GraphQLUpload} from "graphql-upload-minimal";

const pubsub = new PubSub();
const {finished} = require('stream/promises');

const path = require('path')
const fs = require('fs')

// const {
//     GraphQLUpload,
//     graphqlUploadExpress, // A Koa implementation is also exported.
// } = require('graphql-upload');


let md5 = require('md5')

// @ts-ignore
let articles:Article[] = []


const createId = (input: any) => {
    const id = md5(input.title)

    return {
        id, ...input
    }
}




const NEW_ARTICLE = 'NEW_ARTICLE'


// @ts-ignore
// @ts-ignore
export default {
    Query: {
        getAllArticles: (): Article[] => {
            return articles
        },
// @ts-ignore
        getArticle: async (parent, args) => {
            try {
                // const argument = { ...args };
                // console.log({ ...args }.id); // confirm you are passing object of correct shape to db
                return articles.find(article => article.id == {...args}.id)
            } catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
            // console.log(id)
            // return articles.find(article => article.id == id)
        }
    },
    Upload: GraphQLUpload,
    // @ts-ignore
    Mutation: {// @ts-ignore
        createArticle: (parent, args) => {

            let article = createId({...args}.input)
            article.imageId=md5(article.imageId)+'.jpg'

            if (articles.map(article => article.id).includes(article.id)) {
                throw Error('Duplicate name/id');
            } else {
                articles.push(article)

                console.log(article)

                return article
            }
        },// @ts-ignore
        singleUpload: async (parent, {file}) => {
            const {createReadStream, filename, mimetype, encoding} = await file
            const stream = createReadStream()
            const pathName = path.join(__dirname, `../../data/images/${md5(filename)+'.jpg'}`)
            await new Promise((resolve, reject) => {
                stream.pipe(fs.createWriteStream(pathName)).on('finish', resolve).on('error', reject)
            })

            return {filename, mimetype, encoding};
        },// @ts-ignore
        deleteArticle: (parent, args) => {
            articles = articles.filter(f => f.id != {...args}.id)
            return {...args}.id;
        },// @ts-ignore
        updateArticle:(parent,args)=>{
            let article=articles.find(f=>f.id==={...args}.input.id)
            if(article!==undefined){
                article.title={...args}.input.title
                article.perex={...args}.input.perex
                article.content={...args}.input.content
                article.lastUpdatedAt={...args}.input.lastUpdatedAt
                if({...args}.input.imageId) {
                    article.imageId = md5({...args}.input.imageId) + '.jpg'
                }

                return article
            }else{
                throw new Error('Invalid id.');
            }
        }

    },
    Subscription: {
        newArticle: {// @ts-ignore
            subscribe: () => pubsub.asyncIterator(NEW_ARTICLE)
        }
    }
}


// module.exports = {resolvers}
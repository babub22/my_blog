import {ArticleType, NewUser, UpdateArticle, UploadFile} from "../types/types";
import {PubSub} from 'graphql-subscriptions';
import {GraphQLUpload} from "graphql-upload-minimal";
import {UserInputError} from "apollo-server-express";
import {Schema} from "mongoose";

const pubsub = new PubSub();

const path = require('path')
const fs = require('fs')

const bcrypt = require('bcrypt')
const User = require('../models/User')
const Article = require('../models/Article')

const {validateMail} = require('../util/validateMail')
const {generateToken} = require('../util/generateToken')
const {createId} = require('../util/createId')

let md5 = require('md5')

let articles: ArticleType[] = []

const NEW_ARTICLE = 'NEW_ARTICLE'

export default {
    Query: {
        // return all articles
        // @ts-ignore
        getAllArticles: async (): ArticleType[] | Error => {
            return await Article.find().select('id perex title author title imageId createdAt lastUpdatedAt comments')
            //return articles
        },
        // returns the article that the user opened
        getArticle: async (_: any, {id}: { id: string }) => {
            const articleCheck = await Article.findById(id)

            if (articleCheck) {
                return articleCheck
            } else {
                throw new Error('Wrong ID!');
            }
        }
    },
    Mutation: {
        //creating an article and assigning an id
        createArticle: async (_: any, {input}: { input: ArticleType }) => {

            let article = createId(input)
            article.imageId = md5(article.imageId) + '.jpg'

            const articleCheck = await Article.findOne({title: article.title})

            const newArticle = new Article({
                _id: article.id,
                content: article.content,
                perex: article.perex,
                title: article.title,
                imageId: article.imageId,
                createdAt: article.createdAt,
                lastUpdatedAt: article.lastUpdatedAt,
                author: article.author,
                comments: null
            })

            if (articleCheck) { // if an article with the same name already exists returns an error
                throw Error('Duplicate name!');
            } else {
                const res = await newArticle.save();
                return res
            }

        },// uploading images
        singleUpload: async (_: any, {file}: { file: UploadFile }) => {
            const {createReadStream, filename, mimetype, encoding} = await file
            const stream = createReadStream()
            const pathName = path.join(__dirname, `../../data/images/${md5(filename) + '.jpg'}`)
            await new Promise((resolve, reject) => {
                stream.pipe(fs.createWriteStream(pathName)).on('finish', resolve).on('error', reject)
            })

            return {filename, mimetype, encoding};
        },// delete article by id
        deleteArticle: async (_: any, {id}: { id: string }) => {
            await Article.findByIdAndDelete(id)
            return id;
        },// update article by id,and assignment of new data
        updateArticle: async (_: any, {input}: { input: UpdateArticle }) => {

            const isNameValid = await Article.findOne({title: input.title})

            if (!isNameValid) { // if an article with the same name already exists returns an error

                const article = await Article.findById(input.id) // get an article that we will update

                if (article) {
                    await Article.findByIdAndUpdate(input.id, {
                        title: input.title,
                        perex: input.perex,
                        content: input.content,
                        lastUpdatedAt: new Date(),
                        imageId: input.imageId ? md5(input.imageId) + '.jpg' : article.imageId // if the picture has been changed, we encode its name, if not, then we leave the same
                    })
                } else {
                    throw new Error('Wrong ID!');
                }
            } else {
                throw Error('Duplicate name/id');
            }


            // let article = articles.find(f => f.id === input.id)
            // if (article !== undefined) {
            //     article.title = input.title
            //     article.perex = input.perex
            //     article.content = input.content
            //     article.lastUpdatedAt = new Date()
            //     if (input.imageId) {
            //         article.imageId = md5(input.imageId) + '.jpg'
            //     }
            //
            //     return article
            // } else {
            //     throw new Error('Invalid id.');
            // }
        },// registration resolve
        registerNewUser: async (_: any, {input}: { input: NewUser }) => {

            const {valid, errors} = validateMail(input.email);
            if (!valid) {
                throw new UserInputError('Email is not valid!', {errors})
            }

            const user = await User.findOne({username: input.username})

            if(!user){
                input.password = await bcrypt.hash(input.password, 12)

                const newUser = new User({
                    email: input.email,
                    username: input.username,
                    password: input.password,
                    createdAt: new Date().toISOString()
                })

                const res = await newUser.save();

                const token = generateToken(res)

                return {
                    email: res.email,
                    username: res.username,
                    createdAt: res.createdAt,
                    id: res._id,
                    token
                }
            }else{
                throw new UserInputError('This user already exist!')
            }
        },// login resolve
        login: async (_: any, {username, password}: { username: string, password: string }) => {

            const {errors, valid} = validateMail(username, password);
            const user = await User.findOne({username: username})

            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('Wrong credentials', {errors});
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'User not found'
                throw new UserInputError('Wrong credentials', {errors});
            }

            const token = generateToken(user)

            return {
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                id: user._id,
                token
            }
        },
    },
    Subscription: {
        newArticle: {
            subscribe: () => pubsub.asyncIterator(NEW_ARTICLE)
        }
    },
    //file upload configuration
    Upload: GraphQLUpload
}

// module.exports = {resolvers}
import {ArticleType, CommentType, NewUser, UpdateArticle, UploadFile} from "../types/types";

const {PubSub} = require('graphql-subscriptions');
const {GraphQLUpload} = require("graphql-upload-minimal");
const {UserInputError} = require("apollo-server-express");
import {Schema} from "mongoose";

// const pubsub = new PubSub();

const pubsub = new PubSub()

const path = require('path')
const fs = require('fs')

const bcrypt = require('bcrypt')
const User = require('../models/User')
const Article = require('../models/Article')

const {validateMail} = require('../util/validateMail')
const {generateToken} = require('../util/generateToken')
const {createId} = require('../util/createId')
const checkAuth = require('../util/check-auth')

let md5 = require('md5')

const NEW_COMMENT = 'NEW_COMMENT'

// @ts-ignore
module.exports = {
    Comment: {
        likeCount: (parent: any) => (parent.likes === null ? 0 : parent.likes.length) - (parent.dislikes === null ? 0 : parent.dislikes.length)
    },
    Article: {
        commentCount: (parent: any) => parent.comments === null ? 0 : parent.comments.length
    },
    Query: {
        // return all articles
        getAllArticles: async () => {
            return await Article.find().select('id perex title author title imageId createdAt lastUpdatedAt comments')
        },
        // returns the article that the user opened
        getArticle: async (_: any, {id}: { id: string }) => {
            const articleCheck = await Article.findById(id)

            if (articleCheck) {
                return articleCheck
            } else {
                throw new Error('Wrong ID!');
            }
        },
        // all articles of a specific person
        getArticleByUser: async (_: any, {user}: { user: string }) => {
            return await Article.find({author: user})
        },
        getRelatedArticles: async (_: any, {articleID}: { articleID: string }) => {
            let relatedArticles = await Article.find().select('id perex title author title imageId createdAt lastUpdatedAt comments')

            const randomize = (array: ArticleType[]) => {
                let currentIndex = array.length, randomIndex;
                while (currentIndex !== 0) {

                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    [array[currentIndex], array[randomIndex]] = [
                        array[randomIndex], array[currentIndex]];
                }

                return array;
            }

            if (relatedArticles.length > 3) {
                return randomize(relatedArticles.filter((f: ArticleType) => f.id !== articleID).slice(0, 3))
            }
        }
    },
    Mutation: {
        //creating an article and assigning an id
        createArticle: async (_: any, {input}: { input: ArticleType }, context: any) => {
            const user = checkAuth(context)

            let article = createId(input)
            article.imageId = md5(article.imageId) + '.jpg'

            const articleCheck = await Article.findOne({title: article.title})

            article.perex = article.content.split('.').slice(0, 3).join(' ')
                .replace(/[^0-9,.A-Za-z "]+/, '') //remove markdown syntax

            const newArticle = new Article({
                _id: article.id,
                content: article.content,
                perex: article.perex,
                title: article.title,
                imageId: article.imageId,
                createdAt: new Date().toISOString(),
                lastUpdatedAt: new Date().toISOString(),
                author: user.username,
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
        deleteArticle: async (_: any, {id}: { id: string }, context: any) => {
            const user = checkAuth(context)

            await Article.findByIdAndDelete(id)
            return id;
        },// update article by id,and assignment of new data
        updateArticle: async (_: any, {input}: { input: UpdateArticle }, context: any) => {
            const user = checkAuth(context)

            const isNameValid = await Article.findOne({title: input.title})

            if (!isNameValid) { // if an article with the same name already exists returns an error

                const article = await Article.findById(input.id) // get an article that we will update

                if (article) {
                    await Article.findByIdAndUpdate(input.id, {
                        title: input.title,
                        perex: input.perex,
                        content: input.content,
                        lastUpdatedAt: new Date().toISOString(),
                        imageId: input.imageId ? md5(input.imageId) + '.jpg' : article.imageId // if the picture has been changed, we encode its name, if not, then we leave the same
                    })
                } else {
                    throw new Error('Wrong ID!');
                }
            } else {
                throw Error('Duplicate name/id');
            }
        },// registration resolve
        registerNewUser: async (_: any, {input}: { input: NewUser }) => {

            const {valid, errors} = validateMail(input.email);
            if (!valid) {
                throw new UserInputError('Email is not valid!', {errors})
            }

            const user = await User.findOne({username: input.username})

            if (!user) {
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
            } else {
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
        createComment: async (_: any, {articleID, input}: { articleID: string, input: CommentType }, context: any) => {
            const {username} = checkAuth(context);

            let article = await Article.findById(articleID)

            let createdAt = new Date().toISOString()

            let id = md5(input.author + createdAt)

            if (article) {
                if (article.comments === null) {
                    article.comments = {
                        content: input.content,
                        author: username,
                        createdAt,
                        likes: null
                    }
                } else {
                    article.comments.unshift({
                        content: input.content,
                        author: username,
                        createdAt,
                        likes: null
                    })
                }

                await context.pubsub.publish(NEW_COMMENT, {
                    commentAdded: article.comments
                })

                await article.save()

                return article;
            } else {
                throw new Error('There is no such article!')
            }
        },
        likeComment: async (_: any, {commentID, articleID}: { commentID: string, articleID: string }, context: any) => {
            const {username} = checkAuth(context);

            const post = await Article.findById(articleID);
            if (post) {

                const comment = post.comments.find((comment: any) => comment.id === commentID);

                if (comment) {
                    if (comment.likes !== null) {
                        if(comment.likes.find((like: any) => like.username === username)){ //if the like has already been set, then it is removed
                            comment.likes = comment.likes.filter((like: any) => like.username !== username);
                        }
                        else if (comment.dislikes.find((dislike: any) => dislike.username === username) && !comment.likes.find((like: any) => like.username === username)) { // if we try to put a like but we already have a dislike, the dislike will be reset and the like will be put instead

                            comment.dislikes = comment.dislikes.filter((dislike: any) => dislike.username !== username);

                            comment.likes.push({
                                username,
                                createdAt: new Date().toISOString()
                            });
                        }
                        else { //if dislike and like are equal to 0, just push new like
                            comment.likes.push({
                                username,
                                createdAt: new Date().toISOString()
                            });
                        }
                    } else {
                        comment.likes = {
                            username,
                            createdAt: new Date().toISOString()
                        };
                    }
                } else {
                    throw new UserInputError('Comment not found');
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        },
        dislikeComment: async (_: any, {
            commentID,
            articleID
        }: { commentID: string, articleID: string }, context: any) => {
            const {username} = checkAuth(context);

            const post = await Article.findById(articleID);
            if (post) {

                const comment = post.comments.find((comment: any) => comment.id === commentID);

                if (comment) {
                    if (comment.dislikes !== null) {
                        console.log(comment.dislikes)
                        if(comment.dislikes.find((dislike: any) => dislike.username === username)){ // if the dislike has already been set, then it is removed
                            comment.dislikes = comment.dislikes.filter((dislike: any) => dislike.username !== username);
                        }
                        else if (comment.likes.find((like: any) => like.username === username) && !comment.dislikes.find((dislike: any) => dislike.username === username)) { // if we try to put a dislike but we already have a like, the like will be reset and the dislike will be put instead

                            comment.likes = comment.likes.filter((like: any) => like.username !== username);

                            comment.dislikes.push({
                                username,
                                createdAt: new Date().toISOString()
                            });
                        }
                        else { //if dislike and like are equal to 0, just push new like
                            comment.dislikes.push({
                                username,
                                createdAt: new Date().toISOString()
                            });
                        }
                    } else {
                        comment.dislikes = {
                            username,
                            createdAt: new Date().toISOString()
                        };
                    }
                } else {
                    throw new UserInputError('Comment not found');
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    },
    Subscription: {
        commentAdded: {
            subscribe: () => pubsub.asyncIterator(NEW_COMMENT)
        }
    },
    //file upload configuration
    Upload: GraphQLUpload
}
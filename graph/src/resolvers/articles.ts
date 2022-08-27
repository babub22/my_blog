import {ArticleType, UpdateArticle} from "../types/types";
const {createId} = require('../util/createId')

const checkAuth = require('../util/check-auth');
const Article = require("../models/Article");

let md5 = require('md5')

module.exports = {
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

        },
        deleteArticle: async (_: any, {id}: { id: string }, context: any) => {
            const user = checkAuth(context)

            await Article.findByIdAndDelete(id)
            return id;
        },
        // update article by id,and assignment of new data
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
        }
    }
};
import {CommentType} from "../types/types";
// @ts-ignore
import Article from "../models/Article";
let md5 = require('md5')

const { AuthenticationError, UserInputError } = require('apollo-server-express');

const checkAuth = require('../util/check-auth');

const {PubSub} = require('graphql-subscriptions');
const pubsub = new PubSub()

module.exports = {
    Mutation: {
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

                await context.pubsub.publish('NEW_COMMENT', {
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
            subscribe: () => pubsub.asyncIterator('NEW_COMMENT')
        }
    },
};
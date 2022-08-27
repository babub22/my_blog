const articleResolvers = require('./articles');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    Comment: {
        likeCount: (parent: any) => (parent.likes === null ? 0 : parent.likes.length) - (parent.dislikes === null ? 0 : parent.dislikes.length)
    },
    Article: {
        commentCount: (parent: any) => parent.comments === null ? 0 : parent.comments.length
    },
    Query: {
        ...articleResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...articleResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...commentsResolvers.Subscription
    }
};
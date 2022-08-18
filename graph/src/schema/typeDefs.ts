const {gql}=require("apollo-server-express");

export default gql`
    type Article{
        id:String
        content: String
        perex: String
        title: String
        imageId: String
        createdAt: String
        lastUpdatedAt: String
        author: String
        comments: [Comment]
    }

    type Comment{
        id:ID
        author:String
        content: String
        createdAt: String
        rating: Int
    }
 
    input ArticleInput{
        id:String
        content: String
        perex: String
        title: String
        imageId: String
        createdAt: String
        lastUpdatedAt: String
        author: String
        comments: [CommentInput]
    }
    input CommentInput{
        id:ID
        author:String
        content: String
        createdAt: String
        rating: Int
    }
    
    input UpdateArticleInput{
        id:String
        content: String
        perex: String
        title: String
        imageId: String
        lastUpdatedAt: String
    }

    type Query {
        getAllArticles:[Article]
        getArticle(id:ID!):Article
    }

    scalar Upload
    #

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
    
    type Mutation {
        createArticle(input: ArticleInput):Article
        deleteArticle(id:ID!):String
        singleUpload(file: Upload!): File!
        updateArticle(input: UpdateArticleInput!): Article
    }

    type Subscription {
        newArticle:Article!
    }
`


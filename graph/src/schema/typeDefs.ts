const {gql}=require("apollo-server-express");

export default gql`
    type Article{
        id:ID
        content: String
        perex: String
        title: String
        imageId: String
        createdAt: String
        lastUpdatedAt: String
        author: String
        comments: [Comment]
    }

    input ArticleInput{
        id:ID
        content: String
        perex: String
        title: String
        imageId: String
        createdAt: String
        lastUpdatedAt: String
        author: String
        comments: [CommentInput]
    }
    
    
    
    type Comment{
        id:ID
        author:String
        content: String
        createdAt: String
        rating: Int
    }

    input CommentInput{
        id:ID
        author:String
        content: String
        createdAt: String
        rating: Int
    }
    
    type User{
        id:ID!
        username:String
        token:String
        createdAt:String
        email:String
    }

    input RegistrationFormInput{
        username:String
        password:String
        email:String
    }
    
    
    
    input UpdateArticleInput{
        id:ID
        content: String
        perex: String
        title: String
        imageId: String
        lastUpdatedAt: String
    }

    type Query {
        getAllArticles:[Article]
        getArticle(id:ID!):Article
        getArticleByUser(user:String!):[Article]
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
        registerNewUser(input:RegistrationFormInput!):User!
        login(username:String!, password:String!):User!
    }

    type Subscription {
        newArticle:Article!
    }
`


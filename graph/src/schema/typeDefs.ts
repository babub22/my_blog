const {gql}=require("apollo-server-express");

module.exports=gql`
    # Article types
    type Article{
        id:ID
        content: String
        perex: String
        title: String
        imageId: String
        createdAt: String
        lastUpdatedAt: String
        author: String
        commentCount: Int
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
        likeCount: Int
        likes: [Like]
        dislikes:[Dislike]
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }

    type Dislike {
        id: ID!
        createdAt: String!
        username: String!
    }

    input CommentInput{
        author:String
        content: String
        createdAt: String
    }
    
    # Login and sing up types
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

    # Determining the type for uploading files
    scalar Upload

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Query {
        # Get all articles
        getAllArticles:[Article]
        
        # Get one article by id
        getArticle(id:ID!):Article
        
        # Get articles of specific user
        getArticleByUser(user:String!):[Article]
        
        getRelatedArticles(articleID:ID!):[Article]
    }
    
    type Mutation {
        # Create article from the information received from the client(input:content,title,img...)
        createArticle(input: ArticleInput):Article
        
        # Delete article by ID
        deleteArticle(id:ID!):String
        
        # Upload image
        singleUpload(file: Upload!): File!
        
        # Update(edit) article by id(id contains in input), input also contains edited content,title,img
        updateArticle(input: UpdateArticleInput!): Article
        
        # Register new user(RegistrationFormInput: email,username,password form frontend)
        registerNewUser(input:RegistrationFormInput!):User!
        
        # Login for already exist users
        login(username:String!, password:String!):User!
        
        # Create comment for specific article(articleID)
        createComment(articleID:String!,input:CommentInput!):Article!

        # Like comment by commentID
        likeComment(commentID: ID!,articleID:ID!):Article!

        # Dislike comment by commentID
        dislikeComment(commentID: ID!,articleID:ID!):Article!
    }

    type Subscription {
        # Real-time comment(not work)
        commentAdded: Comment
    }
`


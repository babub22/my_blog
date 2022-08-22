const {model,Schema}=require('mongoose')

const articleSchema=new Schema({
    _id:String,
    content: String,
    perex: String,
    title: String,
    imageId: String,
    createdAt: String,
    commentCount:Number,
    lastUpdatedAt: String,
    author: String,
    comments: [{
        author:String,
        content: String,
        createdAt: String,
        likeCount:Number,
        likes: [{
            createdAt: String,
            username: String,
        }],
        dislikes: [{
            createdAt: String,
            username: String,
        }]
    }]
})

module.exports=model('Article',articleSchema)
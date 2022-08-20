const {model,Schema}=require('mongoose')

const articleSchema=new Schema({
    _id:String,
    content: String,
    perex: String,
    title: String,
    imageId: String,
    createdAt: String,
    lastUpdatedAt: String,
    author: String,
    comments: [{
        author:String,
        content: String,
        createdAt: String,
        rating: Number
    }]
})

module.exports=model('Article',articleSchema)
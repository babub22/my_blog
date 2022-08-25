import {gql} from '@apollo/client'

export let GET_ALL_ARTICLES = gql`
    query{
        getAllArticles{
            id,perex,title,author,title,imageId,createdAt,lastUpdatedAt,commentCount,comments{id}
        }
    }
`

export let GET_ONE_ARTICLE = gql`
    query getArticle($id: ID!){
        getArticle(id: $id) {
            id,
            content,
            perex,
            title,
            imageId,
            createdAt,
            lastUpdatedAt,
            author,
            commentCount,
            comments {
                id,
                author,
                content,
                createdAt,
                likeCount,
                likes {
                    id,
                    username,
                    createdAt,
                },dislikes
                {
                    id,
                    username,
                    createdAt,
                }
            }
        }
    }
`

export let GET_ARTICLE_BY_USER = gql`
    query getArticleByUser($user:String!){
        getArticleByUser(user:$user){
            id,content,perex,title,author,imageId,title,createdAt,commentCount,lastUpdatedAt,comments{id}
        }
    }
`

export let GET_RELATED_ARTICLES=gql`
    query getRelatedArticles($articleID:ID!){
        getRelatedArticles(articleID: $articleID){
            id,content,perex,title,author,imageId,title,createdAt,commentCount,lastUpdatedAt,comments{id}
        }
    }   
`
import {gql} from '@apollo/client'

export let GET_ALL_ARTICLES = gql`
    query{
        getAllArticles{
            id,perex,title,author,title,imageId,createdAt,lastUpdatedAt,comments{id}
        }
    }
`

export let GET_ONE_ARTICLE = gql`
    query getArticle($id: ID!){
            getArticle(id: $id){
            id,content,perex,title,author,imageId,title,createdAt,lastUpdatedAt,comments{id}
        }
    }
`

export let GET_ARTICLE_BY_USER=gql`
    query getArticleByUser($user:String!){
        getArticleByUser(user:$user){
            id,content,perex,title,author,imageId,title,createdAt,lastUpdatedAt,comments{id}
        }
    }

`

// export let GET_ONE_IMAGE = gql`
//     query getImageFile($file: Upload!){
//         getImageFile(file: $file){
//             __typename
//         }
//     }
// `
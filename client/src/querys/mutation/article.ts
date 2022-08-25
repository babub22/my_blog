import {gql} from '@apollo/client';

export const CREATE_ARTICLE = gql`
    mutation createArticle($input:ArticleInput){
        createArticle(input:$input){
            id,content,perex,title,author,imageId,createdAt,lastUpdatedAt,comments{id}
        }
    }
`

export const DELETE_ARTICLE = gql`
    mutation deleteArticle($id: ID!){
            deleteArticle(id: $id)
    }
`

export const UPDATE_ARTICLE = gql`
    mutation updateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
        id,content,perex,imageId,title
    }
}`

export const UPLOAD_IMAGE = gql`
    mutation singleUpload($file: Upload!) {
        singleUpload(file: $file){
            __typename
        }
    }
`;

export const CREATE_COMMENT = gql`
    mutation createComment($articleID:String!,$input:CommentInput!) {
        createComment(articleID:$articleID,input:$input){
            comments {
                id,author,createdAt,content,likes{username},dislikes{username}
            }
        }
    }
`;

export const REGISTER_USER = gql`
    mutation registerNewUser($input: RegistrationFormInput!) {
        registerNewUser(input: $input){
            id,username,token,email,createdAt
        }
    }
`;

export const LOGIN = gql`
    mutation login($username:String!,$password:String!) {
        login(username:$username,password: $password){
            id,username,token,email,createdAt
        }
    }
`;

export const LIKE_COMMENT = gql`
    mutation likeComment($articleID: ID!,$commentID:ID!) {
        likeComment(articleID: $articleID,commentID:$commentID) {
            id
            comments {
                likes {
                    id
                    createdAt
                    username
                }
                likeCount
            }
        }
    }
`;

export const DISLIKE_COMMENT = gql`
    mutation dislikeComment($articleID: ID!,$commentID:ID!) {
        dislikeComment(articleID: $articleID,commentID:$commentID) {
            id
            comments {
                likes {
                    id
                    createdAt
                    username
                }
                likeCount
            }
        }
    }
`;


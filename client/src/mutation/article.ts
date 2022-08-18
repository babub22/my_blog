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



// export const UPLOAD_ARTICLE_IMAGE=gql`
//         mutation UploadImage($file:Upload!){
//             uploadFile(file:$file)
//         }
//     `


// const MUTATION = gql`
//   mutation ($file: Upload!) {
//     uploadFile(file: $file) {
//       success
//     }
//   }
// `;
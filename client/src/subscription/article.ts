import {gql} from '@apollo/client'

const COMMENTS_SUBSCRIPTION = gql`
    subscription getAllArticles{
        id,perex,title,author,title,imageUrl,createdAt,lastUpdatedAt,comments{id}
    }
`;
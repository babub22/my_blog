import {gql} from '@apollo/client'

export const COMMENTS_SUBSCRIPTION = gql`
    subscription commentAdded{
        commentAdded{
            id
            content
        }
    }
`;


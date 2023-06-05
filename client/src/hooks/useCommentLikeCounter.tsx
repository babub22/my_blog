
import { LIKE_COMMENT,DISLIKE_COMMENT } from "../querys/mutation/article";
import { useMutation } from "@apollo/client";

export function useCommentLikeCounter(articleID:string){
    const [likeComment] = useMutation(LIKE_COMMENT);
    const [dislikeComment] = useMutation(DISLIKE_COMMENT);

    const plusLike = (commentID: string) => {
        likeComment({
            variables: {
                articleID,
                commentID,
            }
        })
    }

    const minusLike = (commentID: string) => {
        dislikeComment({
            variables: {
                articleID,
                commentID,
            }
        })
    }

    return {plusLike,minusLike}
}
import { Box, Typography } from "@mui/material";
import { useCommentLikeCounter } from "../../hooks/useCommentLikeCounter";
import { Comments, User } from "../../types/types";
import { AuthContext } from "../../context/auth";
import { useContext } from "react";
import { LikeButton } from "./buttons/LikeButton";
import { DislikeButton } from "./buttons/DislikeButton";

export function CommentRating({
  comment,
  articleID,
}: {
  articleID: string;
  comment: Comments;
}) {
  const { user }: { user: User | null } = useContext(AuthContext);
  const { plusLike, minusLike } = useCommentLikeCounter(articleID);

  return (
    <Box sx={{ display: "flex", alignItems: "baseline" }}>
      <Typography variant="subtitle1">
        {comment.likeCount > 0 ? "+" + comment.likeCount : comment.likeCount}
        &nbsp; |
        <LikeButton plusLike={plusLike} comment={comment} user={user} />
        |
        <DislikeButton minusLike={minusLike} comment={comment} user={user} />
      </Typography>
    </Box>
  );
}

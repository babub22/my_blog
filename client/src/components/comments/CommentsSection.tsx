import { NoCommentsSection } from "./NoCommentsSection";
import { Avatar, Box } from "@mui/material";
import { Comments } from "../../types/types";
import { CommentRating } from "./CommentRating";
import { CommentAuthorNameInfo } from "./CommentAuthorNameInfo";
import ReactMarkdown from "react-markdown";

export default function CommentsSection({
  comments,
  articleID,
}: {
  comments: Comments[];
  articleID: string;
}) {
  if (!Boolean(comments)) {
    return <NoCommentsSection />;
  }

  return <CommentsList comments={comments} articleID={articleID} />;
}

function CommentsList({
  comments,
  articleID,
}: {
  comments: Comments[];
  articleID: string;
}) {
  return (
    <>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mt: "1.5rem", display: "flex" }}>
          <CommentAuthorAvatar comment={comment} />
          <CommentBody comment={comment} articleID={articleID} />
        </Box>
      ))}
    </>
  );
}

function CommentAuthorAvatar({ comment }: { comment: Comments }) {
  const authorNameFirstCharacter = comment!.author[0];

  return <Avatar>{authorNameFirstCharacter}</Avatar>;
}

function CommentBody({
  comment,
  articleID,
}: {
  comment: Comments;
  articleID: string;
}) {
  return (
    <Box
      sx={{
        ml: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
      }}
    >
      <CommentAuthorNameInfo comment={comment} />
      <ReactMarkdown children={comment.content} />
      <CommentRating comment={comment} articleID={articleID} />
    </Box>
  );
}

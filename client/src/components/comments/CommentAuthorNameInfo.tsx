import { Box, Typography } from "@mui/material";
import { Comments } from "../../types/types";
import moment from "moment";

export function CommentAuthorNameInfo({ comment }: { comment: Comments }) {
  const timeFromCreating = moment(comment.createdAt).fromNow();

  return (
    <Box sx={{ display: "flex", alignItems: "baseline" }}>
      <Typography variant="h6">{comment.author}</Typography>
      <Typography sx={{ ml: "1rem" }} variant="body2">
        {timeFromCreating}
      </Typography>
    </Box>
  );
}

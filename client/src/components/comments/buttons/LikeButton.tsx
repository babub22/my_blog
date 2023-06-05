import { IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Comments, User } from "../../../types/types";
import { green, grey } from "@mui/material/colors";

export function LikeButton({
  comment,
  plusLike,
  user,
}: {
  user: User | null;
  plusLike: Function;
  comment: Comments;
}) {
  return (
    <IconButton
      aria-label="delete"
      color="primary"
      onClick={() => plusLike(comment.id)}
    >
      {comment.likes?.find((f) => f.username === user?.username) ? (
        <ExpandLessIcon sx={{ color: green[900] }} />
      ) : (
        <ExpandLessIcon sx={{ color: grey[500] }} />
      )}
    </IconButton>
  );
}

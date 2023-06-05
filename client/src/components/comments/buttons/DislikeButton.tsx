import { IconButton } from "@mui/material";
import { Comments, User } from "../../../types/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey, red } from "@mui/material/colors";

export function DislikeButton({
  comment,
  minusLike,
  user,
}: {
  user: User | null;
  minusLike: Function;
  comment: Comments;
}) {
  return (
    <IconButton
      aria-label="delete"
      color="primary"
      onClick={() => minusLike(comment.id)}
    >
      {comment.dislikes?.find((f) => f.username === user?.username) ? (
        <ExpandMoreIcon sx={{ color: red[900] }} />
      ) : (
        <ExpandMoreIcon sx={{ color: grey[500] }} />
      )}
    </IconButton>
  );
}

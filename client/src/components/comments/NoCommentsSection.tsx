import { Box, Typography } from "@mui/material";

export function NoCommentsSection() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography variant="h4" sx={{ opacity: 0.2, mt: "4rem", mb: "4rem" }}>
        No comments
      </Typography>
    </Box>
  );
}

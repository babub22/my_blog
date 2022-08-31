import React, {useContext, useState} from 'react';
import {Avatar, Box, IconButton, Typography} from "@mui/material";
import ReactMarkdown from "react-markdown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {DISLIKE_COMMENT, LIKE_COMMENT} from "../../querys/mutation/article";
import {Comments, User} from '../../types/types';
import {green, grey, pink, red} from "@mui/material/colors";
import {AuthContext} from "../../context/auth";

const Comment = ({comments, articleID}: { comments: Comments[] | null, articleID: string }) => {
    let {user}: { user: User | null } = useContext(AuthContext)

    let [likeCounter, setLikeCounter] = useState(0);

    const [likeComment] = useMutation(LIKE_COMMENT);
    const [dislikeComment] = useMutation(DISLIKE_COMMENT);

    const plusLike = (commentID: string) => {
        likeComment({
            variables: {
                articleID,
                commentID,
            }
        })


        setLikeCounter(likeCounter + 1)
    }

    const minusLike = (commentID: string) => {
        dislikeComment({
            variables: {
                articleID,
                commentID,
            }
        })

        setLikeCounter(likeCounter - 1)
    }

    if (comments !== null) {
        return (
            <>
                {comments.map(
                    comment =>
                        <Box key={comment.id} sx={{mt: '1.5rem', display: 'flex'}}>
                            <Avatar>{comment!.author.split('')[0]}</Avatar>

                            <Box sx={{ml: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'baseline'}}>
                                <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                                    <Typography variant='h6'>{comment.author}</Typography>
                                    <Typography sx={{ml: '1rem'}}
                                                variant='body2'>{moment(comment.createdAt).fromNow()}</Typography>
                                </Box>
                                <ReactMarkdown children={comment.content}/>
                                <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                                    <Typography variant='subtitle1'>
                                        {comment.likeCount > 0 ? '+' + comment.likeCount : comment.likeCount}
                                        &nbsp; |
                                        <IconButton aria-label="delete" color="primary"
                                                    onClick={() => plusLike(comment.id)}>
                                            {comment.likes?.find(f=>f.username===user?.username)?
                                                <ExpandLessIcon sx={{ color: green[900] }}/>
                                                :
                                                <ExpandLessIcon sx={{ color: grey[500] }}/>
                                            }
                                        </IconButton>
                                        |
                                        <IconButton aria-label="delete" color="primary"
                                                    onClick={() => minusLike(comment.id)}>
                                            {comment.dislikes?.find(f=>f.username===user?.username)?
                                                <ExpandMoreIcon sx={{ color: red[900] }}/>
                                                :
                                                <ExpandMoreIcon sx={{ color: grey[500] }}/>
                                            }
                                        </IconButton>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                )}
            </>
        );
    } else {
        return (
            <Box display="flex"
                 justifyContent="center"
                 alignItems="center">
                <Typography variant='h4' sx={{opacity: 0.2, mt: '4rem', mb: '4rem'}}>
                    No comments
                </Typography>
            </Box>
        )
    }
};


export default Comment;
import React, {useState} from 'react';
import {Avatar, Box, IconButton, Typography} from "@mui/material";
import ReactMarkdown from "react-markdown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Comment = () => {

    let [likeCounter, setLikeCounter] = useState(0);

    const plusLike = () => {
        setLikeCounter(likeCounter + 1)
    }

    const minusLike = () => {
        setLikeCounter(--likeCounter)
    }

    return (
        <>
                <Box sx={{mt: '1.5rem', display: 'flex'}}>
                    <Avatar>Z</Avatar>

                    <Box sx={{ml: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'baseline'}}>
                        <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                            <Typography variant='h6'>Nansdasd Adasdas</Typography>
                            <Typography sx={{ml: '1rem'}} variant='body2'>2 hour ago</Typography>
                        </Box>
                        <ReactMarkdown >###You see,wire telegraph ###isakind ofavery,very long cat.You pull his tail in
                            New York and his
                            head is meowing in Los Angeles.Do you understand this?And radio operates exactly the
                            same
                            way:you send signals here,they receive them there.The only difference is that there
                            is no cat.</ReactMarkdown>
                        <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                            <Typography variant='subtitle1'>
                                {likeCounter > 0 ? '+' + likeCounter : likeCounter}&nbsp;
                                |
                                <IconButton aria-label="delete" color="primary" onClick={plusLike}>
                                    <ExpandLessIcon/>
                                </IconButton>
                                |
                                <IconButton aria-label="delete" color="primary" onClick={minusLike}>
                                    <ExpandMoreIcon/>
                                </IconButton>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

        </>
    );
};

export default Comment;
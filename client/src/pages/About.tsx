import React from 'react';
import {IconButton, Typography} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';

const About = () => {
    return (
        <>
            <Typography variant='h4'>
                About project:
            </Typography>
            <Typography variant='h6' sx={{mt:"0.5rem"}}>
                made by Vladyslav Lisovyi
            </Typography>

            <IconButton sx={{m:0,p:0,mt:'1rem'}} href='https://github.com/babub22'>
                GitHub&nbsp;<GitHubIcon />
            </IconButton>

        </>
    );
};

export default About;
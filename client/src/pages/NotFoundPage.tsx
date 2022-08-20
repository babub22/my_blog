import {Box, Typography} from '@mui/material';
import React, {useContext} from 'react';
import {User} from "../types/types";
import {AuthContext} from "../context/auth";

const NotFoundPage = () => {

    let {user}: { user: User | null } = useContext(AuthContext)

    setTimeout(function() {
        user? window.location.replace('/') : window.location.replace('/login');
    }, 3000);

    return (
        <Box display="flex"
             justifyContent="center"
             alignItems="center">
            <Typography variant='h1' sx={{opacity: 0.2,mt:'10rem'}}>
                404 page not found :(
            </Typography>
        </Box>
    );
};

export default NotFoundPage;
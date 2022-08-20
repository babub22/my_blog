import {Box, Button, Toolbar, createTheme, Typography, AppBar} from "@mui/material";
import * as React from 'react';
import {ThemeProvider} from '@emotion/react';
import {useContext} from "react";
import {AuthContext} from "../context/auth";

const Header = () => {

    const {user, logout} = useContext(AuthContext)

    const navItems = user ? [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Create article",
            href: "/create",
        },
        {
            label: "My Articles",
            href: "/my-articles",
        },
        {
            label: "About",
            href: "/about",
        }] : [
        {
            label: "Register",
            href: "/registration",
        },
        {
            label: "Login",
            href: "/login",
        }
    ];

    const theme = createTheme({
        palette: {
            primary: {
                main: '#e0e0e0',
            },
            secondary: {
                main: '#8c9eff',
            },
        }
    });


    return (
        <ThemeProvider theme={theme}>
            <AppBar component="nav">
                <Toolbar sx={{m: 0, p: 0}}>
                    <Typography
                        variant="h6"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                        onClick={()=>{ user? window.location.replace('/'): window.location.replace('/login')}}
                    >
                        ArticleReader
                    </Typography>
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        {navItems.map((item) => (
                            <Button key={item.label} href={item.href}
                                    sx={{color: '#212121', ml: '1.5rem'}}>
                                {item.label}
                            </Button>
                        ))}
                        {user ? <Button sx={{color: '#212121', ml: '1.5rem'}} onClick={logout} href='/login'>Logout</Button> : null}
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default Header;



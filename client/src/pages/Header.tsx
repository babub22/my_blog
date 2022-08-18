import {Box,Button,Toolbar,ListItemText,createTheme,Typography,ListItemButton,ListItem,List,IconButton,Drawer,Divider,AppBar} from "@mui/material";
import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {ThemeProvider} from '@emotion/react';

const navItems = [{
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
    }];

const drawerWidth = 240;

export default function DrawerAppBar(props: any) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                ArticleReader
            </Typography>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton href={item.href} sx={{textAlign: 'center'}}>
                            <ListItemText primary={item.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

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
            <Box sx={{display: 'flex'}}>
                <AppBar component="nav">
                    <Toolbar sx={{m: 0, p: 0}}>
                        <IconButton
                            color="secondary"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                        >
                            ArticleReader
                        </Typography>
                        <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                            {navItems.map((item) => (
                                <Button key={item.label} href={item.href} sx={{color: '#212121',ml:'1.5rem'}}>
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box component="nav">
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: {xs: 'block', sm: 'none'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Box>
            </Box>
        </ThemeProvider>
    );
}



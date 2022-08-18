import React from 'react';
import {useRoutes, BrowserRouter as Router} from 'react-router-dom';
import { Container } from '@mui/material';

import Header from './pages/Header';
import Main from './pages/Main';
import About from "./pages/About";
import Create from "./pages/Create";
import MyArticles from "./pages/MyArticles";
import Edit from "./pages/Edit";
import SpecificArticle from "./pages/SpecificArticle";

const App = () => {
    const routes = useRoutes([
        {path: "/", element: <Main />},
        {path: "/about", element: <About/>},
        {path: "/create", element: <Create/>},
        {path: "/my-articles", element: <MyArticles/>},
        {path: "/edit/:number", element: <Edit/>},
        {path:'/article/:number',element:<SpecificArticle/>}
    ]);
    return routes;
};

function AppWrapper() {
    return (
        <>
            <div>
                <Header/>
            </div>
            <Container sx={{mt: '5rem'}}>
                <Router>
                    <App/>
                </Router>
            </Container>
        </>
    );
}

export default AppWrapper;

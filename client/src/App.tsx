import React, {useContext} from 'react';
import {useRoutes, BrowserRouter as Router} from 'react-router-dom';
import { Container } from '@mui/material';

import Header from './pages/Header';
import Main from './pages/Main';
import About from "./pages/About";
import Create from "./pages/Create";
import MyArticles from "./pages/MyArticles";
import Edit from "./pages/Edit";
import SpecificArticle from "./pages/SpecificArticle";
import Register from "./pages/Register";
import Login from './pages/Login';

import {AuthContext, AuthProvider} from '../src/context/auth'
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {

    const {user}=useContext(AuthContext)

    const routes = useRoutes(
        user? [
            {path: "/", element: <Main />},
            {path: "/about", element: <About/>},
            {path: "/create", element: <Create/>},
            {path: "/my-articles", element: <MyArticles/>},
            {path: "/edit/:number", element: <Edit/>},
            {path:'/article/:number',element:<SpecificArticle/>},
            {path:'*',element:<NotFoundPage/>}
        ] : [
            {path:'/registration',element:<Register/>},
            {path:'/login',element:<Login/>},
            {path:'*',element:<NotFoundPage/>}
        ]
    );
    return routes;
};


function AppWrapper() {
    return (
        <AuthProvider>
            <div>
                <Header/>
            </div>
            <Container sx={{mt: '5rem'}}>
                <Router>
                    <App/>
                </Router>

            </Container>
        </AuthProvider>
    );
}

export default AppWrapper;

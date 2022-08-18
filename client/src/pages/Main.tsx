import React, {useEffect, useMemo, useState} from 'react';
import {Box,Typography} from "@mui/material";
import Search from "../components/searchBar/Search";
import ArticleList from "../components/ArticleList";
import Filter from "../components/searchBar/Filter";
import {useQuery} from "@apollo/client";
import {GET_ALL_ARTICLES} from "../query/article";

const Main = () => {

    const [search, setSearch] = useState<string>('');
    const [select, setSelect] = useState<string>('');

    let {data,loading,error}=useQuery(GET_ALL_ARTICLES)

    let [articles, setArticles] = useState([]);

    // fetch data from server
    useEffect(()=>{
        if(!loading){
            setArticles(data.getAllArticles)
        }
    },[data])

    // Handle select filter
    const handleSelect = (e: any) => {
        setSelect(e.target.value)
    }

    function getFilteredList() {
        if (!select) {
            return articles;
        }
        // @ts-ignore
        return articles.filter((article) => article.author.toLowerCase() === select.toLowerCase());
    }

    let filteredList = useMemo(getFilteredList, [select, articles]);

    // Handle search
    const handleSearch = (e: any) => {
        if (!e.target.value) {
            setArticles(data.getAllArticles);
            setSearch('');
            return;
        }

        setSearch(e.target.value);
        setArticles(
            // @ts-ignore
            articles.filter((article) =>
                // @ts-ignore
                article.title.toLowerCase().includes(e.target.value.toLowerCase())
            ))
    };



    return (
        <>
            <Typography variant='h3'>
                Articles
            </Typography>
            <Box sx={{borderBottom: '1px solid #bebebe',pb:'1rem'}}>
                <Search
                    value={search}
                    onChange={handleSearch}
                />
                <Filter value={select}
                        onChange={handleSelect}
                    // @ts-ignore
                        authors={articles.map(article => article.author)}
                />
            </Box>
            {articles.length===0
                ?
                <Box display="flex"
                     justifyContent="center"
                     alignItems="center">
                    <Typography variant='h1' sx={{opacity: 0.2,mt:'10rem'}}> There are no articles :( </Typography>
                </Box>
                :
            <ArticleList
                articles={filteredList}
            />}
        </>
    );

};

export default Main;
import React, {useEffect, useMemo, useState} from 'react';
import {Box, LinearProgress, Typography} from "@mui/material";
import Search from "../components/searchBar/Search";
import ArticleList from "../components/ArticleList";
import Filter from "../components/searchBar/Filter";
import {useQuery} from "@apollo/client";
import {GET_ALL_ARTICLES} from "../querys/query/article";
import {Article} from "../types/types";

const Main = () => {
    const [search, setSearch] = useState<string>('');
    const [select, setSelect] = useState<string>('');

    const [loading,setLoading]=useState(false)

    let {data:allArticles,loading:allArticlesLoading}=useQuery(GET_ALL_ARTICLES)

    let [articles, setArticles] = useState<Article[]>([]);

    // fetch data from server
    useEffect(()=>{
        if(!allArticlesLoading){
            setArticles(allArticles.getAllArticles)
            setLoading(true)
        }
    },[allArticles,allArticlesLoading])

    // Handle select filter
    const handleSelect = (e: any) => {
        setSelect(e.target.value)
    }

    function getFilteredList() {
        if (!select) {
            return articles;
        }
        return articles.filter((article) => article.author.toLowerCase() === select.toLowerCase());
    }

    let filteredList = useMemo(getFilteredList, [select, articles]);

    // Handle search
    const handleSearch = (e: any) => {
        if (!e.target.value) {
            setArticles(allArticles.getAllArticles);
            setSearch('');
            return;
        }

        setSearch(e.target.value);
        setArticles(
            articles.filter((article) =>
                article.title.toLowerCase().includes(e.target.value.toLowerCase())
            ))
    };

    if(!loading){
        return <LinearProgress color="inherit" sx={{ opacity:0.2}}/>
    }

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
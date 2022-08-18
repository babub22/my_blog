import React, {useEffect, useState} from 'react';
import {Avatar, Box, TextField, Typography} from "@mui/material";
import {useLocation } from "react-router-dom";
import RelatedList from "../components/RelatedList";
import ReactMarkdown from 'react-markdown'
import {useQuery} from "@apollo/client";
import {GET_ALL_ARTICLES, GET_ONE_ARTICLE} from "../query/article";
import Comment from "../components/comments/Comment";

const SpecificArticle = () => {


    let queryId = useLocation()
    // @ts-ignore
    queryId=queryId.pathname.toString().replace(/\/article\//,'')
    console.log(queryId)

    let {data: allArticles, loading: loadingAllArticles, error: errorAllArticles} = useQuery(GET_ALL_ARTICLES)
    let {data: oneArticle, loading: loadingOneArticle, error: errorOneArticle} = useQuery(GET_ONE_ARTICLE, {
        variables: {
            id: queryId
        }
    })

    let [relatedArticles, setRelatedArticles] = useState<any>([])
    let [currentArticle, setCurrentArticle] = useState<any>([])

    // fetch this article data
    useEffect(() => {
        if (!loadingOneArticle) {
            setCurrentArticle(oneArticle.getArticle)
        }
    }, [oneArticle])

    // fetch data for related articles
    useEffect(() => {
        if (!loadingAllArticles) {
            setRelatedArticles(allArticles.getAllArticles)//.filter(f=>f.id!==currentArticle))
        }
    }, [allArticles])


    // comment func
    let [likeCounter, setLikeCounter] = useState(0);

    const plusLike = () => {
        setLikeCounter(likeCounter + 1)
    }

    const minusLike = () => {
        setLikeCounter(--likeCounter)
    }

    // randomize for related articles
    const randomize=(array:any)=> {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    return (
        <>
            <Typography variant='h4'>{currentArticle.title}</Typography>

            <Box sx={{display: 'flex', mt: '1rem'}}>
                <Typography variant='subtitle1'>Author &nbsp; | &nbsp; 22/22/3021</Typography>
            </Box>

            <Box sx={{maxWidth: '650vw'}}>
                <Box sx={{mr: '1rem', mt: '1.5rem', mb: '1.5rem'}}>
                    <Box >
                        <Box sx={{mb: '1.2rem',objectFit: 'cover',height:'auto'}}>
                            <img

                                style={{  width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',}}
                                src={"http://localhost:8000/images/"+currentArticle.imageId}
                                alt={currentArticle.title}/>
                        </Box>

                        <ReactMarkdown // @ts-ignore
                            children={currentArticle.content}/>
                    </Box>

                    <Box sx={{borderTop: '2px solid #ededed', mb: '1.5rem'}}>
                        <Typography sx={{mt: '1rem', mb: '0.75rem'}} variant='h5'> Comments</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'baseline'}}>
                            <Avatar sx={{mr: '1.5rem'}}>Z</Avatar>
                            <TextField fullWidth variant="outlined" placeholder='Join the discussion'/>
                        </Box>

                        <Comment/>
                    </Box>
                </Box>

                {relatedArticles.length > 3
                    ?
                    <Box sx={{pl: '1rem', pb: '1.5rem', borderTop: '2px solid #ededed', height: '100%'}}>
                        <Box display="flex"
                             justifyContent="center"
                             alignItems="center"
                             sx={{mb:'2rem',mt:'2rem'}}>
                            <Typography variant='h5'>Related articles</Typography>
                        </Box>
                        <Box display="flex"
                             justifyContent="center"
                             alignItems="center">
                            <RelatedList  // @ts-ignore
                                articles={randomize(relatedArticles.filter(f =>f.id!=currentArticle.id))}/>
                        </Box>
                    </Box>
                    : null}
            </Box>

        </>
    );
};

export default SpecificArticle;

// 45
// 45
// https://www.target.com.au/medias/static_content/product/images/large/92/55/A1709255.jpg
//     https://www.target.com.au/medias/static_content/product/images/large/92/53/A1709253.jpg
//         b.box Spout Cup - Assorted*
// b.box Sippy Cup - Disney Princess Aurora
// b.box Sippy Cup - Disney Toy Story Woody
// $9
// $12
// $12
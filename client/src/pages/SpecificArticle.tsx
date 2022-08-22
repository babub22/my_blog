import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Box, Button, TextField, Typography} from "@mui/material";
import {useLocation} from "react-router-dom";
import RelatedList from "../components/RelatedList";
import ReactMarkdown from 'react-markdown'
import {useMutation, useQuery, useSubscription} from "@apollo/client";
import {GET_ALL_ARTICLES, GET_ONE_ARTICLE} from "../querys/query/article";
import Comment from "../components/comments/Comment";
import {Article, User} from '../types/types';
import {CREATE_COMMENT} from "../querys/mutation/article";
import {AuthContext} from "../context/auth";
import moment from "moment";

const SpecificArticle = () => {

    let {user}: { user: User | null } = useContext(AuthContext)

    // const { data, loading } = useSubscription(
    //     COMMENTS_SUBSCRIPTION);

    let urlString = useLocation()

    let queryId = urlString.pathname.toString().replace(/\/article\//, '')

    let [createComment, {loading: commentLoading}] = useMutation(CREATE_COMMENT);

    let {data: allArticles, loading: loadingAllArticles} = useQuery(GET_ALL_ARTICLES)
    let {data: oneArticle, loading: loadingOneArticle} = useQuery(GET_ONE_ARTICLE, {
        variables: {
            id: queryId
        }
    })

    let [relatedArticles, setRelatedArticles] = useState<Article[]>([])
    let [currentArticle, setCurrentArticle] = useState<Article>()

    let [commentContent, setCommentContent] = useState('')
    const [isCommentInvalid, setIsCommentInvalid] = useState(false);


    // fetch this article data
    useEffect(() => {
        if (!loadingOneArticle) {
            setCurrentArticle(oneArticle.getArticle)
        }
    }, [oneArticle])

    // fetch data for related articles
    useEffect(() => {
        if (!loadingAllArticles) {
            setRelatedArticles(allArticles.getAllArticles)
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
    const randomize = (array: any) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const sendComment = () => {

        !commentContent ? setIsCommentInvalid(true) : setIsCommentInvalid(false)

        if (commentContent) {
            createComment({
                variables: {
                    articleID: queryId,
                    input: {
                        author: user!.username,
                        content: commentContent
                    }
                }
            })
        }
    }

    return (
        <>
            <Typography variant='h4'>{currentArticle?.title}</Typography>
            <Box sx={{display: 'flex', mt: '1rem'}// @ts-ignore
            }> <Typography variant='subtitle1'>{currentArticle?.author}&nbsp;&nbsp; | &nbsp;&nbsp;{moment(currentArticle?.createdAt).format("DD/MM/YYYY")} </Typography>
            </Box>

            <Box sx={{maxWidth: '650vw'}}>
                <Box sx={{mr: '1rem', mt: '1.5rem', mb: '1.5rem'}}>
                    <Box>
                        <Box sx={{objectFit: 'cover', height: '600px'}}>
                            <img
                                style={{
                                    width: '800px',
                                    height: '600px',
                                    objectFit: 'cover',
                                }}
                                src={"http://localhost:8000/images/" + currentArticle?.imageId}
                                alt={currentArticle?.title}/>
                        </Box>

                        <ReactMarkdown // @ts-ignore
                            children={currentArticle?.content}/>
                    </Box>

                    <Box sx={{borderTop: '2px solid #ededed', mb: '1.5rem'}}>
                        <Typography sx={{mt: '1rem', mb: '0.75rem'}} variant='h5'> Comments {currentArticle?.commentCount?(currentArticle?.commentCount):null}</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'baseline'}}>
                            <Avatar sx={{mr: '1.5rem'}}>{user!.username.split('')[0]}</Avatar>
                            <TextField onChange={e => {
                                setCommentContent(e.target.value)
                            }}
                                       value={commentContent}
                                       error={isCommentInvalid}
                                       helperText={isCommentInvalid ? 'The comment cannot be empty' : null}
                                       fullWidth variant="outlined" placeholder='Join the discussion'/>
                            <Button onClick={() => sendComment()}> Send</Button>
                        </Box>
                        {!loadingOneArticle&&currentArticle?<Comment comments={
                            currentArticle.comments} articleID={currentArticle.id}/>:null}
                    </Box>
                </Box>

                {/*{relatedArticles.length > 3 ?*/}
                {/*    <RelatedList articles={relatedArticles.filter(f => f.id !== currentArticle?.id)}/>*/}
                {/*    : null}*/}
            </Box>

        </>
    );
};

export default SpecificArticle;
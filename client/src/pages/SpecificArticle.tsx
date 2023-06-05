import {useContext, useEffect, useState} from 'react';
import {Avatar, Box, Button, TextField, Typography} from "@mui/material";
import {useLocation} from "react-router-dom";
import RelatedList from "../components/RelatedList";
import ReactMarkdown from 'react-markdown'
import {useMutation, useQuery} from "@apollo/client";
import {GET_ONE_ARTICLE, GET_RELATED_ARTICLES} from "../querys/query/article";
import {Article, User} from '../types/types';
import {CREATE_COMMENT} from "../querys/mutation/article";
import {AuthContext} from "../context/auth";
import moment from "moment";
import CommentsSection from '../components/comments/CommentsSection';

const SpecificArticle = () => {

    let {user}: { user: User | null } = useContext(AuthContext)

    // const { data, loading } = useSubscription(
    //     COMMENTS_SUBSCRIPTION);

    let urlString = useLocation()

    let queryId = urlString.pathname.toString().replace(/\/article\//, '')

    let [createComment, {loading: commentLoading}] = useMutation(CREATE_COMMENT);

    let {data: getRelatedArticles, loading: loadingRelatedArticles} = useQuery(GET_RELATED_ARTICLES, {
        variables: {
            articleID: queryId
        }
    })

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
    }, [oneArticle,loadingOneArticle])

    // fetch data for related articles
    useEffect(() => {
        if (!loadingRelatedArticles) {
            setRelatedArticles(getRelatedArticles.getRelatedArticles)
        }
    }, [getRelatedArticles,loadingRelatedArticles])

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
            }).then(()=>{
                if(!commentLoading)
                    window.location.reload();
            })
        }
    }

    if(currentArticle)
    return (
        <>
            <Typography variant='h4'>{currentArticle?.title}</Typography>
            <Box sx={{display: 'flex', mt: '1rem'}
            }> <Typography variant='subtitle1'>{currentArticle?.author}&nbsp;&nbsp; | &nbsp;&nbsp;{moment(currentArticle?.createdAt).format("DD/MM/YYYY")} </Typography>
            </Box>

            <Box sx={{maxWidth: '650vw'}}>
                <Box sx={{mr: '1rem', mt: '1.5rem', mb: '1.5rem'}}>
                    <Box>
                        <Box sx={{objectFit: 'cover', height: '600px',pb: '1rem',}}>
                            <img
                                style={{
                                    width: '800px',
                                    height: '600px',
                                    objectFit: 'cover',
                                }}
                                src={"http://localhost:8000/images/" + currentArticle?.imageId}
                                alt={currentArticle?.title}/>
                        </Box>

                        <Box sx={{fontFamily: 'Roboto'}} >
                            <ReactMarkdown
                                children={currentArticle.content}/>
                        </Box>
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
                        {!loadingOneArticle && currentArticle && currentArticle.comments ?<CommentsSection comments={
                            currentArticle.comments} articleID={currentArticle.id}/>:null}
                    </Box>
                </Box>

                {relatedArticles!==null? <RelatedList articles={relatedArticles}/> : null}

            </Box>

        </>
    );
    else return null
};

export default SpecificArticle;
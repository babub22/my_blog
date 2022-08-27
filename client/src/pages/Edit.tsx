import React, {useEffect, useState} from 'react';
import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import {useMutation, useQuery} from "@apollo/client";
import {GET_ONE_ARTICLE} from "../querys/query/article";
import {useLocation} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {UPDATE_ARTICLE, UPLOAD_IMAGE} from "../querys/mutation/article";
import {SnackBarError, SnackBarSuccess} from "../components/SnackBar";

const Edit = () => {
        //get id from url string
        let urlString = useLocation()

        let queryId = urlString.pathname.toString().replace(/\/edit\//, '')

        //graphql query declaration
        let {data: oneArticle, loading: loadingOneArticle} = useQuery(GET_ONE_ARTICLE, {
            variables: {
                id: queryId
            }
        })
        let [editArticle, {loading: updateLoading}] = useMutation(UPDATE_ARTICLE);
        const [uploadImage] = useMutation(UPLOAD_IMAGE)

        // fetch this article data from server
        const [title, setTitle] = useState('')
        const [content, setContent] = useState('')
        const [originalImage, setOriginalImage] = useState('')
        const [imageUrl, setImageUrl] = useState<File>()

        useEffect(() => {
            if (!loadingOneArticle) {
                setTitle(oneArticle.getArticle.title)
                setContent(oneArticle.getArticle.content)
                setOriginalImage(oneArticle.getArticle.imageId)
            }
        }, [oneArticle,loadingOneArticle])

        //handle empty inputs
        const [isTitleInvalid, setIsTitleInvalid] = useState(false);
        const [isContentInvalid, setIsContentInvalid] = useState(false);
        const [isImageInvalid, setIsImageInvalid] = useState(false);

        //handle snackbar alerts
        const [isSuccess, setIsSuccess] = useState(false);
        const [errorHandle, setErrorHandle] = useState<Error>()

        //image change handle
        const onImageChange = (e: any) => {
            const file = (e.target.files[0])
            if (!file) return;
            setImageUrl(file)
            setOriginalImage('')
        }

        // send changes on server
        const handleEdit = () => {
            // validating input data <
            !title ? setIsTitleInvalid(true) : setIsTitleInvalid(false)
            content.split(' ').filter(f => f.length > 2).length < 20 ? setIsContentInvalid(true) : setIsContentInvalid(false)
            //imageUrl === undefined ? setIsImageInvalid(true) : setIsImageInvalid(false)
            // >

            if (title && content.split(' ').filter(f => f.length > 2).length > 20) {

                let perex: string = content.split('.').slice(0, 3).join(' ')//.concat('...');
                let id = queryId

                let imageId = imageUrl?.name

                editArticle({
                    variables: {
                        input: {
                            id,
                            title,
                            content,
                            perex,
                            imageId
                        }
                    }
                }).then(() => {
                    if (!updateLoading && originalImage === '') {
                        uploadImage({
                            variables: {file: imageUrl}
                        }).then(() => {
                            //if (!imageLoading) {
                            setIsSuccess(true)
                            setErrorHandle(undefined)
                            // }
                        }).catch(e => {
                            setErrorHandle(e)
                        })
                    } else {
                        setIsSuccess(true)
                        setErrorHandle(undefined)
                    }
                }).catch(e => {
                    setErrorHandle(e)
                })
            }
        }


        return (
            <>
                <Box sx={{display: 'flex'}}>
                    <Typography variant='h4'>
                        Edit artcile
                    </Typography>
                    <Button sx={{ml: '2.5rem'}} variant="contained" onClick={() => {
                        handleEdit()
                    }}>Update Article</Button>
                </Box>
                <Box sx={{mt: '3rem', width: '47vw'}}>
                    <Typography sx={{mb: '0.5rem'}} variant='body2'> Article Title </Typography>
                    <TextField fullWidth id="outlined-basic" placeholder="Article title" variant="outlined"
                               error={isTitleInvalid}
                               helperText={isTitleInvalid ? 'Title is required!' : null}
                               value={title}
                               onChange={e => {
                                   setTitle(e.target.value)
                               }}/>

                    <Typography sx={{mt: '2.5rem'}} variant='body2'> Featured image </Typography>

                    <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                        <Button variant="text" component="label">
                            Upload new
                            <input hidden accept="image/*" type="file" onChange={onImageChange}/>
                        </Button>
                        <>
                            <Typography>{
                                imageUrl !== undefined ? imageUrl.name : originalImage}</Typography>
                            {imageUrl !== undefined ?
                                <IconButton onClick={() => {
                                    setImageUrl(undefined)
                                }} aria-label="edit" color="primary">
                                    <DeleteIcon/>
                                </IconButton>
                                : null}
                        </>
                    </Box>
                    {isImageInvalid ?
                        <Typography variant='body2' sx={{ml: '0.5rem', color: '#de6363', mt: '0.2rem'}}>Upload an
                            image!</Typography> : null}

                    <Typography sx={{mt: '2.5rem', mb: '0.5rem'}} variant='body2'> Content </Typography>
                    <TextField fullWidth placeholder='Support markdown!'
                               multiline
                               error={isContentInvalid}
                               helperText={isContentInvalid ? 'Content is required!' : null}
                               rows={24} variant="outlined" value={content} onChange={e => {
                        setContent(e.target.value)
                    }}/>
                </Box>

                <SnackBarError error={errorHandle}/>
                <SnackBarSuccess success={isSuccess}/>
            </>
        );
    }
;

export default Edit;
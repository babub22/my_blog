import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, IconButton, Snackbar, TextField, Typography} from "@mui/material";
import {useMutation, useQuery} from "@apollo/client";
import {GET_ONE_ARTICLE} from "../query/article";
import {useLocation} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {UPDATE_ARTICLE, UPLOAD_IMAGE} from "../mutation/article";

const Edit = () => {
        //get id from url string
        let queryId = useLocation()
        // @ts-ignore
        queryId = queryId.pathname.toString().replace(/\/edit\//, '')
        console.log(queryId)

        //graphql query declaration
        let {data: oneArticle, loading: loadingOneArticle, error: errorOneArticle} = useQuery(GET_ONE_ARTICLE, {
            variables: {
                id: queryId
            }
        })
        let [editArticle, {data: updateArticle, loading: updateLoading, error: updateError}] = useMutation(UPDATE_ARTICLE);
        const [uploadImage, {data: image, loading: imageLoading, error: imageError}] = useMutation(UPLOAD_IMAGE)

        // fetch this article data from server
        const [title, setTitle] = useState('')
        const [content, setContent] = useState('')
        const [imageUrl, setImageUrl] = useState('')

        useEffect(() => {
            if (!loadingOneArticle) {
                setTitle(oneArticle.getArticle.title)
                setContent(oneArticle.getArticle.content)
                setImageUrl(oneArticle.getArticle.imageId)
            }
        }, [oneArticle])

        //handle empty inputs
        const [isTitleInvalid, setIsTitleInvalid] = useState(false);
        const [isContentInvalid, setIsContentInvalid] = useState(false);
        const [isImageInvalid, setIsImageInvalid] = useState(false);

        //handle snackbar alerts
        const [openAlert, setOpenAlert] = useState(false);

        const [alertType, setAlertType] = useState('error')
        const [errorHandle, setErrorHandle] = useState<any>('')

        const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return;
            }
            setOpenAlert(false);
        };

        //image change handle
        const onImageChange = (e: any) => {
            const file = (e.target.files[0])
            if (!file) return;
            setImageUrl(file)
        }

        // send changes on server
        const handleEdit = () => {
            setOpenAlert(false)

            if (!title) {
                setIsTitleInvalid(true)
            } else {
                setIsTitleInvalid(false)
            }
            if ((content.split(' ').filter(f => f.length > 2).length < 20)) {
                setIsContentInvalid(true)
            } else {
                setIsContentInvalid(false)
            }

            if (imageUrl.length == 0) {
                setIsImageInvalid(true)
            } else {
                setIsImageInvalid(false)
            }

            if (title && content.split(' ').filter(f => f.length > 2).length > 20 && imageUrl.length != 0) {

                let perex: string = content.split('.').slice(0, 3).join(' ')//.concat('...');
                let lastUpdatedAt = new Date()
                let id=queryId

                // @ts-ignore
                if (imageUrl.name) {// if image changed
                    // @ts-ignore
                    let imageId = imageUrl.name

                    editArticle({
                        variables: {
                            input: {
                                id,
                                title,
                                content,
                                perex,
                                lastUpdatedAt,
                                imageId
                            }
                        }
                    }).then(({data}) => {
                        if (!updateLoading) {
                            console.log(data)// @ts-ignore
                            // @ts-ignore
                            uploadImage({
                                variables: {file: imageUrl}
                            }).then(({data}) => {
                                if (!imageLoading) {
                                    console.log(data)
                                    setAlertType('success')
                                    setErrorHandle('')
                                    setOpenAlert(true);
                                }
                            }).catch(e => {
                                setOpenAlert(true);
                                setErrorHandle(e)
                                setAlertType('error')
                            })
                        }
                    }).catch(e => {
                        setOpenAlert(true);
                        setErrorHandle(e)
                        setAlertType('error')
                    })
                } else { // if the image is not changed
                    //let imageId = imageUrl
                    editArticle({
                        variables: {
                            input: {
                                id,
                                title,
                                content,
                                perex,
                                lastUpdatedAt
                            }
                        }
                    }).then(({data}) => {
                        console.log(data)
                        setAlertType('success')
                        setErrorHandle('')
                        setOpenAlert(true);
                    }).catch(e => {
                        setOpenAlert(true);
                        setErrorHandle(e)
                        setAlertType('error')
                    })
                }
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
                    }}>Publish Article</Button>
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
                        |
                        <>
                            <Typography>{// @ts-ignore
                                imageUrl.name ? imageUrl.name : imageUrl}</Typography>
                            {// @ts-ignore
                                imageUrl.length != 0 || imageUrl.name ?
                                    <IconButton onClick={() => {
                                        setImageUrl('')
                                    }} aria-label="edit" color="primary">
                                        <DeleteIcon/>
                                    </IconButton>
                                    : null}
                        </>
                    </Box>
                    {isImageInvalid ?
                        <Typography variant='body2' sx={{ml: '0.5rem', color: '#de6363', mt: '0.2rem'}}>Upload an
                            image!</Typography> : null}
                    {/*// <Button onClick={()=>{setImageUrls('')}}> X </Button>*/}

                    {/*|*/}
                    {/*<Button variant="text" component="label">*/}
                    {/*    Delete*/}
                    {/*</Button>*/}

                    <Typography sx={{mt: '2.5rem', mb: '0.5rem'}} variant='body2'> Content </Typography>
                    <TextField fullWidth placeholder='Support markdown!'
                               multiline
                               error={isContentInvalid}
                               helperText={isContentInvalid ? 'Content is required!' : null}
                               rows={24} variant="outlined" value={content} onChange={e => {
                        setContent(e.target.value)
                    }}/>
                </Box>
                <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleSnackbarClose}>
                    {// @ts-ignore
                        errorHandle.message === 'Duplicate name/id' ?
                            <Alert variant="filled" severity='error' sx={{width: '100%'}}>
                                This name is already in use, choose another one!
                            </Alert>
                            : alertType === 'error' ?
                                // @ts-ignore
                                <Alert variant="filled" severity={alertType} sx={{width: '100%'}}>
                                    Something went wrong :(
                                </Alert>
                                :
                                // @ts-ignore
                                <Alert variant="filled" severity={alertType} sx={{width: '100%'}}>
                                    The article has been sent successfully!
                                </Alert>}
                </Snackbar>
            </>
        );
    }
;

export default Edit;
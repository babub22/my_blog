import React, {useState} from 'react';
import {Alert, Box, Button, IconButton, Snackbar, TextField, Typography} from "@mui/material";
import {useMutation} from "@apollo/client";
import {CREATE_ARTICLE, UPLOAD_IMAGE} from "../mutation/article";
import DeleteIcon from '@mui/icons-material/Delete';

const Create = () => {
    //graphql query declaration
    let [createArticle, {data: user, loading: articleLoading, error: userError}] = useMutation(CREATE_ARTICLE);
    const [uploadImage, {data: image, loading: imageLoading, error: imageError}] = useMutation(UPLOAD_IMAGE)

    // const main variables
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrls] = useState('')

    // handle empty inputs
    const [isTitleInvalid, setIsTitleInvalid] = useState(false);
    const [isContentInvalid, setIsContentInvalid] = useState(false);
    const [isImageInvalid, setIsImageInvalid] = useState(false);

    //handle snackbar alerts
    const [openAlert, setOpenAlert] = useState(false);

    const [alertType, setAlertType] = useState('error')
    const [errorHandle, setErrorHandle] = useState('')

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    // handle image change
    const onImageChange = (e: any) => {
        const file = (e.target.files[0])
        if (!file) return;
        setImageUrls(file)
    }

    // create and send new article to a server
    const handleCreate = () => {
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
            console.log('Send it!')
            // @ts-ignore
            let perex: string = content.split('.').slice(0, 3).join(' ')//.concat('...');
            let createdAt = new Date()
            let lastUpdatedAt = new Date()
            let author = 'Dodik'
            // @ts-ignore
            let imageId = imageUrl.name
            console.log(imageId)

            createArticle({ // first send title+content
                variables: {
                    input: {
                        title,
                        content,
                        perex,
                        lastUpdatedAt,
                        createdAt,
                        imageId,
                        author
                    }
                }
            }).then(({data}) => {
                if (!articleLoading) {
                    console.log(data)
                }
                uploadImage({ // second send img
                    variables: {file: imageUrl}
                }).then(({data}) => {
                    if (!imageLoading) {
                        console.log(data)
                        setImageUrls('')
                        setAlertType('success')
                        setErrorHandle('')
                        setOpenAlert(true);
                        setContent('')
                        setTitle('')
                    }
                }).catch(e => {
                    setOpenAlert(true);
                    setErrorHandle(e)
                    setAlertType('error')
                })
            }).catch(e => {
                setOpenAlert(true);
                setErrorHandle(e)
                setAlertType('error')
            })
        }
    }

    return (
        <>
            {/* Name+ publish button */}
            <Box sx={{display: 'flex'}}>
                <Typography variant='h4'>
                    Create new artcile
                </Typography>
                <Button sx={{ml: '2.5rem'}}
                        variant="contained"
                        onClick={() => {
                            handleCreate()
                        }}
                >Publish Article</Button>
            {/*    */}
            {/*  Title input  */}
            </Box>
            <Box sx={{mt: '3rem', width: '47vw'}}>
                <Typography sx={{mb: '0.5rem'}} variant='body2'> Article Title </Typography>
                <TextField
                    onChange={e => {
                        setTitle(e.target.value)
                    }}
                    value={title}
                    error={isTitleInvalid}
                    helperText={isTitleInvalid ? 'Title is required!' : null}
                    fullWidth variant="outlined" placeholder='Article title'/>
            {/*   */}
            {/*  Image input  */}
                <Typography sx={{mt: '2.5rem'}} variant='body2'> Featured image </Typography>
                <Box sx={{display:'flex'}}>
                    <Button variant="text" component="label">
                        Upload
                        <input hidden accept="image/*" type="file" onChange={onImageChange}/>
                    </Button>
                    {imageUrl.length != 0 && // @ts-ignore
                    imageUrl.name ?
                        <>
                            <Typography>{// @ts-ignore
                                imageUrl.name}</Typography>

                            <IconButton onClick={()=>{setImageUrls('')}} aria-label="edit" color="primary" >
                                <DeleteIcon/>
                            </IconButton>
                        </> : null}
                </Box>
                {isImageInvalid ?
                    <Typography variant='body2' sx={{ml: '0.5rem', color: '#de6363', mt: '0.2rem'}}>Upload an
                        image!</Typography> : null}
            {/*   */}
            {/* Content input */}
                <Typography sx={{mt: '2.5rem', mb: '0.5rem'}} variant='body2'> Content </Typography>
                <TextField error={isContentInvalid}
                           helperText={isContentInvalid ? 'The article must contain at least 50 words!' : null}
                           onChange={e => setContent(e.target.value)}
                           fullWidth
                           multiline
                           value={content}
                           rows={24} variant="outlined" placeholder='Support markdown!'
                />
            {/*  */}
            {/*  Snackbar alerts  */}
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
            {/*    */}
            </Box>

        </>
    );
};

export default Create;
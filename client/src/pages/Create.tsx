import React, {useContext, useState} from 'react';
import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import {useMutation} from "@apollo/client";
import {CREATE_ARTICLE, UPLOAD_IMAGE} from "../querys/mutation/article";
import DeleteIcon from '@mui/icons-material/Delete';
import {AuthContext} from "../context/auth";
import {User} from '../types/types';
import {SnackBarError, SnackBarSuccess} from "../components/SnackBar";

const Create = () => {
    // graphql query declaration
    const [createArticle, {loading: articleLoading}] = useMutation(CREATE_ARTICLE);
    const [uploadImage] = useMutation(UPLOAD_IMAGE)

    // get current user info
    let {user}: { user: User | null } = useContext(AuthContext)

    // const main variables
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrls] = useState<File>()

    // handle empty inputs
    const [isTitleInvalid, setIsTitleInvalid] = useState(false);
    const [isContentInvalid, setIsContentInvalid] = useState(false);
    const [isImageInvalid, setIsImageInvalid] = useState(false);

    //handle snackbar alerts <
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorHandle, setErrorHandle] = useState<Error>()
    // >

    // handle image change <
    const onImageChange = (e: any) => {
        const file = (e.target.files[0])
        if (!file) return;
        setImageUrls(file)
    }
    // >

    // create and send new article to a server
    const handleCreate = () => {
        // validating input data <
        !title ? setIsTitleInvalid(true) : setIsTitleInvalid(false)
        content.split(' ').filter(f => f.length > 2).length < 20 ? setIsContentInvalid(true) : setIsContentInvalid(false)
        imageUrl === undefined ? setIsImageInvalid(true) : setIsImageInvalid(false)
        // >

        if (title && content.split(' ').filter(f => f.length > 2).length > 20 && imageUrl !== undefined && user !== null) {
            let author: string = user.username
            let imageId = imageUrl?.name

            createArticle({ // first send title+content
                variables: {
                    input: {
                        title,
                        content,
                        imageId,
                        author
                    }
                }
            }).then(() => {
                if (!articleLoading) {
                    uploadImage({ // second send img
                        variables: {file: imageUrl}
                    }).then(() => {
                        //if (!imageLoading) {
                        setIsSuccess(true)
                        setErrorHandle(undefined)

                        // make inputs fields empty after publish
                        setImageUrls(undefined)
                        setContent('')
                        setTitle('')
                        // }
                    }).catch(e => {
                        setErrorHandle(e)
                    })
                }
            }).catch(e => {
                setErrorHandle(e)
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
                <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                    <Button variant="text" component="label">
                        Upload
                        <input hidden accept="image/*" type="file" onChange={onImageChange}/>
                    </Button>
                    {imageUrl !== undefined &&
                    imageUrl.name ?
                        <Box sx={{display: 'flex', alignItems: 'baseline'}}>
                            <Typography>{imageUrl.name}</Typography>
                            <IconButton sx={{p: '0', m: '0'}} onClick={() => {
                                setImageUrls(undefined)
                            }} aria-label="edit" color="primary">
                                <DeleteIcon sx={{p: 0, m: 0}}/>
                            </IconButton>
                        </Box> : null}
                </Box>
                {isImageInvalid ?
                    <Typography variant='body2' sx={{ml: '0.5rem', color: '#de6363', mt: '0.2rem'}}>Upload an
                        image!</Typography> : null}
                {/*   */}
                {/* Content input */}
                <Typography sx={{mt: '2.5rem', mb: '0.5rem'}} variant='body2'> Content </Typography>
                <TextField error={isContentInvalid}
                           helperText={isContentInvalid ? 'The article must contain at least 20 words!' : null}
                           onChange={e => setContent(e.target.value)}
                           fullWidth multiline value={content}
                           rows={24} variant="outlined" placeholder='Support markdown!'
                />
                {/*  */}
                {/*  Snackbar alerts  */}
                <SnackBarError error={errorHandle}/>
                <SnackBarSuccess success={isSuccess}/>
                {/*    */}
            </Box>

        </>
    );
};

export default Create;
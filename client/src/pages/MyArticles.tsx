import React, {useContext, useEffect, useState} from 'react';
import {Alert, AlertColor, Box, Button, IconButton, Snackbar, Typography} from "@mui/material";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useMutation, useQuery} from "@apollo/client";
import {GET_ALL_ARTICLES, GET_ARTICLE_BY_USER, GET_ONE_ARTICLE} from "../querys/query/article";
import {DELETE_ARTICLE} from "../querys/mutation/article";
import {Article, User} from "../types/types";
import {AuthContext} from "../context/auth";


const MyArticles = () => {

    const {user}: { user: User | null } = useContext(AuthContext)

    // let {data: allArticles, loading: loadingAllArticles} = useQuery(GET_ALL_ARTICLES)
    let [deleteArticle, {loading: articleDeleting}] = useMutation(DELETE_ARTICLE);

    let {data: serverUserArticles, loading: loadingUserArticles} = useQuery(GET_ARTICLE_BY_USER, {
        variables: { //@ts-ignore
            user: user.username
        }
    })

    let [userArticles, setUserArticles] = useState<Article[]>([])
    let [isDelete, setIsDelete] = useState(false)

    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState<AlertColor>('error')

    // fetch data
    useEffect(() => {
        if (!loadingUserArticles) {
            setUserArticles(serverUserArticles.getArticleByUser)//.filter(f=>f.id!==currentArticle))
        }
        console.log(serverUserArticles)
    }, [serverUserArticles, isDelete])


    // handle delete button in table
    const getCommentNumber = (params: { row: { title: any; }; }) => {
        return (userArticles.filter(f => f.title === params.row.title).map(map => map.comments)).length || []
    }

    // table options
    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'Article title',
            width: 250,
            editable: false,
        },
        {
            field: 'perex',
            headerName: 'Perex',
            width: 350,
            editable: false,
        },
        {
            field: 'author',
            headerName: 'Author',
            width: 200,
            editable: false,
        },
        {
            field: 'commentsNumber',
            headerName: '# of comments',
            sortable: true,
            width: 160,
            valueGetter: getCommentNumber
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{display: 'flex'}}>
                    <IconButton aria-label="edit" color="primary" href={'/edit/' + params.row.id}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton aria-label="delete" color="primary" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon/>
                    </IconButton>
                </Box>),
        }
    ];

    const handleDelete = (id: string) => {
        setIsDelete(true)

        deleteArticle({
            variables: {
                id: id
            }
        }).then(({data}) => {
            if (!articleDeleting) {
                setOpenAlert(true);
                console.log('Deleted ' + data)
                setAlertType('success')
                setUserArticles(userArticles.filter(f => f.id !== id))
            }
        }).catch(e => {
            setOpenAlert(true);
            setAlertType('error')
        })


    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <>
            <Box sx={{display: 'flex', mt: '2.5rem'}}>
                <Typography variant='h4'>My articles</Typography>
                <Button sx={{ml: '2.5rem'}} variant="contained" href='/create'>Create new article</Button>
            </Box>
            <Box sx={{height: 400, width: '100%', mt: '2.5rem'}}>
                <DataGrid
                    rows={userArticles?userArticles:[]}
                    columns={columns}
                    pageSize={5}
                    sx={{border: 0}}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                />
            </Box>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose}>
                {alertType === 'error' ?
                    <Alert variant="filled" severity={alertType} sx={{width: '100%'}}>
                        Something went wrong :(
                    </Alert>
                    :
                    <Alert variant="filled" severity={alertType} sx={{width: '100%'}}>
                        The article has been delete successfully!
                    </Alert>}
            </Snackbar>
        </>
    );
};

export default MyArticles;
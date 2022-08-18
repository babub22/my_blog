import {Box, Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import React from 'react';

const ArticleList = ({articles}:any) => {
    const getFormatDate = (date: Date): string => {
        date = new Date(date)

        const yyyy = date.getFullYear()
        let mm: string | number = date.getMonth() + 1
        let dd: string | number = date.getDate()

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + '/' + mm + '/' + yyyy;
    }

    return (
        <>
            {/*//<Grid container spacing={4} sx={{mt:'0.4rem'}}>*/}
                {// @ts-ignore
                    [...articles].sort((a, b) =>  Date.parse(b.createdAt) -  Date.parse(a.createdAt)).map(article =>
                        <Grid item xs={1} md={2} key={article.title}>
                            <Card sx={{display: 'flex',mt:'2rem'}}>
                                <Box sx={{objectFit: 'cover',height:'300px'}} >
                                    <img
                                        style={{ width: '300px',
                                            height: '300px',
                                            objectFit: 'cover',}}
                                        //height="345"
                                        //component='img'// @ts-ignore
                                        // @ts-ignore
                                        src={'http://localhost:8000/images/'+article.imageId}
                                           // article.imageUrl.flat(1).map(map=>map.file).map(map=>map.filename).toString()

                                        alt={article.title}
                                    />
                                </Box>
                                <CardContent >
                                    <Typography
                                        variant='h6'
                                        component='h3'
                                    >
                                        {article.title}
                                    </Typography>

                                    <Typography
                                        variant='subtitle1'
                                        sx={{mt: '0.35rem', mb: '0.5rem'}}
                                    >
                                        {article.author}&nbsp; • &nbsp;{getFormatDate(article.createdAt)}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                    >
                                        {article.perex}
                                    </Typography>
                                    <CardActions sx={{mt: '1rem'}}>
                                        <Button href={'/article/'+article.id} size="small">Read whole article</Button>

                                    </CardActions>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

            {/*</Grid>*/}
        </>
    );
};

export default ArticleList;
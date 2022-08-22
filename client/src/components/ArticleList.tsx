import {Box, Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
import React from 'react';
import {Article} from "../types/types";
import moment from "moment";

const ArticleList = ({articles}: { articles: Article[] }) => {
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
            {[...articles].sort((a, b) => Date.parse(b.createdAt.toString()) - Date.parse(a.createdAt.toString())).map(article =>
                <Grid item xs={1} md={2} key={article.title}>
                    <Card sx={{display: 'flex', mt: '2rem'}}>
                        <Box sx={{objectFit: 'cover', height: '300px'}}>
                            <img
                                style={{
                                    width: '300px',
                                    height: '300px',
                                    objectFit: 'cover',
                                }}
                                src={'http://localhost:8000/images/' + article.imageId}
                                alt={article.title}
                            />
                        </Box>
                        <CardContent>
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
                                {article.author}&nbsp; • &nbsp;{moment(article.createdAt).format("DD/MM/YYYY")}
                            </Typography>
                            <Typography
                                variant='body2'
                            >
                                {article.perex}
                            </Typography>
                            <CardActions sx={{mt: '1rem'}}>
                                <Button href={'/article/' + article.id} size="small">Read whole article</Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </>
    );
};

export default ArticleList;
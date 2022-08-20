import React from 'react';
import {Typography, Card, CardActionArea, CardMedia, CardContent} from "@mui/material";
import { Article } from '../types/types';

const RelatedList = ({articles}: {articles:Article[]}) => {
    return (
        <>
            {articles.slice(0, 3).map(article =>
                        <Card key={article.id} sx={{maxWidth: 345,ml:'2rem'}}>
                            <CardActionArea href={'/article/'+article.id}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={"http://localhost:8000/images/"+article.imageId}
                                    alt={article.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.perex.split(' ').filter((f: string | any[]) => f.length > 2).slice(0, 24).join(' ').concat(' ...')}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                )}
        </>
    );
};

export default RelatedList;
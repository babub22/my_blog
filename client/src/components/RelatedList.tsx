import React from 'react';
import {Typography, Card, CardActionArea, CardMedia, CardContent, Box} from "@mui/material";
import {Article} from '../types/types';

const RelatedList = ({articles}: { articles: Article[] }) => {
    console.log(articles)
    return (
        <>
            <Box sx={{pl: '1rem', pb: '1.5rem', borderTop: '2px solid #ededed', height: '100%'}}>
                <Box display="flex"
                     justifyContent="center"
                     alignItems="center"
                     sx={{mb: '2rem', mt: '2rem'}}>
                    <Typography variant='h5'>Related articles</Typography>
                </Box>
                <Box display="flex"
                     justifyContent="center"
                     alignItems="center">
                    {articles.map(article =>
                        <Card key={article.id} sx={{maxWidth: 345, ml: '2rem'}}>
                            <CardActionArea href={'/article/' + article.id}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={"http://localhost:8000/images/" + article.imageId}
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
                </Box>
            </Box>
        </>
    );
};

export default RelatedList;
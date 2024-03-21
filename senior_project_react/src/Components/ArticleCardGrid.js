import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ArticleCard from './ArticleCard';

export default function ArticleCardGrid({articles}) {
  return (
    <Box sx={{ flexGrow: 1, marginTop: 3}}>
      <Grid container spacing={6} alignContent={"flex-start"} justifyContent={"center"}>
        {articles.map((article) => (
            <Grid item key={article.id}>
                <ArticleCard article={article} />
            </Grid>
        ))}
      </Grid>
    </Box>
  );
}
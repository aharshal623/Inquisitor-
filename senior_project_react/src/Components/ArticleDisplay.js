import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArticleCard from './ArticleCard';
import { COLORS } from '../Styles/ColorTheme';

export default function ArticleDisplay({ articles }) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const pageSize = 3;

  const showNext = () => {
    const newIndex = displayIndex + pageSize;
    setDisplayIndex(Math.min(newIndex, articles.length - pageSize));
  };

  const showBack = () => {
    const newIndex = displayIndex - pageSize;
    setDisplayIndex(Math.max(newIndex, 0));
  };

  const displayedArticles = articles.slice(displayIndex, displayIndex + pageSize);
  const displayRange = `${displayIndex + 1}-${Math.min(displayIndex + pageSize, articles.length)}`;
  const totalCards = articles.length;

  return (
    <Box sx={{ flexGrow: 1, marginTop: 3, position: 'relative'  }}>
      <Grid container spacing={6} alignContent={"flex-start"} justifyContent={"center"}>
        {displayedArticles.map((article) => (
            <Grid item key={article.id}>
                <ArticleCard article={article} />
            </Grid>
        ))}
      </Grid>
      {totalCards > pageSize && (
        <Box sx={{ textAlign: 'right', marginTop: 2 }}>
          <Button
            variant="contained"
            color='primary'
            onClick={showBack}
            disabled={displayIndex === 0}
            sx={{
              backgroundColor: 'darkgrey',
              color: 'black',
              '&:hover': {
                backgroundColor: COLORS.inquisitor,
              },
            }}
          >
            Back
          </Button>
          <span style={{ margin: '0 8px' }}>{displayRange} of {totalCards}</span>
          <Button
            variant="contained"
            color="primary"
            onClick={showNext}
            disabled={displayIndex + pageSize >= totalCards}
            sx={{
              backgroundColor: 'darkgrey',
              color: 'black',
              '&:hover': {
                backgroundColor: COLORS.inquisitor,
              },
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}

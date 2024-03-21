import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import CommentCard from './CommentCard';

export default function CommentCardGrid({comments}) {
  return (
    <Box sx={{ flexGrow: 1, marginTop: 3}}>
      <Grid container spacing={6} alignContent={"flex-start"} justifyContent={"center"}>
        {comments.map((comment) => (
            <Grid item key={comment.id}>
                <CommentCardWrapper comment={comment} />
            </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function CommentCardWrapper({comment}) {
    return (
      <Box>
        <Link to={`/Article?id=${comment.article_id}`} style={{ color: 'black', textDecoration: 'none' }}> 
          <CommentCard key={comment.id} comment={comment} toggleComment={() => {}} selected={false} />
        </Link>
      </Box>
    );
  }
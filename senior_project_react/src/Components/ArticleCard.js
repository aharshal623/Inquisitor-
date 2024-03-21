import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea, Box } from '@mui/material';
import { COLORS } from '../Styles/ColorTheme';
import { Link } from 'react-router-dom';

// function that trims a string down to at most a certain number of characters
function trimString(string, maxLength) {
  if (string.length > (maxLength-3)) {
    return string.substring(0, maxLength-3) + "...";
  }
  return string;
}

const cardConstants = {
    width: 345,
    height: 300,
    maxTitleCharLength: 50,
    maxBodyCharLength: 390,
}

// articleInfo: title, content, source
export default function ArticleCard({article}) {
  return (
    <Card sx={{ width: cardConstants.width, minHeight: cardConstants.height }}>
      <CardActionArea component={Link} to={`/Article?id=${article.id}`}>
        {/* could put media here using CardMedia */}
            <Box sx={{backgroundColor: 'black', color:'white', padding: '5px'}}>
              <Typography variant="h5" component="div" gutterBottom={true} sx={{fontStyle: 'italic'}}>
                {trimString(article.title, cardConstants.maxTitleCharLength)}
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom={true} align="justify" style={{ whiteSpace: 'pre-wrap' }}>
                {trimString(article.content, cardConstants.maxBodyCharLength)}
              </Typography>
              <Typography variant="body2" color={COLORS.inquisitor} align="right">
                {article.source}
              </Typography>
            </CardContent>
      </CardActionArea>
    </Card>





  );
}
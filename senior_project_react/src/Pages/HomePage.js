import { Box, Card, Button, Typography } from '@mui/material';
import ArticleCardGrid from '../Components/ArticleCardGrid';
import { PAGE_STYLES } from '../Styles/AlignmentConstants';
import { Link } from 'react-router-dom';
import { COLORS } from '../Styles/ColorTheme';
import { useEffect, useState } from 'react';
import supabase from '../supabase';

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*');

        if (error) {
          throw error;
        }

      setData(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{...PAGE_STYLES, display: 'flex', flexDirection: 'column', alignItems: 'center'} } >
      <Typography variant="h3" color="text.primary" alignSelf="center" gutterBottom={true}>
        Home
      </Typography>
      <Button component={Link} to={'/Post'} 
      variant="contained"
      color="primary"
     
      style={{ backgroundColor: COLORS.primary, height: '50px', fontSize: '18px' }} > 
      Post Article
      </Button>

      <ArticleCardGrid articles={data.map(item => item).reverse()} />
    </Box>
  );
}


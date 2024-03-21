
import {Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { PAGE_STYLES } from '../Styles/AlignmentConstants';
import { COLORS } from '../Styles/ColorTheme';
import { useEffect, useState } from 'react';
import supabase from '../supabase';
import Comments from '../Components/CommentInput';
import UploadInstructions from '../Components/UploadInstructions';
import CommentEvaluator from '../GPT/Eval';
import CommentCard from '../Components/CommentCard';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function useWindowDimensions() {  // could also make this into an export default function in another file (w/ above) to always have this ability.
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export default function ArticlePage({ user }) {
  const searchParams = new URLSearchParams(window.location.search);
  const articleID = searchParams.get('id');
  const [articleData, setArticleData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const { height, width } = useWindowDimensions();
  const navBarHeight = 120;  // includes padding etc. in this component - the adjustment needed to remove 3rd window-wide scrollbar
  const [selectedComments, setSelectedComments] = useState([]);

  function toggleComment(commentID) {
    if (selectedComments.includes(commentID)) {
      setSelectedComments(selectedComments.filter(id => id !== commentID));
      return false;
    } else {
      setSelectedComments([...selectedComments, commentID]);
      return true;
    }
  }

  function clearSelectedComments() {
    setSelectedComments([]);
  }

  function commentIsSelected(commentID) {
    return selectedComments.includes(commentID);
  }

  useEffect(() => {
    console.log(selectedComments);
  }, [selectedComments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch article data
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleID);

        if (articleError) {
          throw articleError;
        }

        setArticleData(articleData);

        // Fetch comments data
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('article_id', articleID);

        if (commentsError) {
          throw commentsError;
        }

        setCommentsData(commentsData);

        // Update the supabase entry viewed_articles for the current user by adding to the array of viewed articles
        if (articleData.length > 0) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id);

          if (userError) {
            throw userError;
          }

          const viewedArticles = userData[0].viewed_articles !== null ? userData[0].viewed_articles : [];

          if (viewedArticles[viewedArticles.length - 1] != articleID) { // only add to end of array if not the last viewed article already
            viewedArticles.push(articleID);
            const { data: userDataNew, error: userErrorNew } = await supabase
              .from('users')
              .update({ viewed_articles: viewedArticles })
              .eq('id', user.id);

            if (userErrorNew) {
              throw userErrorNew;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const refreshComments = async () => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleID);

      if (commentsError) {
        throw commentsError;
      }

      setCommentsData(commentsData);

    } catch (error) {
      console.error('Error refreshing comments:', error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + " ");
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  if (articleData.length === 0) {
    return (
      <Box sx={PAGE_STYLES}>
        <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
          Article Not Found
        </Typography>
      </Box>
    );
  } else {
    const article = articleData[0];
    const comments = commentsData;

    return (
      <Box sx={{padding: '30px' }}>
        <Grid container spacing={2}>
          {/* Left half of the screen: Article */}
          <Grid item xs={6} sx={{ overflowY: 'auto', height: height-navBarHeight}}>
            <Card variant="outlined">
                <Box sx={{padding: '10px', fontStyle: 'italic', backgroundColor: 'black', color:'white'}}>
                  <Typography variant="h5" gutterBottom>
                    {article.title}
                  </Typography>
                </Box>
                <CardContent>
                <Box sx={{ padding: '10px', textAlign: 'left' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: COLORS.inquisitor }}>
                    {article.source}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    By {article.author}
                  </Typography>
                  <Typography variant="body2" sx={{paddingBottom: '10px'}}>
                    {formatDate(article.publicationDate)}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {article.content}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Right half of the screen: Comments */}
          <Grid item xs={6} sx={{ overflowY: 'auto', height: height-navBarHeight}}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Discussion
              </Typography>
              <Typography variant='subtitle1'>
              {commentsData.length} Comments
              </Typography>
            <Box>    
              {/* Comment input prompt */}
              <Comments articleTitle={article.title} articleID={articleID} user={user} refreshComments={refreshComments} selectedComments={selectedComments} clearSelectedComments={clearSelectedComments} />
            </Box>
            {/* Comment area heading */}
            {commentsData && commentsData.length > 0 && (<Grid container spacing={2}> 
              <Grid item xs={2}>
                <Typography variant="subtitle1">
                  Thoughtfulness Score
                </Typography>
              </Grid>
            </Grid>)}
            {/* User-Generated Comments */}
            <Box >
              {commentsData.map(item => item).reverse().map(comment => (
                <CommentCard key={comment.id} comment={comment} toggleComment={toggleComment} selected={commentIsSelected(comment.id)} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}


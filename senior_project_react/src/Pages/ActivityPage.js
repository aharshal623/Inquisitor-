
import { Box, Card, Divider, Typography, CardContent, CardActionArea } from '@mui/material';
import supabase from '../supabase';
import React, { useEffect, useState } from 'react';
import { PAGE_STYLES } from '../Styles/AlignmentConstants';
import ArticleDisplay from '../Components/ArticleDisplay';
import { Link } from 'react-router-dom';
import CommentCard from '../Components/CommentCard';
import CommentCardGrid from '../Components/CommentCardGrid';

export default function ActivityPage({user}) {
  const [viewedArticleIDs, setViewedArticleIDs] = useState([]);
  const [viewedArticleObjects, setViewedArticleObjects] = useState([]);
  const [commentedArticleIDs, setCommentedArticleIDs] = useState([]);
  const [commentedObjects, setCommentedObjects] = useState([]);
  const [commentIDs, setCommentIDs] = useState([]);
  const [commentObjects, setCommentObjects] = useState([]);

  useEffect(() => {  // get updated user info
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('viewed_articles, commented_articles, comments')
          .eq('id', user.id);
  
        if (error) {
          throw error;
        }
  
        setViewedArticleIDs(data[0].viewed_articles);
        setCommentedArticleIDs(data[0].commented_articles);
        setCommentIDs(data[0].comments);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  });

  
  useEffect(() => {  // get the articles that the user has viewed
    const fetchDataArticles = async () => {
      if (viewedArticleIDs && viewedArticleIDs != []) {
        try {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .in('id', viewedArticleIDs);
  
          if (error) {
            throw error;
          }

          // Now, reinstate the order of the article IDs and filter out past duplicates
          let dataMap = new Map(data.map(item => [item.id, item])); // Create a map for constant time lookups
          var dataSet = new Set();  // only display the most recently viewed time that article was viewed (each article displayed only once)
          let orderedData = viewedArticleIDs.reverse().map(id => {
            if(dataSet.has(id)) return null;
            dataSet.add(id);
            return dataMap.get(id);
          }).filter(item => item !== null && item !== undefined); // Order and filter the data
  
          setViewedArticleObjects(orderedData);
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      }
    };
  
    fetchDataArticles();
  }, [viewedArticleIDs]);
  useEffect(() => {  // get the articles that the user has commented on
    const fetchDataArticles = async () => {
      if (commentedArticleIDs && commentedArticleIDs != []) {
        try {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .in('id', commentedArticleIDs);
  
          if (error) {
            throw error;
          }

          // Now, reinstate the order of the article IDs and filter out past duplicates
          let dataMap = new Map(data.map(item => [item.id, item])); // Create a map for constant time lookups
          var dataSet = new Set();  // only display the most recently commented time that article was commented on (each article displayed only once)
          let orderedData = commentedArticleIDs.reverse().map(id => {
            if(dataSet.has(id)) return null;
            dataSet.add(id);
            return dataMap.get(id);
          }).filter(item => item !== null && item !== undefined); // Order and filter the data
  
          setCommentedObjects(orderedData);
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      }
    };
  
    fetchDataArticles();
  }, [commentedArticleIDs]);
  useEffect(() => {  // get the user's comment data
    const fetchDataComments = async () => {
      if (commentIDs && commentIDs != []) {
        try {
          const { data, error } = await supabase
            .from('comments')
            .select('*')
            .in('id', commentIDs);
  
          if (error) {
            throw error;
          }

          // Now, reinstate the order
          let dataMap = new Map(data.map(item => [item.id, item])); // Create a map for constant time lookups
          let orderedData = commentIDs.reverse().map(id => dataMap.get(id)).filter(item => item !== null && item !== undefined); // Order the data (and filter nulls just in case)
  
          setCommentObjects(orderedData);
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      }
    };
  
    fetchDataComments();
  }, [commentIDs]);

  return (
    <Box
      sx={{
        display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center horizontally
      justifyContent: 'center',
      marginTop: '2em', 
      }}
    >
      <Typography variant="h3" color="text.primary" alignSelf="center" gutterBottom={true}>
        Acitivity 
      </Typography>

      <Box sx={PAGE_STYLES} >
        <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
          Recently Viewed Articles
        </Typography>
        {viewedArticleObjects.length > 0 ? <ArticleDisplay articles={viewedArticleObjects} /> : <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
          No articles viewed yet</Typography>}
      </Box>
      <Divider orientation="horizontal" flexItem/>

      <Box sx={PAGE_STYLES} >
        <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
          Recently Commented Articles
        </Typography>
        {commentedObjects.length > 0 ? <ArticleDisplay articles={commentedObjects} /> : <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
          No articles commented on yet</Typography>}
      </Box>
      <Divider orientation="horizontal" flexItem/>

      <Box sx={PAGE_STYLES} >
        <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
          Recents Comments
        </Typography>
        {commentObjects.length > 0 ? <CommentCardGrid comments={commentObjects} /> : <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
          No comments yet</Typography>}
      </Box>
      <Divider orientation="horizontal" flexItem/>

    </Box>
  );
}
import { Box, Button, CardContent, Typography , Divider} from '@mui/material';
import { PAGE_STYLES } from '../Styles/AlignmentConstants';
import SwitchList from '../Components/SwitchList';
import MetricBarGraph from '../Components/MetricBarGraph';
import MetricPieChart from '../Components/MetricPieChart';
import Grid from '@mui/material/Grid';
import supabase from '../supabase';
import React, { useEffect, useState } from 'react';
import ArticleCardGrid from '../Components/ArticleCardGrid';
import { COLORS } from '../Styles/ColorTheme';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import { BoySharp, Lens } from '@mui/icons-material';
import { margin } from '@mui/system';


export default function AccountPage({ user }) {
  const [articleIDs, setArticleIDs] = useState([]);
  const [articleObjects, setArticleObjects] = useState([]);
  const [sources, setSources] = useState([]);
  const [tscores, settscores] = useState([]); 
  const [averagetScore, setAverageTscore] = useState(0.0); 

  // const [viewedArticleIDs, setviewedArticleIDs] = useState([]);
  // const [viewedSources, setViewedSources] = useState([]);

  // const calculateAverage = () => {
  //   if (tscores[0].length === 0) {
  //     return 0;
  //   }

  //   const sum = tscores.reduce((accumulator, currentScore) => accumulator + currentScore, 0);
  //   const average = sum / tscores.length;
  //   return average;
  // };

  useEffect(() => {
    // Calculate average whenever tscores change
    const calculateAverage = () => {
      if (tscores.length === 0) {
        setAverageTscore(0);
      } else {
        console.log("tscore ", tscores); 
        let sum = 0; 
        //const sum = tscores.filter(item => item !== null).reduce((accumulator, currentScore) => accumulator + currentScore, 0);
        for (let i = 0; i < tscores.length; i++) {
          console.log("element", tscores[i]); 
          sum += tscores[i];
        }
        console.log("sum ", sum); 
        const average = sum / tscores.length;
        const roundedAverage = parseFloat(average.toFixed(3));

        setAverageTscore(roundedAverage); 
      }
    };

    // Call the calculateAverage function when tscores change
    calculateAverage();
  }, [tscores]);

  const Legend = () => {
    return (
      <Box
      style={{ PAGE_STYLES, alignItems: 'center', margin: '2em'}}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ backgroundColor: COLORS.lowScore, padding: '5px' }}></span>
        <Typography variant="body1" style={{ marginLeft: '5px', marginRight: '5px' }}>
          Low
        </Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ backgroundColor: COLORS.middleScore, padding: '5px' }}></span>
        <Typography variant="body1" style={{ marginLeft: '5px', marginRight: '5px' }}>
          Intermediate
        </Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ backgroundColor: COLORS.highScore, padding: '5px' }}></span>
        <Typography variant="body1" style={{ marginLeft: '5px', marginRight: '5px' }}>
          High
        </Typography>
      </div>
    </Box>
    );
  };

  const getBackgroundColor = (score) => {
    console.log(score); 
    if (score >= 0.0 && score < 4.0) {
      return COLORS.lowScore; // Lower scores are red
    } else if (score >= 4.0 && score < 7.0) {
      return COLORS.middleScore; // Intermediate scores are yellow (you can adjust this)
    } else {
      return COLORS.highScore; // Higher scores are green
    }
  };

  const getThoughtfulnessTips = (score) => {
    if (score <= 2) {
      return "Tips: Your comments appear to lack depth and insight. To improve your thoughtfulness score, try researching the topic more thoroughly before commenting, and consider incorporating diverse perspectives into your responses.";
    } else if (score > 2 && score <= 4) {
      return "Tips: While you contribute to discussions, there's room for improvement in the depth of your analysis. To enhance your thoughtfulness score, strive to provide more detailed explanations, cite reliable sources, and engage in constructive dialogue with other participants.";
    } else if (score > 4 && score <= 6) {
      return "Tips: You demonstrate some thoughtfulness in your comments, but there's potential for further development. To raise your thoughtfulness score, focus on offering nuanced perspectives, critically evaluating different viewpoints, and actively participating in respectful debates.";
    } else if (score > 6 && score <= 8) {
      return "Tips: Your contributions reflect a commendable level of thoughtfulness, but there's always room for refinement. To maintain and improve your high thoughtfulness score, continue providing insightful analyses, engaging thoughtfully with others' comments, and offering solutions to complex issues.";
    } else {
      return "Tips: Congratulations on achieving a high thoughtfulness score! Your comments demonstrate exceptional depth, insight, and respect for diverse viewpoints. To sustain this level of thoughtfulness, continue contributing constructively to discussions, fostering meaningful dialogue, and promoting understanding among participants.";
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id);
  
        if (error) {
          throw error;
        }
        //const fetchedArticles = data[0].map(user => user.articles);
        const fetchedArticles = data[0].articles;
        setArticleIDs(fetchedArticles);


        //const fetchedTscores = data.map(user => user.thoughtfulness_scores);
        const fetchedTscores = data[0].thoughtfulness_scores;
        settscores(fetchedTscores);


        // const fetchedArticlesViewed = data.map(user => user.viewed_articles);
        // let unique = [...new Set(fetchedArticlesViewed)];

        // setviewedArticleIDs(unique);
        // console.log(unique)
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    fetchData();
  }, [user.id]);
  
  useEffect(() => {
    const fetchDataArticles = async () => {
      if (articleIDs && articleIDs.length > 0) {
        try {
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .in('id', articleIDs);
  
          if (error) {
            throw error;
          }
          const fetchedSources = data.map(article => article.source);
          setArticleObjects(data);
          setSources(fetchedSources);
        } catch (error) {
          console.error('Error fetching article data:', error.message);
        }
      }
    };
  
    fetchDataArticles();
  }, [articleIDs]); // Fetch articles only when article IDs change

  // useEffect(() => {
  //   const fetchDataArticles = async () => {
  //     if (viewedArticleIDs.length > 0) {
  //       try {
  //         const { data, error } = await supabase
  //           .from('articles')
  //           .select('*')
  //           .in('id', viewedArticleIDs);
  //         if (error) {
  //           throw error;
  //         }
  //         const fetchedSources = data.map(article => article.source);
          
  //         setViewedSources(fetchedSources);
  //         console.log(fetchedSources);
  //       } catch (error) {
  //         console.error('Error fetching article data:', error.message);
  //       }
  //     }
  //   };
  //   fetchDataArticles();
  // }, [viewedArticleIDs]); 

  // Calculate source counts (assuming 'source' is a field in each article)
  const sourceCounts = sources.reduce((acc, source) => {
    const sourceName = source;
    acc[sourceName] = (acc[sourceName] || 0) + 1;
    return acc;
  }, {});


  // const sourceCountsViewed = viewedSources.reduce((acc, source) => {
  //   const sourceName = source;
  //   acc[sourceName] = (acc[sourceName] || 0) + 1;
  //   return acc;
  // }, {});
  console.log(tscores);
  console.log(averagetScore);


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center horizontally
      justifyContent: 'center',
      marginTop: '2em', 
    }} >
    <Typography variant="h3" color="text.primary" alignSelf="center" gutterBottom={true}>
      My Account 
    </Typography>
    <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
      Hi {user.username}!
    </Typography>
    <Divider orientation="horizontal" flexItem/>

    <Box sx={PAGE_STYLES} >
    <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
      My Posts
    </Typography>
    {articleIDs && (
      <ArticleCardGrid articles={articleObjects.map(item => item).reverse()} />
    )}
    {!articleIDs && (
      <Box sx={PAGE_STYLES}>
      <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
          No posts yet </Typography>
    <Button component={Link} to={'/Post'} 
    variant="contained"
    color="primary"
    style={{ backgroundColor: COLORS.primary, height: '50px', fontSize: '18px' }} > 
    Post Article
    </Button>
    </Box>
    )}
  
    </Box>
    <Divider orientation="horizontal" flexItem/>
    
    {tscores.length > 0  && (
    <Box sx={{...PAGE_STYLES,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    }}>
  <Card style={{backgroundColor: getBackgroundColor(averagetScore),maxWidth: '800px'}}>
  <CardContent>
    <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
      My Thoughtfulness Score
    </Typography>
    <Typography variant="h8" color="text.primary" alignSelf="center" gutterBottom={true}>
      Average Score: {averagetScore}
    </Typography>
    <div style={{ marginBottom: '10px' }} /> {/* Tiny gap */}
    <Typography  variant="body1" color="text.secondary">
      {getThoughtfulnessTips(averagetScore)}
    </Typography>
  </CardContent>
  
</Card>
<Legend/> 

    </Box>
    )}
    { tscores.length === 0 && (
      <Box sx={{...PAGE_STYLES,
        margin: '2em'
        }}> 
      <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
      My Thoughtfulness Score
    </Typography>

    <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
          No articles commented on yet to calculate thoughtfulness score </Typography>
    </Box>
    )}


    <Divider orientation="horizontal" flexItem/>

    <Box sx={PAGE_STYLES} >
    <Typography variant="h4" color="text.primary" alignSelf="center" gutterBottom={true}>
      Metrics
    </Typography>
    {articleIDs && (
    <Box>
      <Typography variant="h5" >News Source Metrics</Typography>
      <Typography>What news sources are my posts from? </Typography>
      <Grid container spacing={20}>
        <Grid item xs={6}>
          <MetricBarGraph sourceCounts= {sourceCounts} />
        </Grid>
        <Grid item xs={6}>
          {sourceCounts && (<MetricPieChart dataToDisplay = {sourceCounts} />)}
          {!sourceCounts && (<Typography variant="h7" color="text.primary" alignSelf="center" gutterBottom={true}>
      No data to map
    </Typography>)}
        </Grid>
      </Grid>
    </Box>
    )}
{!articleIDs && (
    <Typography variant="h5" color="text.primary" alignSelf="center" gutterBottom={true}>
    Post an article to see metric data  </Typography>
    )}
    </Box>
    <Divider orientation="horizontal" flexItem/>
    <Box sx={PAGE_STYLES}>
    <Typography variant="h4" color="text.primary" alignSelf="left" gutterBottom={true}>
      Settings and Preferences 
    </Typography>
    <SwitchList/>
    </Box>
    <Box sx={PAGE_STYLES} /> 
    </Box>

  );
}






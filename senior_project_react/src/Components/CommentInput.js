
import { Box, Button, CircularProgress, TextField, MenuItem, Typography, Divider, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@mui/material';
import React, { useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { COLORS } from '../Styles/ColorTheme';
import supabase from '../supabase';
import Filter from 'bad-words';


export default function Comments({ articleID, refreshComments, user, selectedComments, clearSelectedComments, articleTitle }) {



  const [url, setUrl] = useState("");
  const [openWarningDialog, setOpenWarningDialog] = useState(false); // Changed from error snackbar to warning dialog

  const [comment, setComment] = useState("");
  const [evaluation, setEvaluation] = useState();
  const [score, setScore] = useState();
  const [loading, setLoading] = useState(false);
  const apikey = "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";
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [formData, setFormData] = useState({
    article_id: articleID,
    user_id: user.id,
    content: '',
    username: user.username,
    // parent_comments:''
  });
  const [submitting, setSubmitting] = useState(false);







  const handleSubmit = async () => {
    if (validateForm()) {
      if (!scanForBadWords(formData.content)) {
        // Open confirmation dialog after form submission

        const ms2 = `Consider a new article with the following title: "${articleTitle}". Imagine this comment is in response to that article: "${formData.content}" \n 1. Evaluate the comment's thoughtfulness objectively on a scale from 1-10 using a field explicitly titled 'thoughtfulness_score'. Do not elaborate only provide a number.\n 2. Now, briefly provide context for this score in a field explicitly called 'context'.`;
        setLoading(true);
        try {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`,
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo-1106",
                response_format: { type: "json_object" },
                messages: [
                  { role: "system", content: "Provide response as JSON" },
                  { role: "user", content: ms2 },
                ],
                max_tokens: 70,
                temperature: 0,
              }),
            }
          );

          const json = await response.json();
          const obj = JSON.parse(json.choices[0].message.content);
          await setEvaluation(obj.context);
          await setScore(obj.thoughtfulness_score); 

        } catch (error) {
          console.error("Error analyzing comment:", error);
          setEvaluation("Failed to analyze the comment.");
          setScore("Failed to analyze the comment.");
        } finally {
          setLoading(false);
        }

        setOpenConfirmationDialog(true);
      } else {
        console.error("Your comment contains bad words. Please enter a new comment.");
        setOpenWarningDialog(true);

      }
    } else {
      console.error("Form validation failed.");
      setOpenErrorSnackbar(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (validateForm() && !scanForBadWords(formData.content)) {
      try {
        // Insert the form data into the "articles" table
        // await analyzeComment(formData.content);


        const { data: commentData, error } = await supabase
          .from("comments")
          .insert([
            {
              GPT_context: evaluation,
              thoughtfulness_score: score,
              article_id: formData.article_id,
              user_id: formData.user_id,
              content: formData.content,
              username: formData.username,
              parent_comments: selectedComments //formData.parent_comments

            },
          ])
          .select();

        if (error) {
          console.error("Error inserting data:", error);
        } else {



          console.log("Article inserted successfully:", commentData);

          // Get the ID of the inserted comment
          const commentId = commentData[0].id;

          // Get the array of comments published by the current user
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .select();

          if (userError) {
            console.error("Error getting user data:", userError);
          } else {
            console.log("User data retrieved successfully:", userData);
          }



          const newComments = userData[0].comments !== null ? userData[0].comments : [];

          // Update the user's data to include the commented-on article
          const commentedArticles = userData[0].commented_articles !== null ? userData[0].commented_articles : [];
          commentedArticles.push(articleID);

          const thoughtfullnessScoreArray = userData[0].thoughtfulness_scores !== null ? userData[0].thoughtfulness_scores : [];
          thoughtfullnessScoreArray.push(score);


          // Add the current comment to the user's array of published comments
          newComments.push(commentId);
          const { data: userDataNew, error: userErrorNew } = await supabase
            .from('users')
            .update({
              comments: newComments,
              commented_articles: commentedArticles,
              thoughtfulness_scores: thoughtfullnessScoreArray,
            })
            .eq('id', user.id);

          if (userErrorNew) {
            console.error("Error updating user comments:", userErrorNew);
          } else {
            console.log("User comments updated successfully:", userDataNew);
          }

          setOpenSuccessSnackbar(true);
          // Clear form fields
          setFormData({
            article_id: articleID,
            user_id: user.id,
            content: "",
            username: user.username,
            // parent_comments: ""
          });

          clearSelectedComments();

          await setEvaluation();
          await setScore();
          refreshComments();

        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
      } finally {
        // Close confirmation dialog after submission
        setOpenConfirmationDialog(false);
      }
    } else {
      console.error("Form validation failed");
      setOpenErrorSnackbar(true);
    }
  };



  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnackbar(false);
  };

  const validateForm = () => {
    // Validate each field to ensure they are not empty
    return Object.values(formData).every((value) => value !== '');
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const scanForBadWords = (text) => {
    // Define your list of bad words here
  
    const filter = new Filter();
    return filter.isProfane(text);
  };


  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{ paddingBottom: '10px' }}>
      <Box display="flex"
        flexDirection="space-between"
        alignItems="center"
        justifyContent="center"
        gap={2} >

        <Dialog
          open={openWarningDialog}
          onClose={() => setOpenWarningDialog(false)}
        >
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your comment contains inappropriate words. Please remove them before submitting.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWarningDialog(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSuccessSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ backgroundColor: '#f0f0f0', color: 'green' }}
          >
            Comment submitted successfully!
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseErrorSnackbar}
            severity="error"
            sx={{ backgroundColor: COLORS.primary }}
          >
            Please fill in all fields.
          </MuiAlert>
        </Snackbar>

      </Box>

      <Typography color="text.primary" sx={{ textAlign: 'left', marginTop: '10px'}} gutterBottom={true}>
          Select all comments you wish to reply to.
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: 'left' }}>
          {(selectedComments.length > 0) && `Replying to: #${selectedComments.join(', #')}`}
      </Typography>

      <TextField
        label="Please enter a thoughtful comment here about this article"
        variant="filled"
        fullWidth
        multiline
        sx={{ minHeight: '50px', fontSize: '16px' }}
        rows={5}
        margin="normal"
        value={formData.content}
        onChange={handleChange('content')}
      />
      <Box>
        <div style={{ marginTop: '20px' }} />
        <Button
          variant="contained"
          color="primary"
          style={{ backgroundColor: COLORS.primary, height: '50px', fontSize: '18px' }}
          onClick={handleSubmit}>
          Submit
        </Button>


      </Box>

      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>Confirm Comment Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
              Are you sure you want to submit this comment?
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              {/* If thoughtfulness score is null, display score of '5' by default*/}
              Your thoughtfulness score is: <strong>{score? score : 5}</strong>
            </Typography>
            <Typography variant="body2">
              Here is some context behind the score:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              <strong>{evaluation}</strong>
            </Typography>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>


    </Box>

  );
}

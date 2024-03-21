
import { Box, Button, TextField, MenuItem, Typography , Divider, Snackbar, Dialog, DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, } from '@mui/material';
import React, { useState } from 'react';

import MuiAlert from '@mui/material/Alert';
import { COLORS } from '../Styles/ColorTheme';
import supabase from '../supabase';
import { useNavigate } from 'react-router-dom';

const Post = ({user}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      title: '',
      source: '',
      publicationDate: '',
      content: '',
      customSource: ''
    });
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);


    const sourceOptions = [
        { value: 'New York Times', label: 'New York Times' },
        { value: 'National Geographic', label: 'National Geographic' },
        { value: 'Space.com', label: 'Space.com' },
        { value: 'CNN', label: 'CNN' },
        { value: 'MIT Technology Review', label: 'MIT Technology Review' },
        { value: 'Stanford Daily', label: 'Stanford Daily' },
        { value: 'The Guardian', label: 'The Guardian' },
        { value: 'Science', label: 'Science' },
        { value: 'Nature', label: 'Nature' },
        { value: 'Other', label: 'Other' },
        // TODO we can decide which news souces to add 
      ];

      const handleOpenConfirmationDialog = () => {
        setOpenConfirmationDialog(true);
      };
    
      const handleCloseConfirmationDialog = () => {
        setOpenConfirmationDialog(false);
      };

      const handleConfirmSubmit = async () => {
        if (validateForm()) {
          handleOpenConfirmationDialog(); 
          try {
            const sourceValue = formData.source === 'Other' ? formData.customSource : formData.source;
            const { data: articleData, error } = await supabase
              .from("articles")
              .insert([
                { 
                  title: formData.title,
                  author: formData.author,
                  source: sourceValue,
                  publicationDate: formData.publicationDate,
                  content: `${formData.content}`,
                  user_id: user.id
                },
              ])
              .select();
      
            if (error) {
              console.error("Error inserting data:", error);
            } else {
              console.log("Article inserted successfully:", articleData);
              
          
            // Get the ID of the inserted article
            const articleId = articleData[0].id;

            // Get the array of articles published by the current user
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

            const newArticles = userData[0].articles !== null ? userData[0].articles : [];

            // Add the current article to the user's array of published articles
            newArticles.push(articleId);
            const { data: userDataNew, error: userErrorNew } = await supabase
                .from('users')
                .update({articles : newArticles})
                .eq('id', user.id);

            if (userErrorNew) {
                console.error("Error updating user articles:", userErrorNew);
            } else {
                console.log("User articles updated successfully:", userDataNew);
            }
            setOpenConfirmationDialog(false);
            // Clear form fields
            setFormData({
                title: "",
                author: "",
                source: "",
                publicationDate: "",
                content: "",
                customSource: "",
            });
            // Redirect to the article page
            navigate(`/Article?id=${articleId}`, { replace: true });
            // Success snackbar is never shown right now, but could include it via another query param to article page in the future if needed.
            }
          } catch (error) {
            console.error("Error connecting to Supabase:", error);
          }
        } else {
          console.error("Form validation failed");
          setOpenErrorSnackbar(true);
        }
      }
        
    
    const handleSubmit = async () => {
          handleOpenConfirmationDialog(); 
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
        return Object.entries(formData).every(([key, value]) => key === 'customSource' || value !== '');
    };
  
    const handleChange = (field) => (event) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

    const handleChangeSource = (field) => (event) => {
      const value = event.target.value;
      setShowCustomSource(value === 'Other');
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };
    const [showCustomSource, setShowCustomSource] = useState(false);
  
    return (
    <Box 
    alignItems="center"
    justifyContent="center" 
    sx={{padding: '50px', paddingBottom: '100px'}}>
    <Box display="flex"
    flexDirection="space-between"
    alignItems="center"
    justifyContent="center"
    gap={2} >
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
          Article submitted successfully!
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

      <TextField
        label="Title"
        variant="filled"
        fullWidth
        multiline
        maxRows={2}
        rows={2}
        margin="normal"
        sx={{ width: '50ch'}}
        value={formData.title}
        onChange={handleChange('title')}
      />
      <TextField
        label="Author"
        variant="filled"
        fullWidth
        multiline
        rows={2}
        maxRows={2}
        sx={{ width: '50ch' }}
        margin="normal"
        value={formData.author}
        onChange={handleChange('author')}
      />
     </Box>
     <Box display="flex"
flexDirection="space-between"
alignItems="center"
justifyContent="center"
gap={2}>
  <TextField
  select
  label="Source"
  variant="filled"
  fullWidth
  margin="normal"
  sx={{ width: '50ch' }}
  value={formData.source}
  onChange={handleChangeSource('source')}
>
  {sourceOptions.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>
 <TextField
    label="Publication Date"
    variant="filled"
    fullWidth
    type="date"
    sx={{ width: '50ch' }}
    margin="normal"
    InputLabelProps={{
      shrink: true,
      style: { marginTop: '-0.5rem' },
    }}
    value={formData.publicationDate}
    onChange={handleChange('publicationDate')}
  /> 
  </Box>
  <Box 
  justifyContent="left" 
  alignItems="left">
  {showCustomSource && (
  <TextField
    label="Other Source"
    variant="filled"
    sx={{ width: '50ch' }}
    margin="normal"
    value={formData.customSource}
    onChange={handleChange('customSource')}
  />
)}
  
</Box>
    <TextField
      label="Content"
      variant="filled"
      multiline
      sx={{ width: '102ch' }}
      rows={15}
      margin="normal"
      value={formData.content}
      onChange={handleChange('content')}
    />
    <Box>
    <div style={{ marginTop: '20px' }}/>
      <Button 
      variant="contained"
      color="primary"
      style={{ backgroundColor: COLORS.primary, height: '50px', fontSize: '18px' }}
      onClick={handleSubmit}>
        Submit
      </Button>
  </Box>

  <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to post this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


  </Box>

    );
}
export default Post; 
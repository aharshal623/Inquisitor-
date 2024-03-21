import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UploadInstructions = () => {
  return (
    <Box pt={6} >
      <Typography variant="h4" gutterBottom>
        Post Your Own Article!  
      </Typography>
      <Typography variant="body1" paragraph>
        Please provide the following details for the online article you are uploading:
      </Typography>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '8px' }}>
          <Typography variant="body1">
            <strong>Title:</strong> Enter the title of the article.
          </Typography>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Typography variant="body1">
            <strong>Author:</strong> Provide the name of the author.
          </Typography>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Typography variant="body1">
            <strong>Source:</strong> Specify the source of the article.
          </Typography>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Typography variant="body1">
            <strong>Publication Date:</strong> Enter the date when the article was published.
          </Typography>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Typography variant="body1">
            <strong>Content:</strong> Paste the content of the article here.
          </Typography>
        </li>
      </ul>
      <Typography variant="body1" paragraph>
        Ensure that all the information is accurate and complete before proceeding with the upload.
      </Typography>
    </Box>
  );
};

export default UploadInstructions;

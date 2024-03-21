import { Box, Typography } from '@mui/material';
import Post from '../Components/Post';
import UploadInstructions from '../Components/UploadInstructions';

export default function UploadPage({ user }) {
  
  return (
    <Box >
      <UploadInstructions/> 
      <Post user={user}/>
    </Box>
  );
}

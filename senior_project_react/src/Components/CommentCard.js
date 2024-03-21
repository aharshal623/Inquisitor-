import { useState } from 'react';
import { Box, Typography, Tooltip, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { COLORS } from '../Styles/ColorTheme';

const commentCardStyles = {
  borderRadius: '5px',
  padding: '10px',
  position: 'relative',
  marginBottom: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
};

const scoreContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '100%',
  backgroundColor: COLORS.lighterShadeofRed,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '20px',
  marginLeft: '5px',
  marginRight: '15px',
  minWidth: '60px',
  minHeight: '60px'
};

const usernameContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '5px',
};

// Allows for score justification to appear when hovering
const CommentCard = ({ comment, toggleComment, selected }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Box
      sx={[commentCardStyles, { backgroundColor: selected ? '#ADD8E6' : 'white' }]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {toggleComment(comment.id)}}
    >
        <Grid container wrap="nowrap" style={{ overflow: 'hidden' }}> {/* Right column for username, content, and tooltip */}
          <Tooltip title={comment.GPT_context} open={hovered} arrow>
            <Box sx={scoreContainerStyles}> 
                  {/* If thoughtfulness score is null, display score of '5' by default*/} 
            {comment.thoughtfulness_score !== null ? comment.thoughtfulness_score : 5}
            </Box>
          </Tooltip>
          <Box>
            <Box sx={usernameContainerStyles}> 
              <AccountCircleIcon sx={{ marginRight: '5px' }} /> {/* Icon for user profile photo */}
              <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                {comment.username}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ paddingLeft: '5px' }}>
                {`#${comment.id}`}
              </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ textAlign: 'left' }} gutterBottom={true}>
              {(comment.parent_comments && comment.parent_comments.length > 0) && `Replying to: #${comment.parent_comments.join(', #')}`}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }} style={{ whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </Typography>
          </Box>
        </Grid>
    </Box>
  );
};

export default CommentCard;
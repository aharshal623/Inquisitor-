import { createTheme } from '@mui/material/styles';
import '@fontsource/newsreader/400.css';

// Save newsreader as usable font
const globalFontTheme = createTheme({
  typography: {
    fontFamily: 'newsreader'
  },
});

export default globalFontTheme;
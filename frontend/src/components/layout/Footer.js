import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200]
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="/">
            DCF Analyzer
          </Link>{' '}
          - Discounted Cash Flow Analysis Tool
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Disclaimer: This tool provides financial analysis for educational purposes only. 
          It is not intended to be investment advice. Always consult with a qualified financial advisor.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// CardMedia import removed - not used
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TickerSearch from '../components/TickerSearch';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          DCF Analyzer
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Professional Financial Analysis Made Simple
        </Typography>
        <Typography variant="body1" paragraph>
          Discover the intrinsic value of stocks using discounted cash flow modeling with our intuitive web app.
        </Typography>
        
        <TickerSearch />
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Key Features
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShowChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Dynamic DCF Analysis
              </Typography>
              <Typography variant="body2">
                Calculate enterprise value, equity value, and terminal value with company-specific growth rates and dynamic beta calculation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Monte Carlo Simulation
              </Typography>
              <Typography variant="body2">
                Understand valuation uncertainty with sophisticated Monte Carlo simulations that account for varying growth rates, margins, and capital expenditures.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Comprehensive Reporting
              </Typography>
              <Typography variant="body2">
                View detailed metrics including WACC calculation, terminal growth rates, EBIT margins, and more in interactive dashboards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* How It Works Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        How It Works
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ 
                mr: 1, 
                display: 'inline-flex', 
                borderRadius: '50%', 
                width: 28, 
                height: 28, 
                bgcolor: 'primary.main', 
                color: 'white',
                justifyContent: 'center', 
                alignItems: 'center'
              }}>
                1
              </Box>
              Search for a company
            </Typography>
            <Typography variant="body2">
              Enter a company name or ticker symbol to begin your analysis.
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ 
                mr: 1, 
                display: 'inline-flex', 
                borderRadius: '50%', 
                width: 28, 
                height: 28, 
                bgcolor: 'primary.main', 
                color: 'white',
                justifyContent: 'center', 
                alignItems: 'center'
              }}>
                2
              </Box>
              Customize parameters (optional)
            </Typography>
            <Typography variant="body2">
              Adjust growth rates, discount rates, and other parameters to fit your analysis assumptions.
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ 
                mr: 1, 
                display: 'inline-flex', 
                borderRadius: '50%', 
                width: 28, 
                height: 28, 
                bgcolor: 'primary.main', 
                color: 'white',
                justifyContent: 'center', 
                alignItems: 'center'
              }}>
                3
              </Box>
              View results and insights
            </Typography>
            <Typography variant="body2">
              Get detailed valuation metrics, visualizations, and export options for your analysis.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// We'll implement actual API calls later

const CompanyPage = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, this would call the backend API
        // For demonstration, let's simulate a response
        
        // Uncomment this in production:
        // const response = await axios.get(`/api/company-info?ticker=${ticker}`);
        // setCompanyData(response.data.data);
        
        // Simulated data for demonstration
        const simulatedData = getDemoCompanyData(ticker);
        
        // Simulate API delay
        setTimeout(() => {
          setCompanyData(simulatedData);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company data. Please try again.');
        setLoading(false);
      }
    };

    if (ticker) {
      fetchCompanyData();
    }
  }, [ticker]);

  const handleRunAnalysis = () => {
    navigate(`/analysis/${ticker}`);
  };

  // Loading state
  if (loading) {
    return <CompanyPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // No data state
  if (!companyData) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No information found for ticker: {ticker}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1">
              {companyData.name} ({ticker})
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {companyData.sector} | {companyData.industry}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={handleRunAnalysis}
          >
            Run DCF Analysis
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Key Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body1">
                    ${formatLargeNumber(companyData.marketCap)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Price
                  </Typography>
                  <Typography variant="body1">
                    ${companyData.currentPrice.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    P/E Ratio
                  </Typography>
                  <Typography variant="body1">
                    {companyData.pe_ratio.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Dividend Yield
                  </Typography>
                  <Typography variant="body1">
                    {companyData.dividend_yield.toFixed(2)}%
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Beta
                  </Typography>
                  <Typography variant="body1">
                    {companyData.beta.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Employees
                  </Typography>
                  <Typography variant="body1">
                    {formatLargeNumber(companyData.employees)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Price Range */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                52-Week Range
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Low: ${companyData['52week_low'].toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High: ${companyData['52week_high'].toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ position: 'relative', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: `${calculatePercentInRange(
                      companyData.currentPrice,
                      companyData['52week_low'],
                      companyData['52week_high']
                    )}%`,
                    transform: 'translateX(-50%)',
                    width: 3,
                    height: 16,
                    top: -4,
                    bgcolor: 'primary.main'
                  }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                {companyData.currentPrice > companyData['52week_low'] * 1.1 ? (
                  <Chip 
                    icon={<TrendingUpIcon />} 
                    label={`${calculatePercentChange(companyData.currentPrice, companyData['52week_low']).toFixed(1)}% from low`} 
                    color="success" 
                    variant="outlined" 
                  />
                ) : null}
                
                {companyData.currentPrice < companyData['52week_high'] * 0.9 ? (
                  <Chip 
                    icon={<TrendingDownIcon />} 
                    label={`${calculatePercentChange(companyData['52week_high'], companyData.currentPrice).toFixed(1)}% from high`} 
                    color="error" 
                    variant="outlined" 
                  />
                ) : null}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                DCF Analysis Options
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={handleRunAnalysis}
                >
                  Standard DCF Analysis
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  onClick={() => navigate(`/analysis/${ticker}?advanced=true`)}
                >
                  Advanced DCF (Custom Parameters)
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  fullWidth
                  onClick={() => navigate(`/analysis/${ticker}?montecarlo=true`)}
                >
                  Monte Carlo Simulation
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Company Description */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Company Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1">
          {companyData.description}
        </Typography>
        
        {companyData.website && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Website: <a href={companyData.website} target="_blank" rel="noopener noreferrer">{companyData.website}</a>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

// Skeleton for loading state
const CompanyPageSkeleton = () => (
  <Box>
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="50%" height={60} />
      <Skeleton variant="text" width="30%" height={30} />
    </Box>
    
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={200} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={200} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={200} />
      </Grid>
    </Grid>
    
    <Skeleton variant="rectangular" height={200} sx={{ mt: 3 }} />
  </Box>
);

// Helper functions
const formatLargeNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
};

const calculatePercentInRange = (current, min, max) => {
  const percent = ((current - min) / (max - min)) * 100;
  return Math.min(Math.max(percent, 0), 100);
};

const calculatePercentChange = (current, reference) => {
  return ((current - reference) / reference) * 100;
};

// Demo data for development
const getDemoCompanyData = (ticker) => {
  const demoData = {
    'AAPL': {
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod.',
      website: 'https://www.apple.com',
      country: 'United States',
      employees: 154000,
      marketCap: 2850000000000,
      currentPrice: 173.45,
      pe_ratio: 28.7,
      dividend_yield: 0.53,
      beta: 1.28,
      '52week_high': 199.62,
      '52week_low': 143.90
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.',
      website: 'https://www.microsoft.com',
      country: 'United States',
      employees: 221000,
      marketCap: 2950000000000,
      currentPrice: 417.88,
      pe_ratio: 36.2,
      dividend_yield: 0.71,
      beta: 0.9,
      '52week_high': 430.82,
      '52week_low': 309.98
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.',
      website: 'https://abc.xyz',
      country: 'United States',
      employees: 156000,
      marketCap: 1920000000000,
      currentPrice: 150.77,
      pe_ratio: 25.8,
      dividend_yield: 0.51,
      beta: 1.05,
      '52week_high': 153.78,
      '52week_low': 102.63
    },
    'AMZN': {
      name: 'Amazon.com, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. It operates through three segments: North America, International, and Amazon Web Services (AWS).',
      website: 'https://www.amazon.com',
      country: 'United States',
      employees: 1540000,
      marketCap: 1750000000000,
      currentPrice: 185.07,
      pe_ratio: 50.8,
      dividend_yield: 0,
      beta: 1.14,
      '52week_high': 189.77,
      '52week_low': 118.35
    },
    'META': {
      name: 'Meta Platforms, Inc.',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      description: 'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.',
      website: 'https://about.meta.com',
      country: 'United States',
      employees: 86482,
      marketCap: 1230000000000,
      currentPrice: 485.58,
      pe_ratio: 28.1,
      dividend_yield: 0.42,
      beta: 1.33,
      '52week_high': 531.49,
      '52week_low': 296.74
    },
  };
  
  // Return data for the requested ticker, or a generic fallback
  return demoData[ticker.toUpperCase()] || {
    name: `${ticker.toUpperCase()} Corporation`,
    sector: 'Unknown',
    industry: 'Unknown',
    description: `This is a placeholder description for ${ticker.toUpperCase()}. In a production environment, this information would be fetched from a financial data API.`,
    website: '',
    country: 'Unknown',
    employees: 10000,
    marketCap: 1000000000,
    currentPrice: 100.00,
    pe_ratio: 20.0,
    dividend_yield: 1.0,
    beta: 1.0,
    '52week_high': 120.00,
    '52week_low': 80.00
  };
};

export default CompanyPage;

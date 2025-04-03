import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

// Helper functions for value formatting
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const ResultsSummary = ({ results, ticker }) => {
  if (!results) return null;

  // Extract key metrics from results
  const {
    enterprise_value,
    equity_value,
    wacc,
    terminal_value,
    terminal_growth,
    forecast_cash_flows = [],
    monte_carlo = {}
  } = results;

  // Calculate additional metrics
  const terminalValuePercentage = terminal_value / enterprise_value;
  const monteCarloMean = monte_carlo.mean || 0;
  const monteCarloLower = monte_carlo.ci_lower || 0;
  const monteCarloUpper = monte_carlo.ci_upper || 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Valuation Summary: {ticker}
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Key Valuation Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Key Valuation Metrics
                </Typography>
                <Tooltip title="The primary outputs of the DCF model">
                  <InfoIcon sx={{ ml: 1, fontSize: 18, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Enterprise Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatCurrency(enterprise_value)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Equity Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(equity_value)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    WACC
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatPercentage(wacc)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Terminal Growth Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatPercentage(terminal_growth)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Monte Carlo Results */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Monte Carlo Results
                </Typography>
                <Tooltip title="Valuation range based on Monte Carlo simulation with varying inputs">
                  <InfoIcon sx={{ ml: 1, fontSize: 18, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Mean Equity Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatCurrency(monteCarloMean)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    95% Confidence Interval
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(monteCarloLower)} - {formatCurrency(monteCarloUpper)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Comparison to Base Case
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: monteCarloMean > equity_value ? 'success.main' : 'error.main' }}>
                    {formatPercentage((monteCarloMean - equity_value) / equity_value)}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Uncertainty Range
                    </Typography>
                    <Typography variant="body1">
                      ±{formatPercentage((monteCarloUpper - monteCarloLower) / (2 * monteCarloMean))}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Terminal Value */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Terminal Value Analysis
                </Typography>
                <Tooltip title="The value of all cash flows beyond the forecast period">
                  <InfoIcon sx={{ ml: 1, fontSize: 18, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Terminal Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(terminal_value)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    % of Enterprise Value
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: terminalValuePercentage > 0.8 ? 'warning.main' : 'text.primary'
                    }}
                  >
                    {formatPercentage(terminalValuePercentage)}
                  </Typography>
                </Grid>
              </Grid>
              
              {terminalValuePercentage > 0.8 && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Note: Terminal value represents a high percentage of the total valuation, 
                    which increases uncertainty. Consider adjusting forecast growth rates.
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Terminal Value Calculation
                </Typography>
                <Typography variant="body2">
                  Terminal Value = FCF₅ × (1 + g) ÷ (WACC - g)
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                  = {formatCurrency(forecast_cash_flows[forecast_cash_flows.length - 1] || 0)} × (1 + {formatPercentage(terminal_growth)}) 
                  ÷ ({formatPercentage(wacc)} - {formatPercentage(terminal_growth)})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Forecast Cash Flows */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Forecast Cash Flows
                </Typography>
                <Tooltip title="Projected unlevered free cash flows for the forecast period">
                  <InfoIcon sx={{ ml: 1, fontSize: 18, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={1}>
                {forecast_cash_flows.map((fcf, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Year {index + 1}
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(fcf)}
                      </Typography>
                    </Box>
                    {index < forecast_cash_flows.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Present Value of Forecast Cash Flows
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(enterprise_value - terminal_value)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ({formatPercentage(1 - terminalValuePercentage)} of Enterprise Value)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultsSummary;

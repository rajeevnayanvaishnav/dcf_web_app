import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const AnalysisParameters = ({ params, onChange }) => {
  // Local state to track individual growth rates before committing them all
  const [growthRates, setGrowthRates] = useState(params.growth_rates || [0.05, 0.04, 0.04, 0.03, 0.03]);
  
  const handleGrowthRateChange = (index, value) => {
    const newRates = [...growthRates];
    newRates[index] = parseFloat(value);
    setGrowthRates(newRates);
    
    // Update parent component
    onChange({ growth_rates: newRates });
  };
  
  const handleParamChange = (param, value) => {
    onChange({ [param]: parseFloat(value) });
  };
  
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Growth Rates Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Forecast Growth Rates
                </Typography>
                <Tooltip title="The annual growth rates used to project cash flows for the next 5 years">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {growthRates.map((rate, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Year {index + 1} Growth Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={rate}
                      min={-0.1}
                      max={0.3}
                      step={0.01}
                      onChange={(e, newValue) => handleGrowthRateChange(index, newValue)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${(value * 100).toFixed(1)}%`}
                      sx={{ flex: 1, mr: 2 }}
                    />
                    <Typography variant="body2" sx={{ minWidth: 60 }}>
                      {(rate * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Other Parameters Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Discount & Terminal Parameters
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Terminal Growth Rate
                  </Typography>
                  <Tooltip title="The assumed growth rate in perpetuity after the forecast period (usually close to long-term GDP growth)">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={params.terminal_growth}
                    min={0.01}
                    max={0.05}
                    step={0.001}
                    onChange={(e, newValue) => handleParamChange('terminal_growth', newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(1)}%`}
                    sx={{ flex: 1, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {(params.terminal_growth * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Risk-Free Rate
                  </Typography>
                  <Tooltip title="The return on a risk-free investment (usually 10-year Treasury yield)">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={params.risk_free_rate}
                    min={0.02}
                    max={0.06}
                    step={0.001}
                    onChange={(e, newValue) => handleParamChange('risk_free_rate', newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(1)}%`}
                    sx={{ flex: 1, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {(params.risk_free_rate * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Market Risk Premium
                  </Typography>
                  <Tooltip title="The additional return expected for investing in the stock market versus risk-free assets">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={params.market_risk_premium}
                    min={0.03}
                    max={0.08}
                    step={0.001}
                    onChange={(e, newValue) => handleParamChange('market_risk_premium', newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(1)}%`}
                    sx={{ flex: 1, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {(params.market_risk_premium * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Tax Rate
                  </Typography>
                  <Tooltip title="The effective corporate tax rate used to calculate cash flows">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={params.tax_rate}
                    min={0.1}
                    max={0.4}
                    step={0.01}
                    onChange={(e, newValue) => handleParamChange('tax_rate', newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                    sx={{ flex: 1, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {(params.tax_rate * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Monte Carlo Simulations
                  </Typography>
                  <Tooltip title="Number of simulations to run for the Monte Carlo analysis">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  type="number"
                  value={params.num_simulations}
                  onChange={(e) => handleParamChange('num_simulations', e.target.value)}
                  InputProps={{
                    inputProps: { min: 100, max: 10000, step: 100 }
                  }}
                  size="small"
                  sx={{ width: 150 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalysisParameters;

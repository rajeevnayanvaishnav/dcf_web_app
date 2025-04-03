import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AnalysisParameters from '../components/AnalysisParameters';
import ResultsSummary from '../components/ResultsSummary';
import MonteCarloChart from '../components/MonteCarloChart';
import DetailedMetricsTable from '../components/DetailedMetricsTable';
// We'll implement actual API calls later

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AnalysisPage = () => {
  const { ticker } = useParams();
  const [searchParams] = useSearchParams();
  const isAdvanced = searchParams.get('advanced') === 'true';
  const isMonteCarloFocus = searchParams.get('montecarlo') === 'true';
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(isMonteCarloFocus ? 2 : 0);
  const [analysisParams, setAnalysisParams] = useState({
    growth_rates: [0.05, 0.04, 0.04, 0.03, 0.03],
    terminal_growth: 0.03,
    risk_free_rate: 0.035,
    market_risk_premium: 0.05,
    tax_rate: 0.21,
    num_simulations: 1000
  });
  
  // Function to run the DCF analysis
  const runAnalysis = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a production environment, this would call the backend API
      // const response = await axios.post('/api/analyze-with-params', {
      //   ticker,
      //   ...params
      // });
      // setResults(response.data.data);
      
      // Simulate API call for demonstration
      console.log('Running analysis for', ticker, 'with params:', params);
      
      // Generate mock results immediately to fix loading issue
      const mockResults = generateMockResults(ticker, params);
      
      // Short delay for UX purposes (to show loading state)
      setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error running analysis:', err);
      setError('Failed to run DCF analysis. Please try again.');
      setLoading(false);
    }
  };
  
  // Run analysis on component mount or when parameters change
  useEffect(() => {
    // Ensure we have a ticker and runAnalysis is defined
    if (ticker && typeof runAnalysis === 'function') {
      if (isAdvanced) {
        // Don't automatically run for advanced mode - let user set parameters first
        console.log('Advanced mode - waiting for user parameters');
        return;
      }
      
      console.log('Running initial analysis for', ticker);
      runAnalysis(analysisParams);
    }
  }, [ticker]);  // Only depend on ticker for initial load
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleParametersChange = (newParams) => {
    setAnalysisParams(prev => ({
      ...prev,
      ...newParams
    }));
  };
  
  const handleRunAnalysisClick = () => {
    console.log('Run analysis button clicked');
    // Make a copy of params to avoid reference issues
    const paramsCopy = {...analysisParams};
    runAnalysis(paramsCopy);
  };
  
  const handleExportResults = () => {
    if (!results) return;
    
    // In a real app, we would call an API endpoint to generate an Excel file
    // For demo purposes, we'll create a JSON file
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dcf_analysis_${ticker}_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1">
            DCF Analysis: {ticker}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Discounted Cash Flow Valuation
          </Typography>
        </Box>
        
        {results && (
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
            onClick={handleExportResults}
          >
            Export Results
          </Button>
        )}
      </Box>
      
      {/* Parameters Section - Only shown in advanced mode */}
      {isAdvanced && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            DCF Parameters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <AnalysisParameters 
            params={analysisParams} 
            onChange={handleParametersChange} 
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleRunAnalysisClick}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Running Analysis...
                </>
              ) : 'Run Analysis'}
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Loading State */}
      {loading && !isAdvanced && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">
            Running DCF Analysis for {ticker}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a few moments...
          </Typography>
        </Box>
      )}
      
      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Results Section */}
      {results && !loading && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="analysis results tabs"
            >
              <Tab label="Summary" />
              <Tab label="Detailed Metrics" />
              <Tab label="Monte Carlo Simulation" />
              <Tab label="Methodology" />
            </Tabs>
          </Box>
          
          {/* Summary Tab */}
          <TabPanel value={tabValue} index={0}>
            <ResultsSummary results={results} ticker={ticker} />
          </TabPanel>
          
          {/* Detailed Metrics Tab */}
          <TabPanel value={tabValue} index={1}>
            <DetailedMetricsTable results={results} />
          </TabPanel>
          
          {/* Monte Carlo Tab */}
          <TabPanel value={tabValue} index={2}>
            <MonteCarloChart data={results.monte_carlo} />
            
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monte Carlo Simulation Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1" paragraph>
                The Monte Carlo simulation runs {analysisParams.num_simulations.toLocaleString()} iterations of the DCF model with varying inputs to account for uncertainty in forecasting.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Varied Parameters:
                      </Typography>
                      <ul>
                        <li>Growth rates (±1-2%)</li>
                        <li>WACC (±1%)</li>
                        <li>EBIT margins (±2%)</li>
                        <li>Capital expenditure ratios (±1%)</li>
                        <li>Terminal growth rate (±0.5%)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Statistical Results:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Mean: ${(results.monte_carlo.mean / 1e9).toFixed(2)} billion
                        </Typography>
                        <Typography variant="body2">
                          Median: ${(results.monte_carlo.median / 1e9).toFixed(2)} billion
                        </Typography>
                        <Typography variant="body2">
                          Standard Deviation: ${(results.monte_carlo.std / 1e9).toFixed(2)} billion
                        </Typography>
                        <Typography variant="body2">
                          95% CI: ${(results.monte_carlo.ci_lower / 1e9).toFixed(2)} to ${(results.monte_carlo.ci_upper / 1e9).toFixed(2)} billion
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </TabPanel>
          
          {/* Methodology Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              DCF Analysis Methodology
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              Our DCF model calculates the intrinsic value of a company by estimating future cash flows and discounting them to their present value. Here's how the model works:
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">1. Cash Flow Projection</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  The model projects unlevered free cash flows (UFCF) for the forecast period based on historical financial data and growth assumptions. Cash flows are calculated using the formula:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', my: 2, pl: 2 }}>
                  UFCF = EBIT × (1 - Tax Rate) + Depreciation - Capital Expenditures - Change in Working Capital
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">2. Weighted Average Cost of Capital (WACC)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  The discount rate used is the Weighted Average Cost of Capital (WACC), which represents the company's cost of funding. It's calculated as:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', my: 2, pl: 2 }}>
                  WACC = (E/(D+E)) × Cost of Equity + (D/(D+E)) × Cost of Debt × (1 - Tax Rate)
                </Typography>
                <Typography variant="body2" paragraph>
                  Where Cost of Equity = Risk-Free Rate + Beta × Market Risk Premium
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">3. Terminal Value Calculation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Terminal value represents the company's value beyond the forecast period, calculated using the perpetuity growth method:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', my: 2, pl: 2 }}>
                  Terminal Value = FCF in final forecast year × (1 + Terminal Growth Rate) / (WACC - Terminal Growth Rate)
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">4. Discounting and Valuation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Each projected cash flow and the terminal value are discounted to their present value using the WACC:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', my: 2, pl: 2 }}>
                  PV of CF = CF / (1 + WACC)^n
                </Typography>
                <Typography variant="body2" paragraph>
                  The sum of all discounted cash flows and the discounted terminal value gives the enterprise value. To get equity value, we subtract net debt.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">5. Monte Carlo Simulation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  The Monte Carlo simulation runs multiple iterations of the DCF model with randomly varied inputs based on probability distributions. This accounts for uncertainty in forecasting and provides a range of possible outcomes rather than a single point estimate.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </TabPanel>
        </Box>
      )}
    </Box>
  );
};

// Helper function to generate mock DCF results for demonstration
const generateMockResults = (ticker, params) => {
  // Base values for each ticker
  const tickerData = {
    'AAPL': { base_ev: 883.17e9, base_equity: 883.17e9, wacc: 0.0839, terminal_value: 942.00e9 },
    'MSFT': { base_ev: 1088.65e9, base_equity: 1044.73e9, wacc: 0.0749, terminal_value: 1160.54e9 },
    'GOOGL': { base_ev: 512.94e9, base_equity: 512.94e9, wacc: 0.0761, terminal_value: 546.85e9 },
    'AMZN': { base_ev: 354.10e9, base_equity: 354.10e9, wacc: 0.0886, terminal_value: 377.79e9 },
    'META': { base_ev: 196.79e9, base_equity: 196.79e9, wacc: 0.0846, terminal_value: 209.90e9 }
  };
  
  // Get data for the requested ticker, or use default values
  const baseData = tickerData[ticker.toUpperCase()] || {
    base_ev: 500e9,
    base_equity: 450e9,
    wacc: 0.085,
    terminal_value: 550e9
  };
  
  // Apply parameter adjustments
  const terminalGrowthMultiplier = params.terminal_growth / 0.03;
  const equityValue = baseData.base_equity * (1 + (terminalGrowthMultiplier - 1) * 0.5);
  const enterpriseValue = baseData.base_ev * (1 + (terminalGrowthMultiplier - 1) * 0.5);
  const terminalValue = baseData.terminal_value * terminalGrowthMultiplier;
  
  // Adjust WACC if risk_free_rate or market_risk_premium are changed
  const baseRiskFree = 0.035;
  const baseMRP = 0.05;
  let wacc = baseData.wacc;
  
  if (params.risk_free_rate !== baseRiskFree || params.market_risk_premium !== baseMRP) {
    const waccDelta = (params.risk_free_rate - baseRiskFree) + 
                      (params.market_risk_premium - baseMRP) * 1.1; // Assuming beta of ~1.1
    wacc = baseData.wacc + waccDelta;
  }
  
  // Generate Monte Carlo values
  const mean = equityValue * 0.6; // MC mean is typically more conservative
  const median = mean * 0.95;
  const std = mean * 0.15; // 15% standard deviation
  const ci_lower = mean - 1.96 * std;
  const ci_upper = mean + 1.96 * std;
  
  // Calculate metrics
  const ebitMargin = 0.25 + Math.random() * 0.15; // 25-40%
  const capexRatio = 0.04 + Math.random() * 0.06; // 4-10%
  const workingCapitalRatio = 0.05 + Math.random() * 0.15; // 5-20%
  const valueToRevenue = enterpriseValue / (enterpriseValue / (ebitMargin * 5));
  
  // Generate forecast cash flows
  const forecastCashFlows = [];
  let baseValue = equityValue * 0.03; // 3% of equity value as base FCF
  
  for (let i = 0; i < 5; i++) {
    const growthRate = params.growth_rates[i] || 0.05;
    if (i > 0) {
      baseValue = forecastCashFlows[i-1] * (1 + growthRate);
    }
    forecastCashFlows.push(baseValue);
  }
  
  return {
    enterprise_value: enterpriseValue,
    equity_value: equityValue,
    wacc: wacc,
    terminal_value: terminalValue,
    terminal_growth: params.terminal_growth,
    forecast_cash_flows: forecastCashFlows,
    monte_carlo: {
      mean,
      median,
      std,
      ci_lower,
      ci_upper
    },
    metrics: {
      ebit_margin: ebitMargin,
      capex_ratio: capexRatio,
      working_capital_ratio: workingCapitalRatio,
      value_to_revenue: valueToRevenue
    }
  };
};

export default AnalysisPage;

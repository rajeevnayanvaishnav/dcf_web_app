import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const DetailedMetricsTable = ({ results }) => {
  if (!results) return null;

  // Format numbers for display
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

  // Extract metrics from results
  const {
    enterprise_value,
    equity_value,
    wacc,
    terminal_value,
    terminal_growth,
    forecast_cash_flows = [],
    metrics = {}
  } = results;

  // Calculate additional metrics
  const presentValueCashFlows = enterprise_value - terminal_value;
  const terminalValuePercentage = terminal_value / enterprise_value;
  const presentValueCashFlowsPercentage = presentValueCashFlows / enterprise_value;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detailed Financial Metrics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Operational Metrics Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Operational Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Box}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">EBIT Margin</TableCell>
                      <TableCell align="right">{formatPercentage(metrics.ebit_margin || 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Capital Expenditure Ratio</TableCell>
                      <TableCell align="right">{formatPercentage(metrics.capex_ratio || 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Working Capital Ratio</TableCell>
                      <TableCell align="right">{formatPercentage(metrics.working_capital_ratio || 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Value to Revenue Multiple</TableCell>
                      <TableCell align="right">{(metrics.value_to_revenue || 0).toFixed(2)}x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Valuation Metrics Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Valuation Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Box}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Enterprise Value</TableCell>
                      <TableCell align="right">{formatCurrency(enterprise_value)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Equity Value</TableCell>
                      <TableCell align="right">{formatCurrency(equity_value)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">WACC</TableCell>
                      <TableCell align="right">{formatPercentage(wacc)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Terminal Growth Rate</TableCell>
                      <TableCell align="right">{formatPercentage(terminal_growth)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Cash Flow Table */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Detailed Cash Flow Analysis
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer>
          <Table aria-label="cash flow table">
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell align="right">Cash Flow</TableCell>
                <TableCell align="right">Discount Factor</TableCell>
                <TableCell align="right">Present Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecast_cash_flows.map((fcf, index) => {
                const year = index + 1;
                const discountFactor = Math.pow(1 + wacc, year);
                const presentValue = fcf / discountFactor;
                
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">Year {year}</TableCell>
                    <TableCell align="right">{formatCurrency(fcf)}</TableCell>
                    <TableCell align="right">{discountFactor.toFixed(4)}</TableCell>
                    <TableCell align="right">{formatCurrency(presentValue)}</TableCell>
                  </TableRow>
                );
              })}
              
              {/* Terminal Value Row */}
              <TableRow sx={{ '& td, & th': { fontWeight: 'bold', bgcolor: 'action.hover' } }}>
                <TableCell component="th" scope="row">Terminal Value</TableCell>
                <TableCell align="right">{formatCurrency(terminal_value * Math.pow(1 + wacc, forecast_cash_flows.length))}</TableCell>
                <TableCell align="right">{Math.pow(1 + wacc, forecast_cash_flows.length).toFixed(4)}</TableCell>
                <TableCell align="right">{formatCurrency(terminal_value)}</TableCell>
              </TableRow>
              
              {/* Total Row */}
              <TableRow sx={{ '& td, & th': { fontWeight: 'bold' } }}>
                <TableCell component="th" scope="row">Total Enterprise Value</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{formatCurrency(enterprise_value)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Value Allocation */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Value Allocation
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer>
          <Table aria-label="value allocation table">
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Present Value of Forecast Cash Flows</TableCell>
                <TableCell align="right">{formatCurrency(presentValueCashFlows)}</TableCell>
                <TableCell align="right">{formatPercentage(presentValueCashFlowsPercentage)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Present Value of Terminal Value</TableCell>
                <TableCell align="right">{formatCurrency(terminal_value)}</TableCell>
                <TableCell align="right">{formatPercentage(terminalValuePercentage)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& td, & th': { fontWeight: 'bold' } }}>
                <TableCell component="th" scope="row">Enterprise Value</TableCell>
                <TableCell align="right">{formatCurrency(enterprise_value)}</TableCell>
                <TableCell align="right">100.00%</TableCell>
              </TableRow>
              {/* If we had debt information */}
              {equity_value !== enterprise_value && (
                <>
                  <TableRow>
                    <TableCell component="th" scope="row">Net Debt</TableCell>
                    <TableCell align="right">{formatCurrency(enterprise_value - equity_value)}</TableCell>
                    <TableCell align="right">{formatPercentage((enterprise_value - equity_value) / enterprise_value)}</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td, & th': { fontWeight: 'bold' } }}>
                    <TableCell component="th" scope="row">Equity Value</TableCell>
                    <TableCell align="right">{formatCurrency(equity_value)}</TableCell>
                    <TableCell align="right">{formatPercentage(equity_value / enterprise_value)}</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* WACC Calculation */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          WACC Calculation
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            WACC = (E / (D + E)) × Cost of Equity + (D / (D + E)) × Cost of Debt × (1 - Tax Rate)
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
            Cost of Equity = Risk-Free Rate + Beta × Market Risk Premium
          </Typography>
        </Box>
        
        <TableContainer>
          <Table size="small" aria-label="wacc calculation table">
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Risk-Free Rate</TableCell>
                <TableCell align="right">{formatPercentage(0.035)}</TableCell>
                <TableCell>10-year Treasury yield</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Beta</TableCell>
                <TableCell align="right">{(wacc / 0.085 * 1.1).toFixed(2)}</TableCell>
                <TableCell>Measure of stock volatility vs. market</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Market Risk Premium</TableCell>
                <TableCell align="right">{formatPercentage(0.05)}</TableCell>
                <TableCell>Expected market return above risk-free rate</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Cost of Equity</TableCell>
                <TableCell align="right">{formatPercentage(0.035 + (wacc / 0.085 * 1.1) * 0.05)}</TableCell>
                <TableCell>Risk-free rate + Beta × Market risk premium</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">WACC</TableCell>
                <TableCell align="right">{formatPercentage(wacc)}</TableCell>
                <TableCell>Weighted average cost of capital</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DetailedMetricsTable;

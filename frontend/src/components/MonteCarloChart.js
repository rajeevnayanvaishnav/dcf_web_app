import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

// Register all Chart.js components
Chart.register(...registerables);

const MonteCarloChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create normal distribution data based on monte carlo results
    const { mean, std, ci_lower, ci_upper } = data;
    const chartData = createNormalDistribution(mean, std, ci_lower, ci_upper);

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Probability Density',
          data: chartData.values,
          backgroundColor: createGradientColors(ctx, ci_lower, ci_upper, mean),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                const item = tooltipItems[0];
                const value = parseFloat(item.label.replace('$', '').replace('B', '')) * 1e9;
                return `Equity Value: $${formatCurrency(value)}`;
              },
              label: function(context) {
                const value = context.raw;
                return `Probability: ${(value * 100).toFixed(2)}%`;
              }
            }
          },
          annotation: {
            annotations: {
              mean: {
                type: 'line',
                scaleID: 'x',
                value: formatCurrency(mean / 1e9),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                label: {
                  display: true,
                  content: 'Mean',
                  position: 'top'
                }
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Equity Value ($ Billions)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Probability Density'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monte Carlo Simulation Results
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body2" paragraph>
        This chart shows the probability distribution of equity values based on {data.num_simulations || 1000} 
        simulations with varying inputs. The darker blue region represents the 95% confidence interval.
      </Typography>
      
      <Box sx={{ height: 400, position: 'relative' }}>
        <canvas ref={chartRef} />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Key Statistics:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Mean
            </Typography>
            <Typography variant="body1">
              ${formatCurrency(data.mean)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Median
            </Typography>
            <Typography variant="body1">
              ${formatCurrency(data.median || data.mean)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Standard Deviation
            </Typography>
            <Typography variant="body1">
              ${formatCurrency(data.std)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              95% Confidence Interval
            </Typography>
            <Typography variant="body1">
              ${formatCurrency(data.ci_lower)} to ${formatCurrency(data.ci_upper)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// Helper functions
const formatCurrency = (value) => {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toFixed(2);
};

const createNormalDistribution = (mean, stdDev, ci_lower, ci_upper) => {
  // Generate points for a normal distribution
  const numPoints = 30;
  const min = Math.max(0, ci_lower - stdDev);
  const max = ci_upper + stdDev;
  const step = (max - min) / numPoints;
  
  const labels = [];
  const values = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const x = min + i * step;
    const label = '$' + formatCurrency(x);
    
    // Normal distribution PDF formula
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    
    labels.push(label);
    values.push(y);
  }
  
  return { labels, values };
};

const createGradientColors = (ctx, ci_lower, ci_upper, mean) => {
  // Create array of colors based on confidence interval
  const numPoints = 30;
  const min = Math.max(0, ci_lower - (ci_upper - ci_lower) * 0.2);
  const max = ci_upper + (ci_upper - ci_lower) * 0.2;
  const step = (max - min) / numPoints;
  
  const colors = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const x = min + i * step;
    
    // Create gradient color based on position in confidence interval
    if (x >= ci_lower && x <= ci_upper) {
      // Inside confidence interval - darker blue
      colors.push('rgba(54, 162, 235, 0.7)');
    } else {
      // Outside confidence interval - lighter blue
      colors.push('rgba(54, 162, 235, 0.3)');
    }
    
    // Highlight the mean with a more intense color
    if (Math.abs(x - mean) < step) {
      colors[i] = 'rgba(54, 162, 235, 0.9)';
    }
  }
  
  return colors;
};

export default MonteCarloChart;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
// We'll implement actual API calls later

const TickerSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Simulated ticker data for demonstration
  // In a real app, this would come from an API
  const demoTickers = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' }
  ];
  
  const searchTickers = async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // In a production app, we would call an actual API like:
      // const response = await axios.get(`/api/search-tickers?query=${q}`);
      // const data = response.data;
      
      // For demonstration, we'll filter the demo data
      const filteredTickers = demoTickers.filter(ticker => 
        ticker.symbol.toLowerCase().includes(q.toLowerCase()) || 
        ticker.name.toLowerCase().includes(q.toLowerCase())
      );
      
      setSuggestions(filteredTickers);
    } catch (err) {
      console.error('Error searching tickers:', err);
      setError("Could not load ticker suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTickerSelect = (ticker) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/company/${ticker}`);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Assume it's a valid ticker and navigate
      navigate(`/company/${query.trim().toUpperCase()}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search for a company or ticker"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              searchTickers(e.target.value);
            }}
            placeholder="Enter stock ticker (e.g., AAPL)"
            variant="outlined"
            InputProps={{
              endAdornment: loading ? <CircularProgress size={20} /> : null,
            }}
          />
          <Button 
            type="submit"
            variant="contained" 
            sx={{ ml: 1, height: 56 }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
      </form>
      
      {error && (
        <Box sx={{ color: 'error.main', mt: 1 }}>
          {error}
        </Box>
      )}
      
      {suggestions.length > 0 && (
        <Paper sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
          <List>
            {suggestions.map((ticker) => (
              <ListItem key={ticker.symbol} disablePadding>
                <ListItemButton onClick={() => handleTickerSelect(ticker.symbol)}>
                  <ListItemText 
                    primary={`${ticker.symbol} - ${ticker.name}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default TickerSearch;

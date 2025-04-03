import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// Import pages
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import CompanyPage from './pages/CompanyPage';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis/:ticker" element={<AnalysisPage />} />
            <Route path="/company/:ticker" element={<CompanyPage />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

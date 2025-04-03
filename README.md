# DCF Analyzer Web Application

A comprehensive web application for performing Discounted Cash Flow (DCF) analysis on publicly traded companies, featuring dynamic data retrieval, Monte Carlo simulations, and interactive visualizations.

## Features

- **Company Information**: View key statistics, financials, and historical performance data
- **DCF Analysis**: Calculate enterprise value, equity value, and terminal value with customizable parameters
- **Monte Carlo Simulation**: Assess valuation uncertainty with probabilistic modeling
- **Interactive Visualizations**: Explore results through charts and detailed metrics
- **Customizable Parameters**: Adjust growth rates, discount rates, and other inputs
- **Export Functionality**: Save analysis results in various formats

## Project Structure

The project follows a client-server architecture:

```
dcf-web-app/
├── backend/
│   ├── api/
│   │   └── app.py          # Flask API server
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── public/             # Public assets
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   └── App.js          # Main React app
    └── package.json        # Node.js dependencies
```

## Prerequisites

- Python 3.8+ with pip
- Node.js 14+ with npm or yarn
- Access to your Python DCF model package

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd dcf-web-app/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On Unix or MacOS:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Ensure you have the python-dcf-model package accessible:
   - The application assumes the model is available in a sibling directory. If it's located elsewhere, update the path in `api/app.py`.

6. Start the Flask server:
   ```
   python api/app.py
   ```
   The API will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd dcf-web-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```
   The frontend will be available at http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Search for a company by name or ticker symbol
3. View company information on the company page
4. Click "Run DCF Analysis" to perform standard analysis
5. For advanced analysis, select "Advanced DCF" to customize parameters
6. Explore the results through the various tabs and visualizations
7. Export results using the export button

## Technology Stack

- **Backend**: Python, Flask, NumPy, Pandas, yfinance
- **Frontend**: React, Material UI, Chart.js
- **Data**: Yahoo Finance API (via yfinance)

## Future Enhancements

- User authentication and saved analyses
- Additional valuation models (e.g., Comparable Company Analysis)
- Company comparison tools
- PDF report generation
- Real-time stock price data integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on the Python DCF Model developed for financial analysis
- Uses Yahoo Finance API data through the yfinance package

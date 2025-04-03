from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import logging
import json
from datetime import datetime

# Add the python-dcf-model directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
project_dir = os.path.dirname(backend_dir)
dcf_model_dir = os.path.join(project_dir, '..', 'python-dcf-model')
sys.path.append(os.path.abspath(dcf_model_dir))

# Now try to import DCFModel
try:
    from dcf_model.dcf import DCFModel
    logging.info(f"Successfully imported DCFModel from {dcf_model_dir}")
except ImportError as e:
    logging.error(f"Failed to import DCFModel: {e}")
    logging.error(f"sys.path: {sys.path}")
    logging.error(f"Looking for DCF model in: {dcf_model_dir}")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('dcf-web-api')

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'DCF API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_stock():
    """Analyze a stock using the DCF model"""
    data = request.json
    ticker = data.get('ticker')
    
    if not ticker:
        return jsonify({
            'status': 'error',
            'message': 'Ticker symbol is required'
        }), 400
    
    try:
        logger.info(f"Starting analysis for ticker: {ticker}")
        
        # Initialize DCF model
        dcf = DCFModel(ticker)
        
        # Run analysis
        results = dcf.run_analysis()
        
        # Convert numpy types to Python native types for JSON serialization
        serializable_results = json_serialize(results)
        
        logger.info(f"Analysis completed for ticker: {ticker}")
        
        return jsonify({
            'status': 'success',
            'ticker': ticker,
            'data': serializable_results
        })
    except Exception as e:
        logger.error(f"Error analyzing ticker {ticker}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/analyze-with-params', methods=['POST'])
def analyze_with_params():
    """Analyze a stock with custom parameters"""
    data = request.json
    ticker = data.get('ticker')
    
    if not ticker:
        return jsonify({
            'status': 'error',
            'message': 'Ticker symbol is required'
        }), 400
    
    try:
        # Extract custom parameters with default values
        params = {
            'growth_rates': data.get('growth_rates', [0.05, 0.04, 0.03, 0.03, 0.03]),
            'terminal_growth': data.get('terminal_growth', 0.03),
            'forecast_years': data.get('forecast_years', 5),
            'risk_free_rate': data.get('risk_free_rate', 0.035),
            'market_risk_premium': data.get('market_risk_premium', 0.05),
            'tax_rate': data.get('tax_rate', 0.21),
            'num_simulations': data.get('num_simulations', 1000)
        }
        
        logger.info(f"Starting custom analysis for ticker: {ticker} with params: {params}")
        
        # Initialize DCF model
        dcf = DCFModel(ticker)
        
        # Override parameters
        if 'terminal_growth' in params:
            dcf.terminal_growth = params['terminal_growth']
        
        if 'risk_free_rate' in params:
            dcf.risk_free_rate = params['risk_free_rate']
            
        if 'market_risk_premium' in params:
            dcf.market_risk_premium = params['market_risk_premium']
            
        if 'tax_rate' in params:
            dcf.tax_rate = params['tax_rate']
        
        # Run analysis with custom parameters
        results = dcf.run_analysis()
        
        # If custom growth rates were provided, recalculate forecasted cash flows
        if 'growth_rates' in params and params['growth_rates']:
            # We would need to implement custom_forecast method in DCFModel
            # This is a placeholder for now
            pass
        
        # Run Monte Carlo with custom parameters
        if 'num_simulations' in params:
            results['monte_carlo'] = dcf.monte_carlo_simulation(num_simulations=params['num_simulations'])
        
        # Convert numpy types to Python native types for JSON serialization
        serializable_results = json_serialize(results)
        
        logger.info(f"Custom analysis completed for ticker: {ticker}")
        
        return jsonify({
            'status': 'success',
            'ticker': ticker,
            'data': serializable_results,
            'parameters': params
        })
    except Exception as e:
        logger.error(f"Error in custom analysis for ticker {ticker}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/company-info', methods=['GET'])
def get_company_info():
    """Get basic company information"""
    ticker = request.args.get('ticker')
    
    if not ticker:
        return jsonify({
            'status': 'error',
            'message': 'Ticker symbol is required'
        }), 400
    
    try:
        import yfinance as yf
        
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Extract key company information
        company_info = {
            'name': info.get('shortName', ''),
            'sector': info.get('sector', ''),
            'industry': info.get('industry', ''),
            'description': info.get('longBusinessSummary', ''),
            'website': info.get('website', ''),
            'country': info.get('country', ''),
            'employees': info.get('fullTimeEmployees', ''),
            'marketCap': info.get('marketCap', 0),
            'currentPrice': info.get('currentPrice', 0),
            'pe_ratio': info.get('trailingPE', 0),
            'dividend_yield': info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 0,
            'beta': info.get('beta', 0),
            '52week_high': info.get('fiftyTwoWeekHigh', 0),
            '52week_low': info.get('fiftyTwoWeekLow', 0)
        }
        
        return jsonify({
            'status': 'success',
            'ticker': ticker,
            'data': company_info
        })
    except Exception as e:
        logger.error(f"Error fetching company info for {ticker}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def json_serialize(obj):
    """Recursively convert numpy types to Python native types for JSON serialization"""
    import numpy as np
    
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: json_serialize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [json_serialize(item) for item in obj]
    else:
        return obj

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Debug mode should be disabled in production
    debug = os.environ.get('FLASK_ENV', 'production') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug)

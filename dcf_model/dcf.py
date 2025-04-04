import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
import logging

class DCFModel:
    """
    Discounted Cash Flow (DCF) model for company valuation.
    
    This class implements a DCF valuation model that calculates:
    - Enterprise Value
    - Equity Value
    - Terminal Value
    - WACC (Weighted Average Cost of Capital)
    """
    
    def __init__(self, ticker, forecast_years=5, terminal_growth=0.03, 
                 risk_free_rate=0.035, market_risk_premium=0.05, tax_rate=0.21):
        """
        Initialize the DCF model with company ticker and parameters.
        
        Args:
            ticker (str): Company stock ticker symbol
            forecast_years (int): Number of years to forecast
            terminal_growth (float): Long-term growth rate for terminal value
            risk_free_rate (float): Risk-free rate (e.g., 10-year Treasury yield)
            market_risk_premium (float): Market risk premium
            tax_rate (float): Corporate tax rate
        """
        self.ticker = ticker
        self.forecast_years = forecast_years
        self.terminal_growth = terminal_growth
        self.risk_free_rate = risk_free_rate
        self.market_risk_premium = market_risk_premium
        self.tax_rate = tax_rate
        
        # Initialize data attributes
        self.company_data = None
        self.financials = None
        self.balance_sheet = None
        self.cash_flow = None
        self.income_stmt = None
        self.beta = None
        self.market_cap = None
        self.total_debt = None
        self.cash = None
        self.shares_outstanding = None
        
        # Fetch company data
        self._fetch_company_data()
    
    def _fetch_company_data(self):
        """Fetch company financial data from Yahoo Finance."""
        try:
            # Get company info
            company = yf.Ticker(self.ticker)
            self.company_data = company.info
            
            # Get financial statements
            self.balance_sheet = company.balance_sheet
            self.cash_flow = company.cashflow
            self.income_stmt = company.income_stmt
            
            # Extract key metrics
            self.beta = self.company_data.get('beta', 1.0)
            self.market_cap = self.company_data.get('marketCap', 0)
            self.total_debt = self.company_data.get('totalDebt', 0)
            self.cash = self.company_data.get('totalCash', 0)
            self.shares_outstanding = self.company_data.get('sharesOutstanding', 0)
            
            logging.info(f"Successfully fetched data for {self.ticker}")
        except Exception as e:
            logging.error(f"Error fetching data for {self.ticker}: {e}")
            # Use default values if data fetching fails
            self.beta = 1.0
            self.market_cap = 1000000000  # $1B default
            self.total_debt = 200000000   # $200M default
            self.cash = 100000000         # $100M default
            self.shares_outstanding = 100000000  # 100M shares default
    
    def calculate_wacc(self):
        """
        Calculate the Weighted Average Cost of Capital (WACC).
        
        Returns:
            float: WACC value
        """
        # Cost of equity using CAPM
        cost_of_equity = self.risk_free_rate + self.beta * self.market_risk_premium
        
        # Cost of debt (simplified)
        cost_of_debt = 0.05  # Assume 5% cost of debt
        
        # Calculate weights
        equity_value = self.market_cap
        debt_value = self.total_debt
        
        total_value = equity_value + debt_value
        
        if total_value == 0:
            return 0.10  # Default to 10% if we can't calculate
        
        weight_equity = equity_value / total_value
        weight_debt = debt_value / total_value
        
        # Calculate WACC
        wacc = (weight_equity * cost_of_equity) + (weight_debt * cost_of_debt * (1 - self.tax_rate))
        
        return wacc
    
    def forecast_cash_flows(self):
        """
        Forecast future cash flows based on historical data.
        
        Returns:
            list: Forecasted free cash flows for each year
        """
        # Get historical free cash flow
        try:
            if self.cash_flow is not None and not self.cash_flow.empty:
                # Calculate historical free cash flow
                operating_cash_flow = self.cash_flow.loc['Operating Cash Flow'].iloc[0]
                capital_expenditure = self.cash_flow.loc['Capital Expenditure'].iloc[0]
                historical_fcf = operating_cash_flow + capital_expenditure  # CapEx is negative
            else:
                # Use a default value if data is not available
                historical_fcf = 100000000  # $100M default
        except Exception as e:
            logging.error(f"Error calculating historical FCF: {e}")
            historical_fcf = 100000000  # $100M default
        
        # Calculate growth rates based on historical data
        growth_rates = []
        
        # First year: 5% growth
        growth_rates.append(0.05)
        
        # Subsequent years: gradually decreasing growth
        for i in range(1, self.forecast_years):
            growth_rate = 0.05 - (i * 0.005)  # Decrease by 0.5% each year
            growth_rates.append(max(growth_rate, 0.02))  # Minimum 2% growth
        
        # Forecast free cash flows
        forecasted_fcf = []
        current_fcf = historical_fcf
        
        for growth_rate in growth_rates:
            current_fcf = current_fcf * (1 + growth_rate)
            forecasted_fcf.append(current_fcf)
        
        return forecasted_fcf, growth_rates
    
    def calculate_terminal_value(self, last_fcf):
        """
        Calculate the terminal value using the Gordon Growth Model.
        
        Args:
            last_fcf (float): Last forecasted free cash flow
            
        Returns:
            float: Terminal value
        """
        wacc = self.calculate_wacc()
        
        # Gordon Growth Model: TV = FCF * (1 + g) / (WACC - g)
        terminal_value = last_fcf * (1 + self.terminal_growth) / (wacc - self.terminal_growth)
        
        return terminal_value
    
    def run_analysis(self):
        """
        Run the complete DCF analysis.
        
        Returns:
            dict: Analysis results including enterprise value, equity value, etc.
        """
        # Calculate WACC
        wacc = self.calculate_wacc()
        
        # Forecast cash flows
        forecasted_fcf, growth_rates = self.forecast_cash_flows()
        
        # Calculate present value of forecasted cash flows
        pv_fcf = 0
        for i, fcf in enumerate(forecasted_fcf):
            pv_fcf += fcf / ((1 + wacc) ** (i + 1))
        
        # Calculate terminal value
        terminal_value = self.calculate_terminal_value(forecasted_fcf[-1])
        
        # Discount terminal value
        pv_terminal = terminal_value / ((1 + wacc) ** self.forecast_years)
        
        # Calculate enterprise value
        enterprise_value = pv_fcf + pv_terminal
        
        # Calculate equity value
        equity_value = enterprise_value - self.total_debt + self.cash
        
        # Calculate per share value
        per_share_value = equity_value / self.shares_outstanding if self.shares_outstanding > 0 else 0
        
        # Prepare results
        results = {
            'enterprise_value': enterprise_value,
            'equity_value': equity_value,
            'terminal_value': terminal_value,
            'wacc': wacc,
            'forecast_years': self.forecast_years,
            'growth_rates': growth_rates,
            'per_share_value': per_share_value,
            'current_price': self.company_data.get('currentPrice', 0),
            'beta': self.beta,
            'market_cap': self.market_cap,
            'total_debt': self.total_debt,
            'cash': self.cash
        }
        
        return results

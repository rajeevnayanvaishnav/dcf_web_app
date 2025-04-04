"""
Utility functions for financial calculations and data processing

This module provides helper functions for common financial calculations
and data processing tasks used in the DCF model.
"""

import pandas as pd
import numpy as np
from typing import List, Optional, Tuple
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def calculate_cagr(start_value: float, end_value: float, periods: int) -> float:
    """
    Calculate Compound Annual Growth Rate (CAGR)
    
    Args:
        start_value: Initial value
        end_value: Final value
        periods: Number of periods
        
    Returns:
        float: CAGR as a decimal
    """
    try:
        if start_value <= 0:
            raise ValueError("Start value must be positive")
            
        cagr = (end_value / start_value) ** (1/periods) - 1
        return cagr
        
    except ZeroDivisionError:
        logger.error("Number of periods cannot be zero")
        raise
    except Exception as e:
        logger.error(f"Error calculating CAGR: {str(e)}")
        raise

def calculate_growth_rate(values: List[float], periods: int) -> float:
    """
    Calculate average growth rate over multiple periods
    
    Args:
        values: List of values over time
        periods: Number of periods
        
    Returns:
        float: Average growth rate as a decimal
    """
    try:
        if len(values) < 2:
            raise ValueError("At least two values are required")
            
        growth_rates = []
        for i in range(1, len(values)):
            growth = (values[i] - values[i-1]) / values[i-1]
            growth_rates.append(growth)
            
        return np.mean(growth_rates)
        
    except ZeroDivisionError:
        logger.error("Zero value encountered in growth calculation")
        raise
    except Exception as e:
        logger.error(f"Error calculating growth rate: {str(e)}")
        raise

def calculate_debt_ratio(balance_sheet: pd.DataFrame) -> float:
    """
    Calculate debt ratio from balance sheet data
    
    Args:
        balance_sheet: Balance sheet DataFrame
        
    Returns:
        float: Debt ratio as a decimal
    """
    try:
        total_debt = balance_sheet['Total Debt'].iloc[-1]
        total_assets = balance_sheet['Total Assets'].iloc[-1]
        
        if total_assets <= 0:
            raise ValueError("Total assets must be positive")
            
        return total_debt / total_assets
        
    except KeyError as e:
        logger.error(f"Missing required column in balance sheet: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error calculating debt ratio: {str(e)}")
        raise

def calculate_interest_coverage_ratio(income_stmt: pd.DataFrame) -> float:
    """
    Calculate interest coverage ratio from income statement
    
    Args:
        income_stmt: Income statement DataFrame
        
    Returns:
        float: Interest coverage ratio
    """
    try:
        ebit = income_stmt['EBIT'].iloc[-1]
        interest_expense = income_stmt['Interest Expense'].iloc[-1]
        
        if interest_expense <= 0:
            raise ValueError("Interest expense must be positive")
            
        return ebit / interest_expense
        
    except KeyError as e:
        logger.error(f"Missing required column in income statement: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error calculating interest coverage ratio: {str(e)}")
        raise

def project_revenue(historical_revenue: List[float], 
                   growth_rate: float, 
                   periods: int) -> List[float]:
    """
    Project future revenue based on historical growth
    
    Args:
        historical_revenue: List of historical revenue values
        growth_rate: Annual growth rate as a decimal
        periods: Number of periods to project
        
    Returns:
        List[float]: Projected revenue values
    """
    try:
        if len(historical_revenue) < 1:
            raise ValueError("At least one historical revenue value required")
            
        last_revenue = historical_revenue[-1]
        projections = []
        
        for _ in range(periods):
            next_revenue = last_revenue * (1 + growth_rate)
            projections.append(next_revenue)
            last_revenue = next_revenue
            
        return projections
        
    except Exception as e:
        logger.error(f"Error projecting revenue: {str(e)}")
        raise

def calculate_ebit_margin(income_stmt: pd.DataFrame) -> float:
    """
    Calculate EBIT margin from income statement
    
    Args:
        income_stmt: Income statement DataFrame
        
    Returns:
        float: EBIT margin as a decimal
    """
    try:
        ebit = income_stmt['EBIT'].iloc[-1]
        revenue = income_stmt['Total Revenue'].iloc[-1]
        
        if revenue <= 0:
            raise ValueError("Revenue must be positive")
            
        return ebit / revenue
        
    except KeyError as e:
        logger.error(f"Missing required column in income statement: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error calculating EBIT margin: {str(e)}")
        raise

def calculate_capex_ratio(cash_flow: pd.DataFrame, 
                         income_stmt: pd.DataFrame) -> float:
    """
    Calculate capital expenditure ratio
    
    Args:
        cash_flow: Cash flow statement DataFrame
        income_stmt: Income statement DataFrame
        
    Returns:
        float: Capex ratio as a decimal
    """
    try:
        capex = cash_flow['Capital Expenditure'].iloc[-1]
        revenue = income_stmt['Total Revenue'].iloc[-1]
        
        if revenue <= 0:
            raise ValueError("Revenue must be positive")
            
        return abs(capex) / revenue
        
    except KeyError as e:
        logger.error(f"Missing required column: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error calculating capex ratio: {str(e)}")
        raise

def calculate_working_capital_ratio(balance_sheet: pd.DataFrame, 
                                  income_stmt: pd.DataFrame) -> float:
    """
    Calculate working capital ratio
    
    Args:
        balance_sheet: Balance sheet DataFrame
        income_stmt: Income statement DataFrame
        
    Returns:
        float: Working capital ratio as a decimal
    """
    try:
        working_capital = balance_sheet['Working Capital'].iloc[-1]
        revenue = income_stmt['Total Revenue'].iloc[-1]
        
        if revenue <= 0:
            raise ValueError("Revenue must be positive")
            
        return working_capital / revenue
        
    except KeyError as e:
        logger.error(f"Missing required column: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error calculating working capital ratio: {str(e)}")
        raise

def clean_financial_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean financial data by handling missing values and outliers
    
    Args:
        df: Input DataFrame with financial data
        
    Returns:
        pd.DataFrame: Cleaned DataFrame
    """
    try:
        # Fill missing values with 0 for financial metrics
        df = df.fillna(0)
        
        # Remove outliers (values more than 3 standard deviations from mean)
        for col in df.columns:
            if df[col].dtype in ['float64', 'int64']:
                mean = df[col].mean()
                std = df[col].std()
                df[col] = df[col].clip(lower=mean - 3*std, upper=mean + 3*std)
        
        return df
        
    except Exception as e:
        logger.error(f"Error cleaning financial data: {str(e)}")
        raise

def validate_financial_data(df: pd.DataFrame, required_columns: List[str]) -> bool:
    """
    Validate that required columns exist in financial data
    
    Args:
        df: Input DataFrame
        required_columns: List of required column names
        
    Returns:
        bool: True if all required columns exist, False otherwise
    """
    try:
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            logger.error(f"Missing required columns: {missing}")
            return False
            
        return True
        
    except Exception as e:
        logger.error(f"Error validating financial data: {str(e)}")
        raise

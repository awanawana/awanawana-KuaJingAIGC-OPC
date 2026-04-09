// AI Tab Types
export type AITabType =
  | "product-selection"
  | "product-listing"
  | "keywords"
  | "sales-forecast"
  | "competitor-analysis"
  | "erp-sourcing"
  | "competitor-stores";

// Analysis Result - flexible type for mock data
export interface AnalysisResult {
  [key: string]: any;
}

// Keyword Data - flexible type for different platform data structures
export interface KeywordData {
  [key: string]: any;
}

// Sales Forecast
export interface ForecastResult {
  [key: string]: any;
}

// Historical Sales Record
export interface HistoricalSalesRecord {
  [key: string]: any;
}
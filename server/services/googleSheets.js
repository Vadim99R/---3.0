const { google } = require('googleapis');

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.init();
  }

  init() {
    try {
      // Initialize Google Sheets API with service account
      const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
      );

      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets API initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets API:', error.message);
      throw new Error('Google Sheets API initialization failed');
    }
  }

  /**
   * Get data from analytics sheet (1ИП tab)
   */
  async getAnalyticsData() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.ANALYTICS_SHEET_ID,
        range: '1ИП!A:AE', // Columns A to AE
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return { headers: [], data: [] };
      }

      const headers = rows[0];
      const data = rows.slice(1).map((row, index) => {
        const item = { rowIndex: index + 2 }; // +2 because we skip header and array is 0-indexed
        
        headers.forEach((header, colIndex) => {
          const value = row[colIndex] || '';
          
          // Map specific columns to meaningful names
          switch (colIndex) {
            case 1: // Column B - Barcode
              item.barcode = value;
              break;
            case 2: // Column C - Article
              item.article = value;
              break;
            case 3: // Column D - WB Stock
              item.wbStock = this.parseNumber(value);
              break;
            case 5: // Column F - Average daily orders
              item.avgDailyOrders = this.parseNumber(value);
              break;
            case 6: // Column G - Yesterday orders
              item.yesterdayOrders = this.parseNumber(value);
              break;
            case 8: // Column I - Ready boxes on our warehouse
              item.readyBoxes = this.parseNumber(value);
              break;
            case 9: // Column J - Unready stock on our warehouse
              item.unreadyStock = this.parseNumber(value);
              break;
            case 11: // Column L - Days supply
              item.daysSupply = this.parseNumber(value);
              break;
            case 16: // Column Q - Need to purchase
              item.needToPurchase = this.parseNumber(value);
              break;
            case 21: // Column V - Need to deliver (3 weeks)
              item.needToDeliver = this.parseNumber(value);
              break;
            case 25: // Column Z - Current week coefficient
              item.currentWeekCoeff = this.parseNumber(value) || 1;
              break;
            case 26: // Column AA - Next week coefficient
              item.nextWeekCoeff = this.parseNumber(value) || 1;
              break;
            case 27: // Column AB - Week 3 coefficient
              item.week3Coeff = this.parseNumber(value) || 1;
              break;
            case 28: // Column AC - Week 4 coefficient
              item.week4Coeff = this.parseNumber(value) || 1;
              break;
            case 29: // Column AD - Week 5 coefficient
              item.week5Coeff = this.parseNumber(value) || 1;
              break;
            case 30: // Column AE - Week 6 coefficient
              item.week6Coeff = this.parseNumber(value) || 1;
              break;
          }
          
          item[`col_${String.fromCharCode(65 + colIndex)}`] = value;
        });

        return item;
      });

      return { headers, data: data.filter(item => item.barcode || item.article) };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw new Error(`Failed to fetch analytics data: ${error.message}`);
    }
  }

  /**
   * Get warehouse distribution data
   */
  async getWarehouseDistribution() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.ANALYTICS_SHEET_ID,
        range: 'Распределение по складам!A:W',
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return { headers: [], data: [] };
      }

      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const item = {};
        
        headers.forEach((header, colIndex) => {
          const value = row[colIndex] || '';
          
          switch (colIndex) {
            case 0: // Column A - Barcode
              item.barcode = value;
              break;
            case 11: // Column L - Krasnodar + Nevinnomyssk
              item.krasnodarNevinnomyssk = this.parseNumber(value);
              break;
            case 12: // Column M - Ekaterinburg
              item.ekaterinburg = this.parseNumber(value);
              break;
            case 13: // Column N - Kotovsk
              item.kotovsk = this.parseNumber(value);
              break;
            case 14: // Column O - Samara
              item.samara = this.parseNumber(value);
              break;
            case 15: // Column P - Ryazan
              item.ryazan = this.parseNumber(value);
              break;
            case 17: // Column R - Krasnodar stock
              item.krasnodarStock = this.parseNumber(value);
              break;
            case 18: // Column S - Nevinnomyssk stock
              item.nevinnomysskStock = this.parseNumber(value);
              break;
            case 19: // Column T - Ekaterinburg stock
              item.ekaterinburgStock = this.parseNumber(value);
              break;
            case 20: // Column U - Kotovsk stock
              item.kotovskStock = this.parseNumber(value);
              break;
            case 21: // Column V - Samara stock
              item.samaraStock = this.parseNumber(value);
              break;
            case 22: // Column W - Ryazan stock
              item.ryazanStock = this.parseNumber(value);
              break;
          }
          
          item[`col_${String.fromCharCode(65 + colIndex)}`] = value;
        });

        return item;
      });

      return { headers, data: data.filter(item => item.barcode) };
    } catch (error) {
      console.error('Error fetching warehouse distribution data:', error);
      throw new Error(`Failed to fetch warehouse distribution data: ${error.message}`);
    }
  }

  /**
   * Get packed goods data
   */
  async getPackedGoodsData() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.PACKAGING_SHEET_ID,
        range: 'Упакованный товар!A:BD',
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return { headers: [], data: [] };
      }

      const headers = rows[0];
      const data = [];
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const item = { rowIndex: i + 1 };
        
        // Column E - Article
        item.article = row[4] || '';
        
        if (!item.article) continue;
        
        // Individual boxes (columns M to AJ)
        item.individualBoxes = [];
        for (let col = 12; col <= 35; col++) { // M = 12, AJ = 35
          const value = row[col];
          if (value && !isNaN(value) && parseInt(value) > 0) {
            item.individualBoxes.push({
              column: String.fromCharCode(65 + col),
              quantity: parseInt(value),
              hasKiz: this.checkIfGreenCell(i + 1, col + 1) // Check if cell is green
            });
          }
        }
        
        // Mix boxes (columns AN to BD)
        item.mixBoxes = [];
        for (let col = 39; col <= 55; col++) { // AN = 39, BD = 55
          const value = row[col];
          if (value && !isNaN(value) && parseInt(value) > 0) {
            item.mixBoxes.push({
              column: String.fromCharCode(65 + col),
              quantity: parseInt(value),
              hasKiz: this.checkIfGreenCell(i + 1, col + 1)
            });
          }
        }
        
        data.push(item);
      }

      return { headers, data };
    } catch (error) {
      console.error('Error fetching packed goods data:', error);
      throw new Error(`Failed to fetch packed goods data: ${error.message}`);
    }
  }

  /**
   * Check if a cell is green (has KIZ applied)
   * This is a placeholder - in real implementation, you'd need to check cell formatting
   */
  checkIfGreenCell(row, col) {
    // For now, we'll assume some boxes have KIZ and some don't
    // In a real implementation, you'd use the spreadsheets.get method to check formatting
    return Math.random() > 0.3; // 70% chance of having KIZ
  }

  /**
   * Parse number from string, handling Russian number format
   */
  parseNumber(value) {
    if (!value || value === '') return 0;
    
    // Handle Russian number format (comma as decimal separator)
    const cleanValue = String(value)
      .replace(/\s+/g, '') // Remove spaces
      .replace(',', '.'); // Replace comma with dot
    
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Get combined analytics data with warehouse distribution
   */
  async getCombinedAnalyticsData() {
    try {
      const [analyticsResult, warehouseResult] = await Promise.all([
        this.getAnalyticsData(),
        this.getWarehouseDistribution()
      ]);

      // Combine data by barcode
      const warehouseMap = new Map();
      warehouseResult.data.forEach(item => {
        warehouseMap.set(item.barcode, item);
      });

      const combinedData = analyticsResult.data.map(item => {
        const warehouseData = warehouseMap.get(item.barcode) || {};
        return {
          ...item,
          warehouse: warehouseData
        };
      });

      return {
        analytics: analyticsResult,
        warehouse: warehouseResult,
        combined: combinedData
      };
    } catch (error) {
      console.error('Error getting combined analytics data:', error);
      throw error;
    }
  }
}

module.exports = new GoogleSheetsService();
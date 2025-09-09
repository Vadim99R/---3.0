const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheets');

/**
 * GET /api/analytics/data
 * Get analytics data from Google Sheets
 */
router.get('/data', async (req, res) => {
  try {
    const data = await googleSheetsService.getCombinedAnalyticsData();
    
    res.json({
      success: true,
      data: data.combined,
      metadata: {
        analyticsRows: data.analytics.data.length,
        warehouseRows: data.warehouse.data.length,
        combinedRows: data.combined.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in /api/analytics/data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/warehouse-distribution
 * Get warehouse distribution data
 */
router.get('/warehouse-distribution', async (req, res) => {
  try {
    const data = await googleSheetsService.getWarehouseDistribution();
    
    res.json({
      success: true,
      data: data.data,
      headers: data.headers,
      metadata: {
        rows: data.data.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in /api/analytics/warehouse-distribution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/summary
 * Get analytics summary and statistics
 */
router.get('/summary', async (req, res) => {
  try {
    const data = await googleSheetsService.getCombinedAnalyticsData();
    
    // Calculate summary statistics
    const summary = {
      totalProducts: data.combined.length,
      criticalProducts: data.combined.filter(item => item.daysSupply > 0 && item.daysSupply < 7).length,
      lowStockProducts: data.combined.filter(item => item.daysSupply >= 7 && item.daysSupply < 14).length,
      adequateStockProducts: data.combined.filter(item => item.daysSupply >= 14).length,
      totalNeedToPurchase: data.combined.reduce((sum, item) => sum + (item.needToPurchase || 0), 0),
      totalNeedToDeliver: data.combined.reduce((sum, item) => sum + (item.needToDeliver || 0), 0),
      totalAvgDailyOrders: data.combined.reduce((sum, item) => sum + (item.avgDailyOrders || 0), 0),
      warehouseDistribution: {
        krasnodar: data.combined.reduce((sum, item) => sum + (item.warehouse?.krasnodarNevinnomyssk || 0), 0),
        ekaterinburg: data.combined.reduce((sum, item) => sum + (item.warehouse?.ekaterinburg || 0), 0),
        kotovsk: data.combined.reduce((sum, item) => sum + (item.warehouse?.kotovsk || 0), 0),
        samara: data.combined.reduce((sum, item) => sum + (item.warehouse?.samara || 0), 0),
        ryazan: data.combined.reduce((sum, item) => sum + (item.warehouse?.ryazan || 0), 0)
      }
    };
    
    res.json({
      success: true,
      summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/analytics/summary:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/critical-products
 * Get products that need immediate attention (less than 7 days supply)
 */
router.get('/critical-products', async (req, res) => {
  try {
    const data = await googleSheetsService.getCombinedAnalyticsData();
    
    const criticalProducts = data.combined
      .filter(item => item.daysSupply > 0 && item.daysSupply < 7)
      .sort((a, b) => a.daysSupply - b.daysSupply);
    
    res.json({
      success: true,
      data: criticalProducts,
      count: criticalProducts.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/analytics/critical-products:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheets');

/**
 * GET /api/packaging/packed-goods
 * Get packed goods data from Google Sheets
 */
router.get('/packed-goods', async (req, res) => {
  try {
    const data = await googleSheetsService.getPackedGoodsData();
    
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
    console.error('Error in /api/packaging/packed-goods:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/packaging/preparation-list
 * Get list of products that need preparation based on priority filter
 */
router.get('/preparation-list', async (req, res) => {
  try {
    const { priority = '7' } = req.query; // Default to 7 days
    const priorityDays = parseInt(priority);
    
    // Get analytics data to determine what needs preparation
    const analyticsData = await googleSheetsService.getCombinedAnalyticsData();
    const packedGoodsData = await googleSheetsService.getPackedGoodsData();
    
    // Create a map of packed goods by article
    const packedGoodsMap = new Map();
    packedGoodsData.data.forEach(item => {
      if (item.article) {
        packedGoodsMap.set(item.article, item);
      }
    });
    
    // Filter products based on priority and calculate preparation needs
    const preparationList = analyticsData.combined
      .filter(item => {
        if (!item.daysSupply || item.daysSupply <= 0) return false;
        
        switch (priorityDays) {
          case 7:
            return item.daysSupply < 7;
          case 14:
            return item.daysSupply < 14;
          case 30:
            return item.daysSupply < 30;
          default:
            return item.daysSupply < priorityDays;
        }
      })
      .map(item => {
        const packedGoods = packedGoodsMap.get(item.article) || { individualBoxes: [], mixBoxes: [] };
        
        // Calculate total packed quantity
        const totalPackedIndividual = packedGoods.individualBoxes
          .filter(box => box.hasKiz)
          .reduce((sum, box) => sum + box.quantity, 0);
          
        const totalPackedMix = packedGoods.mixBoxes
          .filter(box => box.hasKiz)
          .reduce((sum, box) => sum + box.quantity, 0);
          
        const totalPacked = totalPackedIndividual + totalPackedMix;
        
        // Calculate what needs to be prepared
        const targetDaysStock = Math.min(priorityDays, 21); // Maximum 21 days
        const targetQuantity = Math.ceil((item.avgDailyOrders || 0) * targetDaysStock);
        const currentAvailable = (item.wbStock || 0) + (item.readyBoxes || 0) + totalPacked;
        
        const needToPack = Math.max(0, targetQuantity - currentAvailable);
        const needToApplyKiz = packedGoods.individualBoxes
          .filter(box => !box.hasKiz)
          .reduce((sum, box) => sum + box.quantity, 0) +
          packedGoods.mixBoxes
          .filter(box => !box.hasKiz)
          .reduce((sum, box) => sum + box.quantity, 0);
        
        return {
          ...item,
          packedGoods,
          totalPacked,
          targetQuantity,
          currentAvailable,
          needToPack,
          needToApplyKiz,
          priority: item.daysSupply < 7 ? 'critical' : item.daysSupply < 14 ? 'high' : 'medium',
          daysUntilStockout: Math.floor(currentAvailable / (item.avgDailyOrders || 1))
        };
      })
      .sort((a, b) => {
        // Sort by priority: critical first, then by days supply
        if (a.priority === 'critical' && b.priority !== 'critical') return -1;
        if (b.priority === 'critical' && a.priority !== 'critical') return 1;
        return a.daysSupply - b.daysSupply;
      });
    
    res.json({
      success: true,
      data: preparationList,
      filter: {
        priorityDays,
        totalItems: preparationList.length
      },
      summary: {
        critical: preparationList.filter(item => item.priority === 'critical').length,
        high: preparationList.filter(item => item.priority === 'high').length,
        medium: preparationList.filter(item => item.priority === 'medium').length,
        totalNeedToPack: preparationList.reduce((sum, item) => sum + item.needToPack, 0),
        totalNeedKiz: preparationList.reduce((sum, item) => sum + item.needToApplyKiz, 0)
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/packaging/preparation-list:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/packaging/summary
 * Get packaging summary statistics
 */
router.get('/summary', async (req, res) => {
  try {
    const packedGoodsData = await googleSheetsService.getPackedGoodsData();
    
    let totalBoxes = 0;
    let boxesWithKiz = 0;
    let boxesNeedKiz = 0;
    let totalQuantity = 0;
    
    packedGoodsData.data.forEach(item => {
      // Count individual boxes
      item.individualBoxes.forEach(box => {
        totalBoxes++;
        totalQuantity += box.quantity;
        if (box.hasKiz) {
          boxesWithKiz++;
        } else {
          boxesNeedKiz++;
        }
      });
      
      // Count mix boxes
      item.mixBoxes.forEach(box => {
        totalBoxes++;
        totalQuantity += box.quantity;
        if (box.hasKiz) {
          boxesWithKiz++;
        } else {
          boxesNeedKiz++;
        }
      });
    });
    
    const summary = {
      totalArticles: packedGoodsData.data.length,
      totalBoxes,
      boxesWithKiz,
      boxesNeedKiz,
      totalQuantity,
      kizCompletionRate: totalBoxes > 0 ? Math.round((boxesWithKiz / totalBoxes) * 100) : 0
    };
    
    res.json({
      success: true,
      summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/packaging/summary:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
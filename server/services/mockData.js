/**
 * Mock data service to demonstrate the supply planning system
 * without requiring Google Sheets API configuration
 */

class MockDataService {
  constructor() {
    this.mockAnalyticsData = this.generateMockAnalyticsData();
    this.mockPackedGoods = this.generateMockPackedGoods();
  }

  /**
   * Generate mock analytics data similar to Google Sheets structure
   */
  generateMockAnalyticsData() {
    const mockProducts = [
      {
        rowIndex: 2,
        barcode: '2037505086971',
        article: 'BB-R-9965 (140-152)',
        wbStock: 45,
        avgDailyOrders: 12,
        yesterdayOrders: 15,
        readyBoxes: 80,
        unreadyStock: 120,
        daysSupply: 5.2,
        needToPurchase: 350,
        needToDeliver: 180,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.1,
        week3Coeff: 1.0,
        week4Coeff: 0.9,
        week5Coeff: 1.1,
        week6Coeff: 1.0,
      },
      {
        rowIndex: 3,
        barcode: '2041130612471',
        article: 'BB-D-1black (12-13)',
        wbStock: 180,
        avgDailyOrders: 25,
        yesterdayOrders: 28,
        readyBoxes: 150,
        unreadyStock: 200,
        daysSupply: 13.2,
        needToPurchase: 400,
        needToDeliver: 250,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.2,
        week3Coeff: 1.1,
        week4Coeff: 1.0,
        week5Coeff: 0.9,
        week6Coeff: 1.0,
      },
      {
        rowIndex: 4,
        barcode: '2041372334247',
        article: 'BB-D-3gray (9-10)',
        wbStock: 95,
        avgDailyOrders: 18,
        yesterdayOrders: 22,
        readyBoxes: 75,
        unreadyStock: 145,
        daysSupply: 8.8,
        needToPurchase: 320,
        needToDeliver: 160,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.0,
        week3Coeff: 1.1,
        week4Coeff: 1.2,
        week5Coeff: 1.0,
        week6Coeff: 0.9,
      },
      {
        rowIndex: 5,
        barcode: '2041372334261',
        article: 'BB-R-8810 (86-92)',
        wbStock: 32,
        avgDailyOrders: 8,
        yesterdayOrders: 6,
        readyBoxes: 40,
        unreadyStock: 85,
        daysSupply: 19.5,
        needToPurchase: 180,
        needToDeliver: 95,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 0.9,
        week3Coeff: 1.0,
        week4Coeff: 1.1,
        week5Coeff: 1.0,
        week6Coeff: 1.0,
      },
      {
        rowIndex: 6,
        barcode: '2041372334278',
        article: 'BB-R-8978 (104-116)',
        wbStock: 15,
        avgDailyOrders: 22,
        yesterdayOrders: 25,
        readyBoxes: 25,
        unreadyStock: 180,
        daysSupply: 1.7,
        needToPurchase: 550,
        needToDeliver: 300,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.3,
        week3Coeff: 1.2,
        week4Coeff: 1.1,
        week5Coeff: 1.0,
        week6Coeff: 0.9,
      },
      {
        rowIndex: 7,
        barcode: '2041372334285',
        article: 'BB-R-8990 (104-116)',
        wbStock: 68,
        avgDailyOrders: 15,
        yesterdayOrders: 18,
        readyBoxes: 90,
        unreadyStock: 120,
        daysSupply: 17.3,
        needToPurchase: 280,
        needToDeliver: 140,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.0,
        week3Coeff: 0.9,
        week4Coeff: 1.0,
        week5Coeff: 1.1,
        week6Coeff: 1.0,
      },
      {
        rowIndex: 8,
        barcode: '2041956260606',
        article: 'BB-D-1black (7-8)',
        wbStock: 125,
        avgDailyOrders: 30,
        yesterdayOrders: 35,
        readyBoxes: 200,
        unreadyStock: 250,
        daysSupply: 12.5,
        needToPurchase: 450,
        needToDeliver: 280,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.1,
        week3Coeff: 1.2,
        week4Coeff: 1.0,
        week5Coeff: 0.9,
        week6Coeff: 1.0,
      },
      // Add more critical products
      {
        rowIndex: 9,
        barcode: '2042145789632',
        article: 'BB-R-3180 (116-128)',
        wbStock: 8,
        avgDailyOrders: 35,
        yesterdayOrders: 42,
        readyBoxes: 15,
        unreadyStock: 250,
        daysSupply: 0.8,
        needToPurchase: 700,
        needToDeliver: 450,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 1.4,
        week3Coeff: 1.3,
        week4Coeff: 1.2,
        week5Coeff: 1.1,
        week6Coeff: 1.0,
      },
      {
        rowIndex: 10,
        barcode: '2042567891234',
        article: 'BB-D-3mix-3 (7-8)',
        wbStock: 220,
        avgDailyOrders: 8,
        yesterdayOrders: 12,
        readyBoxes: 180,
        unreadyStock: 90,
        daysSupply: 61.2,
        needToPurchase: 150,
        needToDeliver: 60,
        currentWeekCoeff: 1.0,
        nextWeekCoeff: 0.8,
        week3Coeff: 0.9,
        week4Coeff: 1.0,
        week5Coeff: 1.0,
        week6Coeff: 1.1,
      }
    ];

    return mockProducts;
  }

  /**
   * Generate mock warehouse distribution data
   */
  generateMockWarehouseDistribution() {
    return this.mockAnalyticsData.map(product => ({
      barcode: product.barcode,
      krasnodarNevinnomyssk: Math.floor(Math.random() * 100) + 20,
      ekaterinburg: Math.floor(Math.random() * 80) + 15,
      kotovsk: Math.floor(Math.random() * 120) + 30,
      samara: Math.floor(Math.random() * 90) + 25,
      ryazan: Math.floor(Math.random() * 50) + 10,
      krasnodarStock: Math.floor(Math.random() * 200) + 50,
      nevinnomysskStock: Math.floor(Math.random() * 180) + 40,
      ekaterinburgStock: Math.floor(Math.random() * 150) + 30,
      kotovskStock: Math.floor(Math.random() * 220) + 60,
      samaraStock: Math.floor(Math.random() * 170) + 45,
      ryazanStock: Math.floor(Math.random() * 100) + 20,
    }));
  }

  /**
   * Generate mock packed goods data
   */
  generateMockPackedGoods() {
    return this.mockAnalyticsData.map((product, index) => ({
      rowIndex: index + 1,
      article: product.article,
      individualBoxes: this.generateRandomBoxes(2, 8),
      mixBoxes: this.generateRandomBoxes(1, 4),
    }));
  }

  /**
   * Generate random boxes for packed goods
   */
  generateRandomBoxes(minCount, maxCount) {
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const boxes = [];
    
    for (let i = 0; i < count; i++) {
      boxes.push({
        column: String.fromCharCode(77 + i), // M, N, O, etc.
        quantity: Math.floor(Math.random() * 30) + 10,
        hasKiz: Math.random() > 0.3 // 70% chance of having KIZ
      });
    }
    
    return boxes;
  }

  /**
   * Get analytics data (mock version)
   */
  async getAnalyticsData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      headers: ['Barcode', 'Article', 'WB Stock', 'Avg Daily Orders', 'etc.'],
      data: this.mockAnalyticsData
    };
  }

  /**
   * Get warehouse distribution data (mock version)
   */
  async getWarehouseDistribution() {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const warehouseData = this.generateMockWarehouseDistribution();
    
    return {
      headers: ['Barcode', 'Krasnodar+Nevinnomyssk', 'Ekaterinburg', 'etc.'],
      data: warehouseData
    };
  }

  /**
   * Get packed goods data (mock version)
   */
  async getPackedGoodsData() {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      headers: ['Article', 'Individual Boxes', 'Mix Boxes'],
      data: this.mockPackedGoods
    };
  }

  /**
   * Get combined analytics data with warehouse distribution (mock version)
   */
  async getCombinedAnalyticsData() {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const analyticsResult = await this.getAnalyticsData();
    const warehouseResult = await this.getWarehouseDistribution();

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
  }
}

module.exports = new MockDataService();
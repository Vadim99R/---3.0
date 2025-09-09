const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheets');
const SupplyPlanningService = require('../services/supplyPlanning');

/**
 * POST /api/supply/generate-auto-supply
 * Generate automatic supply plan based on parameters
 */
router.post('/generate-auto-supply', async (req, res) => {
  try {
    const {
      limitPerSupply = 5500,
      priorityDays = 14,
      suppliesPerWeek = 4,
      priorityWarehouse = 'kotovsk'
    } = req.body;

    const supplyPlan = await SupplyPlanningService.generateAutoSupply({
      limitPerSupply,
      priorityDays,
      suppliesPerWeek,
      priorityWarehouse
    });

    res.json({
      success: true,
      data: supplyPlan,
      parameters: {
        limitPerSupply,
        priorityDays,
        suppliesPerWeek,
        priorityWarehouse
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/supply/generate-auto-supply:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/supply/formed-supplies
 * Get list of formed supplies
 */
router.get('/formed-supplies', async (req, res) => {
  try {
    // This would typically come from a database
    // For now, we'll return mock data based on the images
    const formedSupplies = [
      {
        id: 1,
        name: 'Поставка #1',
        plannedDate: '10.09.2025',
        warehouse: 'Рязань',
        totalQuantity: 668,
        totalPositions: 7,
        status: 'formed',
        distribution: {
          'Рязань': { quantity: 668, percentage: 100 }
        },
        priority: 'critical',
        statusText: 'Ультра-критичных: 🔥: 668',
        details: 'Готовы к отправке: 276 шт • ⚠️ Требует КИЗ: 198 шт • ✅ Статус неизвестен: 204 шт'
      },
      {
        id: 2,
        name: 'Поставка #2',
        plannedDate: '11.09.2025',
        warehouse: 'Котовск + Краснодар + Невинномысск',
        totalQuantity: 5449,
        totalPositions: 108,
        status: 'formed',
        distribution: {
          'Котовск': { quantity: 3255, percentage: 59.7 },
          'Краснодар + Невинномысск': { quantity: 2194, percentage: 40.3 }
        },
        priority: 'high',
        statusText: 'Критичных: 1874 • Срочных: 3575',
        details: 'Готовы к отправке: 1588 шт • ⚠️ Требует КИЗ: 1723 шт • ✅ Статус неизвестен: 2138 шт'
      },
      {
        id: 3,
        name: 'Поставка #3',
        plannedDate: '12.09.2025',
        warehouse: 'Краснодар + Невинномысск',
        totalQuantity: 5402,
        totalPositions: 110,
        status: 'planning',
        distribution: {
          'Краснодар + Невинномысск': { quantity: 3237, percentage: 59.9 },
          'Other': { quantity: 2165, percentage: 40.1 }
        },
        priority: 'medium',
        statusText: 'Планируется',
        details: 'В процессе формирования'
      }
    ];

    res.json({
      success: true,
      data: formedSupplies,
      count: formedSupplies.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/supply/formed-supplies:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/supply/supply-details/:id
 * Get detailed information about a specific supply
 */
router.get('/supply-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock detailed supply data
    const supplyDetails = {
      id: parseInt(id),
      generalInfo: {
        totalQuantity: id === '2' ? 5449 : 668,
        totalPositions: id === '2' ? 108 : 7,
        warehouses: id === '2' ? 2 : 1
      },
      items: [
        {
          barcode: '2037505086971',
          quantity: 20,
          article: 'BB-R-9965 (140-152)',
          warehouse: id === '2' ? 'Котовск' : 'Рязань',
          position: 'M51',
          kizStatus: 'unknown',
          priority: 'critical'
        },
        {
          barcode: '2041130612471',
          quantity: 16,
          article: 'bb-r-3180 (116-128)',
          warehouse: id === '2' ? 'Краснодар + Невинномысск' : 'Рязань',
          position: 'N77',
          kizStatus: 'needed',
          priority: 'critical'
        },
        {
          barcode: '2041130612471',
          quantity: 16,
          article: 'bb-r-3180 (116-128)',
          warehouse: id === '2' ? 'Котовск' : 'Рязань',
          position: 'N77',
          kizStatus: 'unknown',
          priority: 'critical'
        },
        {
          barcode: '2041372334247',
          quantity: 16,
          article: 'BB-R-9925 (116-128)',
          warehouse: id === '2' ? 'Краснодар + Невинномысск' : 'Рязань',
          position: 'N241',
          kizStatus: 'ready',
          priority: 'critical'
        },
        {
          barcode: '2041372334261',
          quantity: 22,
          article: 'BB-R-9925 (98-104)',
          warehouse: id === '2' ? 'Котовск' : 'Рязань',
          position: 'N243',
          kizStatus: 'unknown',
          priority: 'critical'
        }
      ]
    };

    res.json({
      success: true,
      data: supplyDetails,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/supply/supply-details:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/supply/warehouse-capacities
 * Get warehouse delivery capacities and timing
 */
router.get('/warehouse-capacities', async (req, res) => {
  try {
    const warehouses = [
      {
        name: 'Котовск',
        code: 'kotovsk',
        deliveryTime: 3,
        percentage: 40,
        priority: 1,
        description: 'Самая быстрая приемка, приоритетный для срочных поставок'
      },
      {
        name: 'Самара (Новосемейкино)',
        code: 'samara',
        deliveryTime: 4,
        percentage: 25,
        priority: 2,
        description: 'Средняя скорость приемки'
      },
      {
        name: 'Краснодар + Невинномысск',
        code: 'krasnodar_nevinnomyssk',
        deliveryTime: 7,
        percentage: 20,
        priority: 3,
        description: 'Совместная поставка на два склада'
      },
      {
        name: 'Екатеринбург - Перспективный 12',
        code: 'ekaterinburg',
        deliveryTime: 7,
        percentage: 15,
        priority: 4,
        description: 'Стандартная приемка'
      },
      {
        name: 'Рязань (Тюшевское)',
        code: 'ryazan',
        deliveryTime: 1,
        percentage: 0,
        priority: 0,
        description: 'Экстренный склад, только для критических случаев (менее 4 дней остатка)'
      }
    ];

    const deliveryConstraints = [
      {
        group: 1,
        warehouses: ['kotovsk', 'krasnodar_nevinnomyssk'],
        description: 'Могут быть отправлены в один день'
      },
      {
        group: 2,
        warehouses: ['samara', 'ekaterinburg'],
        description: 'Могут быть отправлены в один день'
      },
      {
        group: 3,
        warehouses: ['ryazan'],
        description: 'Экстренные поставки, отдельно'
      }
    ];

    res.json({
      success: true,
      data: {
        warehouses,
        deliveryConstraints
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/supply/warehouse-capacities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
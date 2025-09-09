const googleSheetsService = require('./googleSheets');

class SupplyPlanningService {
  constructor() {
    this.warehouseConfig = {
      kotovsk: { deliveryTime: 3, percentage: 40, priority: 1 },
      samara: { deliveryTime: 4, percentage: 25, priority: 2 },
      krasnodar_nevinnomyssk: { deliveryTime: 7, percentage: 20, priority: 3 },
      ekaterinburg: { deliveryTime: 7, percentage: 15, priority: 4 },
      ryazan: { deliveryTime: 1, percentage: 0, priority: 0 } // Emergency only
    };
  }

  /**
   * Generate automatic supply plan
   */
  async generateAutoSupply(params) {
    try {
      const {
        limitPerSupply = 5500,
        priorityDays = 14,
        suppliesPerWeek = 4,
        priorityWarehouse = 'kotovsk'
      } = params;

      // Get combined analytics data
      const analyticsData = await googleSheetsService.getCombinedAnalyticsData();
      const packedGoodsData = await googleSheetsService.getPackedGoodsData();

      // Create packed goods map for quick lookup
      const packedGoodsMap = new Map();
      packedGoodsData.data.forEach(item => {
        if (item.article) {
          packedGoodsMap.set(item.article, item);
        }
      });

      // Filter products that need supply
      const productsNeedingSupply = analyticsData.combined
        .filter(item => this.needsSupply(item, priorityDays))
        .map(item => this.enrichProductData(item, packedGoodsMap))
        .sort((a, b) => this.getPriorityScore(a) - this.getPriorityScore(b));

      // Generate supply plans
      const supplies = this.createSupplyPlans(
        productsNeedingSupply,
        limitPerSupply,
        suppliesPerWeek,
        priorityWarehouse
      );

      return {
        supplies,
        summary: {
          totalSupplies: supplies.length,
          totalProducts: productsNeedingSupply.length,
          totalQuantity: supplies.reduce((sum, supply) => sum + supply.totalQuantity, 0),
          criticalProducts: productsNeedingSupply.filter(p => p.daysSupply < 7).length,
          urgentProducts: productsNeedingSupply.filter(p => p.daysSupply >= 7 && p.daysSupply < 14).length
        },
        parameters: params
      };
    } catch (error) {
      console.error('Error generating auto supply:', error);
      throw error;
    }
  }

  /**
   * Check if product needs supply
   */
  needsSupply(item, priorityDays) {
    if (!item.daysSupply || item.daysSupply <= 0) return false;
    return item.daysSupply < priorityDays;
  }

  /**
   * Enrich product data with packed goods information
   */
  enrichProductData(item, packedGoodsMap) {
    const packedGoods = packedGoodsMap.get(item.article) || { individualBoxes: [], mixBoxes: [] };
    
    // Get available boxes with KIZ
    const availableBoxes = [
      ...packedGoods.individualBoxes.filter(box => box.hasKiz),
      ...packedGoods.mixBoxes.filter(box => box.hasKiz)
    ];

    const availableQuantity = availableBoxes.reduce((sum, box) => sum + box.quantity, 0);
    
    // Calculate priority based on days supply and availability
    let priority = 'medium';
    if (item.daysSupply < 4) {
      priority = 'emergency'; // Need Ryazan delivery
    } else if (item.daysSupply < 7) {
      priority = 'critical';
    } else if (item.daysSupply < 14) {
      priority = 'high';
    }

    return {
      ...item,
      packedGoods,
      availableBoxes,
      availableQuantity,
      priority,
      needsEmergencyDelivery: item.daysSupply < 4
    };
  }

  /**
   * Calculate priority score for sorting (lower = higher priority)
   */
  getPriorityScore(item) {
    const priorityWeights = {
      emergency: 1,
      critical: 2,
      high: 3,
      medium: 4
    };
    
    const baseScore = priorityWeights[item.priority] || 5;
    const daysSupplyScore = item.daysSupply / 100; // Fine-grained sorting within priority
    
    return baseScore + daysSupplyScore;
  }

  /**
   * Create supply plans based on products and constraints
   */
  createSupplyPlans(products, limitPerSupply, suppliesPerWeek, priorityWarehouse) {
    const supplies = [];
    let currentSupply = null;
    let supplyCounter = 1;

    // Group products by urgency and warehouse preference
    const emergencyProducts = products.filter(p => p.needsEmergencyDelivery);
    const regularProducts = products.filter(p => !p.needsEmergencyDelivery);

    // Handle emergency products first (to Ryazan)
    if (emergencyProducts.length > 0) {
      const emergencySupply = this.createEmergencySupply(emergencyProducts, supplyCounter++);
      if (emergencySupply) {
        supplies.push(emergencySupply);
      }
    }

    // Handle regular products
    for (const product of regularProducts) {
      if (!currentSupply || this.shouldStartNewSupply(currentSupply, product, limitPerSupply)) {
        if (currentSupply) {
          supplies.push(this.finalizeSupply(currentSupply));
        }
        currentSupply = this.createNewSupply(supplyCounter++, product);
      }

      this.addProductToSupply(currentSupply, product);
    }

    // Finalize last supply
    if (currentSupply) {
      supplies.push(this.finalizeSupply(currentSupply));
    }

    return supplies;
  }

  /**
   * Create emergency supply for critical products (< 4 days)
   */
  createEmergencySupply(products, supplyId) {
    if (products.length === 0) return null;

    const supply = {
      id: supplyId,
      name: `Поставка #${supplyId}`,
      type: 'emergency',
      plannedDate: this.getPlannedDate(1), // Tomorrow
      warehouse: 'Рязань',
      items: [],
      totalQuantity: 0,
      totalPositions: 0,
      priority: 'emergency',
      status: 'formed'
    };

    products.forEach(product => {
      this.addProductToSupply(supply, product, 'ryazan');
    });

    return this.finalizeSupply(supply);
  }

  /**
   * Check if should start new supply
   */
  shouldStartNewSupply(currentSupply, product, limitPerSupply) {
    if (currentSupply.totalQuantity >= limitPerSupply) return true;
    
    // Check warehouse compatibility
    const productWarehouse = this.getOptimalWarehouse(product);
    const currentWarehouse = currentSupply.warehouse;
    
    if (currentWarehouse && !this.areWarehousesCompatible(currentWarehouse, productWarehouse)) {
      return true;
    }

    return false;
  }

  /**
   * Create new supply
   */
  createNewSupply(supplyId, firstProduct) {
    const warehouse = this.getOptimalWarehouse(firstProduct);
    
    return {
      id: supplyId,
      name: `Поставка #${supplyId}`,
      type: 'regular',
      plannedDate: this.getPlannedDate(supplyId),
      warehouse: this.getWarehouseName(warehouse),
      warehouseCode: warehouse,
      items: [],
      totalQuantity: 0,
      totalPositions: 0,
      priority: firstProduct.priority,
      status: supplyId <= 2 ? 'formed' : 'planning'
    };
  }

  /**
   * Add product to supply
   */
  addProductToSupply(supply, product, forceWarehouse = null) {
    const warehouse = forceWarehouse || this.getOptimalWarehouse(product);
    
    product.availableBoxes.forEach(box => {
      supply.items.push({
        barcode: product.barcode,
        article: product.article,
        quantity: box.quantity,
        warehouse: this.getWarehouseName(warehouse),
        warehouseCode: warehouse,
        position: box.column,
        kizStatus: box.hasKiz ? 'ready' : 'needed',
        priority: product.priority,
        daysSupply: product.daysSupply
      });
      
      supply.totalQuantity += box.quantity;
    });
    
    if (product.availableBoxes.length > 0) {
      supply.totalPositions++;
    }
  }

  /**
   * Finalize supply with distribution calculation
   */
  finalizeSupply(supply) {
    // Calculate warehouse distribution
    const distribution = {};
    supply.items.forEach(item => {
      if (!distribution[item.warehouse]) {
        distribution[item.warehouse] = { quantity: 0, percentage: 0 };
      }
      distribution[item.warehouse].quantity += item.quantity;
    });

    // Calculate percentages
    Object.keys(distribution).forEach(warehouse => {
      distribution[warehouse].percentage = Math.round(
        (distribution[warehouse].quantity / supply.totalQuantity) * 100 * 10
      ) / 10;
    });

    supply.distribution = distribution;

    // Generate status text
    supply.statusText = this.generateStatusText(supply);
    supply.details = this.generateDetailsText(supply);

    return supply;
  }

  /**
   * Get optimal warehouse for product
   */
  getOptimalWarehouse(product) {
    // Emergency case
    if (product.daysSupply < 4) {
      return 'ryazan';
    }

    // Check current warehouse stocks and determine best option
    const warehouse = product.warehouse || {};
    
    // If critical (< 7 days), prefer Kotovsk for fast delivery
    if (product.daysSupply < 7) {
      return 'kotovsk';
    }

    // For non-critical, use distribution logic based on current stocks
    const needToDeliver = product.needToDeliver || 0;
    
    if (needToDeliver > 0) {
      // Check which warehouse needs stock most
      const krasnodarNeed = warehouse.krasnodarNevinnomyssk || 0;
      const kotovskNeed = warehouse.kotovsk || 0;
      const samaraNeed = warehouse.samara || 0;
      const ekaterinburgNeed = warehouse.ekaterinburg || 0;

      if (kotovskNeed > 0) return 'kotovsk';
      if (krasnodarNeed > 0) return 'krasnodar_nevinnomyssk';
      if (samaraNeed > 0) return 'samara';
      if (ekaterinburgNeed > 0) return 'ekaterinburg';
    }

    // Default to Kotovsk
    return 'kotovsk';
  }

  /**
   * Check if warehouses are compatible for same delivery
   */
  areWarehousesCompatible(warehouse1, warehouse2) {
    const group1 = ['kotovsk', 'krasnodar_nevinnomyssk'];
    const group2 = ['samara', 'ekaterinburg'];
    const group3 = ['ryazan'];

    if (group1.includes(warehouse1) && group1.includes(warehouse2)) return true;
    if (group2.includes(warehouse1) && group2.includes(warehouse2)) return true;
    if (group3.includes(warehouse1) && group3.includes(warehouse2)) return true;

    return false;
  }

  /**
   * Get warehouse display name
   */
  getWarehouseName(warehouseCode) {
    const names = {
      kotovsk: 'Котовск',
      samara: 'Самара (Новосемейкино)',
      krasnodar_nevinnomyssk: 'Краснодар + Невинномысск',
      ekaterinburg: 'Екатеринбург - Перспективный 12',
      ryazan: 'Рязань (Тюшевское)'
    };
    return names[warehouseCode] || warehouseCode;
  }

  /**
   * Get planned delivery date
   */
  getPlannedDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('ru-RU');
  }

  /**
   * Generate status text for supply
   */
  generateStatusText(supply) {
    const critical = supply.items.filter(item => item.priority === 'critical').length;
    const high = supply.items.filter(item => item.priority === 'high').length;
    const emergency = supply.items.filter(item => item.priority === 'emergency').length;

    if (emergency > 0) {
      return `Экстренных: ${emergency}`;
    } else if (critical > 0 && high > 0) {
      return `Критичных: ${critical} • Срочных: ${high}`;
    } else if (critical > 0) {
      return `Ультра-критичных: 🔥: ${critical}`;
    } else if (high > 0) {
      return `Срочных: ${high}`;
    }
    
    return 'Планируется';
  }

  /**
   * Generate details text for supply
   */
  generateDetailsText(supply) {
    const ready = supply.items.filter(item => item.kizStatus === 'ready').reduce((sum, item) => sum + item.quantity, 0);
    const needKiz = supply.items.filter(item => item.kizStatus === 'needed').reduce((sum, item) => sum + item.quantity, 0);
    const unknown = supply.items.filter(item => item.kizStatus === 'unknown').reduce((sum, item) => sum + item.quantity, 0);

    const parts = [];
    if (ready > 0) parts.push(`Готовы к отправке: ${ready} шт`);
    if (needKiz > 0) parts.push(`⚠️ Требует КИЗ: ${needKiz} шт`);
    if (unknown > 0) parts.push(`✅ Статус неизвестен: ${unknown} шт`);

    return parts.join(' • ') || 'В процессе формирования';
  }
}

module.exports = new SupplyPlanningService();
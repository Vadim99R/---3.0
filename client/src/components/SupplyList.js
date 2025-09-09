import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  LocalShipping as ShippingIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const SupplyList = ({ supplies, onRefresh }) => {
  const [expandedSupply, setExpandedSupply] = useState(null);
  const [supplyDetails, setSupplyDetails] = useState({});

  const handleExpandClick = async (supplyId) => {
    if (expandedSupply === supplyId) {
      setExpandedSupply(null);
    } else {
      setExpandedSupply(supplyId);
      
      // Load supply details if not already loaded
      if (!supplyDetails[supplyId]) {
        try {
          // Mock detailed data for now
          const mockDetails = {
            generalInfo: {
              totalQuantity: supplies.find(s => s.id === supplyId)?.totalQuantity || 0,
              totalPositions: supplies.find(s => s.id === supplyId)?.totalPositions || 0,
              warehouses: Object.keys(supplies.find(s => s.id === supplyId)?.distribution || {}).length,
            },
            items: [
              {
                barcode: '2037505086971',
                quantity: 20,
                article: 'BB-R-9965 (140-152)',
                warehouse: 'Котовск',
                position: 'M51',
                kizStatus: 'unknown',
                priority: 'critical'
              },
              {
                barcode: '2041130612471',
                quantity: 16,
                article: 'bb-r-3180 (116-128)',
                warehouse: 'Краснодар + Невинномысск',
                position: 'N77',
                kizStatus: 'needed',
                priority: 'critical'
              },
            ]
          };
          
          setSupplyDetails(prev => ({
            ...prev,
            [supplyId]: mockDetails
          }));
        } catch (error) {
          console.error('Error loading supply details:', error);
        }
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'error';
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'Экстренно';
      case 'critical':
        return 'Критично';
      case 'high':
        return 'Срочно';
      case 'medium':
        return 'Средне';
      default:
        return 'Обычно';
    }
  };

  const getKizStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'needed':
        return 'warning';
      case 'unknown':
        return 'default';
      default:
        return 'default';
    }
  };

  const getKizStatusLabel = (status) => {
    switch (status) {
      case 'ready':
        return 'Готово';
      case 'needed':
        return 'Нужен КИЗ';
      case 'unknown':
        return 'Неизвестно';
      default:
        return 'Неизвестно';
    }
  };

  if (!supplies || supplies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <InventoryIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
          Нет сформированных поставок
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Используйте автоматическое формирование поставок выше
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {supplies.map((supply) => (
        <Card
          key={supply.id}
          variant="outlined"
          sx={{
            border: supply.priority === 'emergency' ? '2px solid #ef4444' :
                   supply.priority === 'critical' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }
          }}
        >
          <CardContent sx={{ pb: 2 }}>
            {/* Supply Header */}
            <Grid container spacing={2} alignItems="center">
              {/* Supply Name and Info */}
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ShippingIcon sx={{ color: '#4f46e5' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {supply.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ScheduleIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Планируемая дата: {supply.plannedDate}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Склад: {supply.warehouse}
                </Typography>
              </Grid>

              {/* Quantity and Stats */}
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                    {supply.totalQuantity}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    шт
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {supply.totalPositions} позиций
                  </Typography>
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={getPriorityLabel(supply.priority)}
                    color={getPriorityColor(supply.priority)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={supply.status === 'formed' ? 'Сформирована' : 'Планирование'}
                    color={supply.status === 'formed' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                  {supply.statusText}
                </Typography>
                
                {/* Distribution */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Object.entries(supply.distribution || {}).map(([warehouse, data]) => (
                    <Chip
                      key={warehouse}
                      label={`${warehouse}: ${data.quantity} (${data.percentage}%)`}
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Actions */}
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Подробности">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleExpandClick(supply.id)}
                      sx={{ textTransform: 'none' }}
                    >
                      Подробности
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Экспорт">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ExportIcon />}
                      color="success"
                      sx={{ textTransform: 'none' }}
                    >
                      Экспорт
                    </Button>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>

            {/* Status Details */}
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 2, fontSize: '0.875rem' }}>
              {supply.details}
            </Typography>

            {/* Expanded Details */}
            <Collapse in={expandedSupply === supply.id} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 2 }} />
              
              {supplyDetails[supply.id] && (
                <Box sx={{ mt: 2 }}>
                  {/* General Info */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Поставка #{supply.id} - Детали
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Общее количество</Typography>
                      <Typography variant="h6">{supplyDetails[supply.id].generalInfo.totalQuantity} шт</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Позиций</Typography>
                      <Typography variant="h6">{supplyDetails[supply.id].generalInfo.totalPositions}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Складов</Typography>
                      <Typography variant="h6">{supplyDetails[supply.id].generalInfo.warehouses}</Typography>
                    </Grid>
                  </Grid>

                  {/* Items Table */}
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Штрих-код</strong></TableCell>
                          <TableCell><strong>Количество</strong></TableCell>
                          <TableCell><strong>Артикул</strong></TableCell>
                          <TableCell><strong>Склад</strong></TableCell>
                          <TableCell><strong>Позиция</strong></TableCell>
                          <TableCell><strong>КИЗ</strong></TableCell>
                          <TableCell><strong>Приоритет</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplyDetails[supply.id].items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.barcode}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.article}</TableCell>
                            <TableCell>{item.warehouse}</TableCell>
                            <TableCell>{item.position}</TableCell>
                            <TableCell>
                              <Chip
                                label={getKizStatusLabel(item.kizStatus)}
                                color={getKizStatusColor(item.kizStatus)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getPriorityLabel(item.priority)}
                                color={getPriorityColor(item.priority)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SupplyList;
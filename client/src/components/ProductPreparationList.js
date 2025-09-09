import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Warning as CriticalIcon,
  Schedule as ScheduleIcon,
  CheckCircle as ReadyIcon,
  Build as PackIcon,
  QrCode as KizIcon,
} from '@mui/icons-material';

const ProductPreparationList = ({ products, onRefresh }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <CriticalIcon sx={{ color: '#ef4444' }} />;
      case 'high':
        return <ScheduleIcon sx={{ color: '#f59e0b' }} />;
      case 'medium':
        return <ReadyIcon sx={{ color: '#10b981' }} />;
      default:
        return <ScheduleIcon sx={{ color: '#6b7280' }} />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical':
        return 'КРИТИЧНО';
      case 'high':
        return 'СРОЧНО';
      case 'medium':
        return 'СРЕДНЕ';
      default:
        return 'ОБЫЧНО';
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num || 0);
  };

  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <PackIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
          Нет товаров для подготовки
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Все товары готовы или не требуют срочной подготовки
        </Typography>
      </Box>
    );
  }

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
              <TableCell sx={{ fontWeight: 600 }}>Артикул</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Штрих-код</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">На сколько хватит остатков</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Средние продажи в день</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Остаток на складе ВБ</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Готовые остатки на нашем складе</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Неготовые остатки на нашем складе</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Сколько нужно упаковать</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Сколько нужно закупить</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Статус КИЗ</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Приоритет</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow 
                key={`${product.barcode}-${index}`}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                  '&:hover': { backgroundColor: '#f3f4f6' },
                  borderLeft: product.priority === 'critical' ? '4px solid #ef4444' :
                            product.priority === 'high' ? '4px solid #f59e0b' : '4px solid transparent',
                }}
              >
                {/* Article */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {product.article}
                  </Typography>
                </TableCell>

                {/* Barcode */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {product.barcode}
                  </Typography>
                </TableCell>

                {/* Days Supply */}
                <TableCell align="center">
                  <Box sx={{ minWidth: 80 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: product.daysSupply < 7 ? '#ef4444' :
                              product.daysSupply < 14 ? '#f59e0b' : '#10b981'
                      }}
                    >
                      {formatNumber(product.daysSupply)} дн
                    </Typography>
                    {product.daysSupply < 14 && (
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((product.daysSupply / 14) * 100, 100)}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          backgroundColor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: product.daysSupply < 7 ? '#ef4444' : '#f59e0b',
                          },
                        }}
                      />
                    )}
                  </Box>
                </TableCell>

                {/* Average Daily Orders */}
                <TableCell align="center">
                  <Typography variant="body2">
                    {formatNumber(product.avgDailyOrders)}
                  </Typography>
                </TableCell>

                {/* WB Stock */}
                <TableCell align="center">
                  <Typography variant="body2">
                    {formatNumber(product.wbStock)}
                  </Typography>
                </TableCell>

                {/* Ready Boxes */}
                <TableCell align="center">
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 500 }}>
                    {formatNumber(product.readyBoxes)}
                  </Typography>
                </TableCell>

                {/* Unready Stock */}
                <TableCell align="center">
                  <Typography variant="body2" sx={{ color: '#d97706', fontWeight: 500 }}>
                    {formatNumber(product.unreadyStock)}
                  </Typography>
                </TableCell>

                {/* Need to Pack */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                      label={formatNumber(product.needToPack)}
                      color={product.needToPack > 0 ? 'warning' : 'success'}
                      size="small"
                      sx={{ fontWeight: 600, minWidth: 60 }}
                    />
                    {product.needToPack > 0 && (
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        упаковать
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* Need to Purchase */}
                <TableCell align="center">
                  <Typography variant="body2">
                    {formatNumber(product.needToPurchase)}
                  </Typography>
                </TableCell>

                {/* KIZ Status */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    {product.needToApplyKiz > 0 ? (
                      <>
                        <Chip
                          icon={<KizIcon />}
                          label="Нанести КИЗ"
                          color="warning"
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Typography variant="caption" sx={{ color: '#d97706' }}>
                          {formatNumber(product.needToApplyKiz)} шт
                        </Typography>
                      </>
                    ) : (
                      <Chip
                        icon={<ReadyIcon />}
                        label="Готово"
                        color="success"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </TableCell>

                {/* Priority */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title={`${product.daysSupply} дней до окончания запасов`}>
                      <Chip
                        icon={getPriorityIcon(product.priority)}
                        label={getPriorityLabel(product.priority)}
                        sx={{
                          backgroundColor: `${getPriorityColor(product.priority)}10`,
                          color: getPriorityColor(product.priority),
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: getPriorityColor(product.priority),
                          },
                        }}
                        size="small"
                      />
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`
        }
      />
    </Paper>
  );
};

export default ProductPreparationList;
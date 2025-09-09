import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Package as PackageIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import PreparationFilter from '../components/PreparationFilter';
import PreparationStats from '../components/PreparationStats';
import ProductPreparationList from '../components/ProductPreparationList';
import { packagingApi } from '../services/api';

const PackagingPlanning = () => {
  const [preparationData, setPreparationData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    priority: '14' // Default to 14 days
  });

  useEffect(() => {
    loadPreparationData();
  }, [filter]);

  const loadPreparationData = async () => {
    try {
      setLoading(true);
      const [preparationResponse, summaryResponse] = await Promise.all([
        packagingApi.getPreparationList(filter.priority),
        packagingApi.getSummary()
      ]);

      setPreparationData(preparationResponse.data);
      setSummary({
        ...preparationResponse.summary,
        ...summaryResponse.summary
      });
      setError(null);
    } catch (error) {
      console.error('Error loading preparation data:', error);
      setError('Ошибка загрузки данных подготовки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleExportPriority = () => {
    // Export priority items
    console.log('Exporting priority items...');
  };

  const handleExportCompleted = () => {
    // Export completed items
    console.log('Exporting completed items...');
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PackageIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                  📦 Подготовка товаров к поставке
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Товары, которые нужно срочно подготовить к поставке. Данные из листа ТИП - неготовые остатки (столбец J).
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filter */}
        <Grid item xs={12}>
          <PreparationFilter
            filter={filter}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12}>
          <PreparationStats 
            summary={summary}
            filter={filter}
          />
        </Grid>

        {/* Error Alert */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Products List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    📋 Товары требующие подготовки
                  </Typography>
                  <Chip 
                    label={`${preparationData.length} товаров`}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Экспорт по приоритету">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ExportIcon />}
                      onClick={handleExportPriority}
                      sx={{ textTransform: 'none' }}
                    >
                      Экспорт по приоритету
                    </Button>
                  </Tooltip>

                  <Tooltip title="Экспорт выполненных">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ExportIcon />}
                      onClick={handleExportCompleted}
                      color="success"
                      sx={{ textTransform: 'none' }}
                    >
                      Экспорт выполненных
                    </Button>
                  </Tooltip>

                  <Tooltip title="Обновить данные">
                    <IconButton onClick={loadPreparationData} disabled={loading}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {loading && !preparationData.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProductPreparationList 
                  products={preparationData}
                  onRefresh={loadPreparationData}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PackagingPlanning;
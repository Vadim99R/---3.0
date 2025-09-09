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
  FormControl,
  InputLabel,
  Select,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  AutoMode as AutoIcon,
  PlayArrow as GenerateIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import AutoSupplyForm from '../components/AutoSupplyForm';
import SupplyList from '../components/SupplyList';
import { supplyApi } from '../services/api';

const SupplyPlanning = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoSupplyParams, setAutoSupplyParams] = useState({
    limitPerSupply: 5500,
    priorityDays: 14,
    suppliesPerWeek: 4,
    priorityWarehouse: 'kotovsk'
  });

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      setLoading(true);
      const response = await supplyApi.getFormedSupplies();
      setSupplies(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading supplies:', error);
      setError('Ошибка загрузки поставок');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAutoSupply = async () => {
    try {
      setLoading(true);
      const response = await supplyApi.generateAutoSupply(autoSupplyParams);
      setSupplies(response.data.supplies);
      setError(null);
    } catch (error) {
      console.error('Error generating auto supply:', error);
      setError('Ошибка генерации автоматических поставок');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Auto Supply Form */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <AutoIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                  Автоматическое формирование поставок
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Система автоматически создаст оптимальные поставки с приоритетом по 2 неделям, учитывая лимит 5500 штук на поставку и время приемки складов.
              </Typography>

              <AutoSupplyForm
                params={autoSupplyParams}
                onParamsChange={setAutoSupplyParams}
                onGenerate={handleGenerateAutoSupply}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Supply List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                    📦 Сформированные поставки
                  </Typography>
                  <Chip 
                    label={`${supplies.length} поставок`}
                    color="primary"
                    size="small"
                  />
                </Box>
                
                <Tooltip title="Обновить список поставок">
                  <IconButton onClick={loadSupplies} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {loading && !supplies.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <SupplyList supplies={supplies} onRefresh={loadSupplies} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupplyPlanning;
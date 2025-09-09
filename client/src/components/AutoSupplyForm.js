import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  InputAdornment,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  PlayArrow as GenerateIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const AutoSupplyForm = ({ params, onParamsChange, onGenerate, loading }) => {
  const handleChange = (field) => (event) => {
    onParamsChange({
      ...params,
      [field]: event.target.value
    });
  };

  const warehouseOptions = [
    { value: 'kotovsk', label: 'Котовск (приоритетный)' },
    { value: 'samara', label: 'Самара (Новосемейкино)' },
    { value: 'krasnodar_nevinnomyssk', label: 'Краснодар + Невинномысск' },
    { value: 'ekaterinburg', label: 'Екатеринбург' },
  ];

  const priorityDaysOptions = [
    { value: 7, label: '7 дней (срочно)', color: 'error' },
    { value: 14, label: '14 дней (стандарт)', color: 'warning' },
    { value: 21, label: '21 день (заблаговременно)', color: 'success' },
    { value: 30, label: '30 дней (долгосрочно)', color: 'info' },
  ];

  return (
    <Card variant="outlined" sx={{ backgroundColor: '#f8fafc' }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Limit per Supply */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>
                📦 Лимит на поставку (штук)
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="number"
              value={params.limitPerSupply}
              onChange={handleChange('limitPerSupply')}
              InputProps={{
                endAdornment: <InputAdornment position="end">шт</InputAdornment>,
              }}
              sx={{ backgroundColor: '#ffffff' }}
            />
          </Grid>

          {/* Priority Days */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>
                📅 Приоритет дней
              </Typography>
            </Box>
            <TextField
              fullWidth
              select
              value={params.priorityDays}
              onChange={handleChange('priorityDays')}
              sx={{ backgroundColor: '#ffffff' }}
            >
              {priorityDaysOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.label}
                    <Chip 
                      size="small" 
                      label={`${option.value}д`}
                      color={option.color}
                    />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Supplies per Week */}
          <Grid item xs={12} md={2}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>
                🚛 Поставок в неделю (класс)
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="number"
              value={params.suppliesPerWeek}
              onChange={handleChange('suppliesPerWeek')}
              inputProps={{ min: 1, max: 7 }}
              sx={{ backgroundColor: '#ffffff' }}
            />
          </Grid>

          {/* Priority Warehouse */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>
                🏪 Приоритетный склад
              </Typography>
            </Box>
            <TextField
              fullWidth
              select
              value={params.priorityWarehouse}
              onChange={handleChange('priorityWarehouse')}
              sx={{ backgroundColor: '#ffffff' }}
            >
              {warehouseOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Generate Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<GenerateIcon />}
            onClick={onGenerate}
            disabled={loading}
            sx={{
              backgroundColor: '#4f46e5',
              '&:hover': {
                backgroundColor: '#3730a3',
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            ✅ Сформировать поставки автоматически
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AutoSupplyForm;
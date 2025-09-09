import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
} from '@mui/icons-material';

const PreparationFilter = ({ filter, onFilterChange, loading }) => {
  const handleFilterChange = (field) => (event) => {
    onFilterChange({
      ...filter,
      [field]: event.target.value
    });
  };

  const priorityOptions = [
    { 
      value: '7', 
      label: '≤ 7 дней (срочно)', 
      color: 'error',
      description: 'Показать товары которые могут на складе кончиться в течение 7 дней'
    },
    { 
      value: '14', 
      label: '≤ 14 дней (срочно)', 
      color: 'warning',
      description: 'Показать товары которые могут на складе кончиться в течение 14 дней'
    },
    { 
      value: '30', 
      label: '≤ 30 дней', 
      color: 'info',
      description: 'Показать товары которые могут на складе кончиться в течение 30 дней'
    },
  ];

  const currentOption = priorityOptions.find(opt => opt.value === filter.priority);

  return (
    <Card variant="outlined" sx={{ backgroundColor: '#f8fafc' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FilterIcon sx={{ color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🔍 Фильтр по приоритету подготовки
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
          Показать товары которые могут на складе кончиться количество дней
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Приоритет по дням"
              value={filter.priority}
              onChange={handleFilterChange('priority')}
              disabled={loading}
              sx={{ backgroundColor: '#ffffff' }}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.label}
                      <Chip 
                        size="small" 
                        label={`${option.value}д`}
                        color={option.color}
                      />
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {currentOption && (
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f0f9ff', 
                borderRadius: 1,
                border: '1px solid #bae6fd'
              }}>
                <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 500 }}>
                  ℹ️ {currentOption.description}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PreparationFilter;
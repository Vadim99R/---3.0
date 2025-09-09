import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Warning as CriticalIcon,
  Schedule as ScheduleIcon,
  CheckCircle as ReadyIcon,
  Build as NeedPackIcon,
} from '@mui/icons-material';

const PreparationStats = ({ summary, filter }) => {
  const stats = [
    {
      title: 'Критичных',
      subtitle: '≤7 дн',
      value: summary.critical || 0,
      icon: CriticalIcon,
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
    {
      title: 'Срочных',
      subtitle: '≤14 дн',
      value: summary.high || 0,
      icon: ScheduleIcon,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      title: 'Запас в норме',
      subtitle: '>14 дн',
      value: summary.medium || 0,
      icon: ReadyIcon,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
    {
      title: 'Нужно упаковать',
      subtitle: 'на 14 дней',
      value: summary.totalNeedToPack || 0,
      icon: NeedPackIcon,
      color: '#8b5cf6',
      bgColor: '#faf5ff',
    },
  ];

  const packagingStats = {
    totalArticles: summary.totalArticles || 0,
    totalBoxes: summary.totalBoxes || 0,
    boxesWithKiz: summary.boxesWithKiz || 0,
    boxesNeedKiz: summary.boxesNeedKiz || 0,
    kizCompletionRate: summary.kizCompletionRate || 0,
  };

  return (
    <Grid container spacing={3}>
      {/* Priority Stats */}
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: stat.bgColor,
            border: `1px solid ${stat.color}20`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <stat.icon sx={{ color: stat.color, mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: stat.color }}>
                  {stat.title}
                </Typography>
              </Box>
              
              <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                {stat.value.toLocaleString()}
              </Typography>
              
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {stat.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* KIZ Completion Stats */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              📊 Статус КИЗ упаковки
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Готовность КИЗ
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4f46e5' }}>
                      {packagingStats.kizCompletionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={packagingStats.kizCompletionRate}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: packagingStats.kizCompletionRate >= 80 ? '#10b981' : 
                                       packagingStats.kizCompletionRate >= 60 ? '#f59e0b' : '#ef4444',
                      },
                    }}
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#059669' }}>
                        {packagingStats.boxesWithKiz}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Готовы с КИЗ
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fffbeb', borderRadius: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#d97706' }}>
                        {packagingStats.boxesNeedKiz}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Нужно упаковать
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      Всего артикулов:
                    </Typography>
                    <Chip 
                      label={packagingStats.totalArticles}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      Всего коробок:
                    </Typography>
                    <Chip 
                      label={packagingStats.totalBoxes}
                      color="default"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      Общее количество:
                    </Typography>
                    <Chip 
                      label={`${summary.totalQuantity || 0} шт`}
                      color="info"
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PreparationStats;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import {
  LocalShipping as SupplyIcon,
  Inventory2 as PackagingIcon,
  ManageAccounts as ManagementIcon,
  TrackChanges as TrackingIcon,
} from '@mui/icons-material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/supply-planning':
        return 0;
      case '/packaging-planning':
        return 1;
      case '/inventory-management':
        return 2;
      case '/tracking':
        return 3;
      default:
        return 0;
    }
  };

  const handleTabChange = (event, newValue) => {
    const routes = [
      '/supply-planning',
      '/packaging-planning',
      '/inventory-management',
      '/tracking'
    ];
    navigate(routes[newValue]);
  };

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider',
      backgroundColor: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Container maxWidth="xl">
        <Tabs
          value={getCurrentTab()}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#4f46e5',
              height: 3,
            },
          }}
        >
          <Tab
            icon={<SupplyIcon />}
            iconPosition="start"
            label="Авто поставки"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: getCurrentTab() === 0 ? '#4f46e5' : '#6b7280',
              '&:hover': {
                color: '#4f46e5',
              },
            }}
          />
          <Tab
            icon={<PackagingIcon />}
            iconPosition="start"
            label="Подготовка товаров"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: getCurrentTab() === 1 ? '#4f46e5' : '#6b7280',
              '&:hover': {
                color: '#4f46e5',
              },
            }}
          />
          <Tab
            icon={<ManagementIcon />}
            iconPosition="start"
            label="Управление артикулами"
            disabled
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#9ca3af',
            }}
          />
          <Tab
            icon={<TrackingIcon />}
            iconPosition="start"
            label="Отслеживание"
            disabled
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#9ca3af',
            }}
          />
        </Tabs>
      </Container>
    </Box>
  );
};

export default Navigation;
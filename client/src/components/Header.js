import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  CloudUpload as UploadIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InventoryIcon sx={{ color: '#4f46e5', fontSize: 32 }} />
          <Box>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                color: '#111827', 
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              📦 План поставок v2.0
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280',
                fontSize: '0.875rem',
              }}
            >
              Умное планирование поставок с автоматическим формированием
            </Typography>
          </Box>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Settings Connection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon sx={{ color: '#059669', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Настройки подключения
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: '#d1d5db',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Upload Data Button */}
          <Tooltip title="Загрузить данные из Google Sheets">
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              sx={{
                backgroundColor: '#4f46e5',
                '&:hover': {
                  backgroundColor: '#3730a3',
                },
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 1.5,
              }}
            >
              Загрузить данные
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
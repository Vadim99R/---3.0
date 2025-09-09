module.exports = {
  apps: [{
    name: 'supply-planning-api',
    script: './server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
      ANALYTICS_SHEET_ID: '1CYRkUDbHYAHbEfQesY-aCvhEmQtKeQWzNz3W_qKSJY4',
      PACKAGING_SHEET_ID: '1Nejka0eQc4sVchlWP9GY3RWWTvKFmdcnDofJiGeFkXI',
      CLIENT_URL: 'http://localhost:3000',
      CORS_ORIGIN: 'http://localhost:3000'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }, {
    name: 'supply-planning-client',
    script: 'npm',
    args: 'start',
    cwd: './client',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      REACT_APP_API_URL: 'http://localhost:5000'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/client-err.log',
    out_file: './logs/client-out.log',
    log_file: './logs/client-combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
// PM2 Ecosystem config
// pm2 start ecosystem.config.cjs --env production
// pm2 restart hao430-server
// pm2 save

module.exports = {
  apps: [{
    name: 'hao430-server',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: '../logs/server-error.log',
    out_file: '../logs/server-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
}
